import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { IncomingForm } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const teamId = req.query.teamId as string;

  if (!teamId) {
    return res.status(400).json({ error: 'Team ID is required' });
  }

  const form = formidable({
    uploadDir: './tmp',
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  });

  try {
    const [fields, files] = await form.parse(req);

    const transactionId = Array.isArray(fields.transactionId) ? fields.transactionId[0] : fields.transactionId;
    const screenshotFile = Array.isArray(files.screenshot) ? files.screenshot[0] : files.screenshot;

    if (!transactionId || !screenshotFile) {
      return res.status(400).json({ error: 'Transaction ID and screenshot are required' });
    }

    const supabase = createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Check if user is part of the team (assume Teams table has members array or relation)
    const { data: team, error: teamError } = await supabase
      .from('Teams')
      .select('*, members(*)') // Adjust based on schema; assume members relation
      .eq('team_id', teamId)
      .single();

    if (teamError || !team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    // Check if user is owner or member
    const isMember = team.members?.some((m: any) => m.user_id === user.id) || team.user_id === user.id;
    if (!isMember) {
      return res.status(403).json({ error: 'Not authorized for this team' });
    }

    // Count members
    const memberCount = team.members?.length || 1; // Include owner if no members array
    if (memberCount < 4) {
      return res.status(400).json({ error: 'Team must have at least 4 members to submit payment' });
    }

    // Upload screenshot to Supabase Storage
    const fileExt = path.extname(screenshotFile.originalFilename || '');
    const fileName = `teams/${teamId}/${Date.now()}${fileExt}`;
    const fileBuffer = fs.readFileSync(screenshotFile.filepath);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('screenshots') // Assume bucket name
      .upload(fileName, fileBuffer, {
        contentType: screenshotFile.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return res.status(500).json({ error: 'Failed to upload screenshot' });
    }

    const screenshotUrl = supabase.storage.from('screenshots').getPublicUrl(fileName).data.publicUrl;

    // Insert payment record
    const { error: paymentError } = await supabase
      .from('payments') // Assume payments table
      .insert({
        team_id: teamId,
        transaction_id: transactionId,
        screenshot_url: screenshotUrl,
        status: 'pending',
        user_id: user.id,
        created_at: new Date().toISOString(),
      });

    if (paymentError) {
      console.error('Payment insert error:', paymentError);
      return res.status(500).json({ error: 'Failed to record payment' });
    }

    // Update team status
    const { error: updateError } = await supabase
      .from('Teams')
      .update({ payment_status: 'Processing' })
      .eq('team_id', teamId);

    if (updateError) {
      console.error('Update error:', updateError);
      return res.status(500).json({ error: 'Failed to update team status' });
    }

    // Clean up temp file
    fs.unlinkSync(screenshotFile.filepath);

    res.status(200).json({ success: true, message: 'Payment submitted successfully' });
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
