// src/lib/googleSheets.ts

export type SheetRow = string[];

/**
 * Fetches all values from a Google Sheets range using the Sheets API v4 and API key.
 */
export async function fetchSheetValues(spreadsheetId: string, apiKey: string, range = "Sheet1") {
  if (!spreadsheetId || !apiKey) throw new Error("Missing spreadsheetId or apiKey for Google Sheets request");

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId,
  )}/values/${encodeURIComponent(range)}?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Sheets API error: ${res.status} - ${text}`);
  }
  const json = await res.json();
  return (json.values ?? []) as SheetRow[];
}

/**
 * Find a link from sheet rows by matching either email or username (case-insensitive).
 */
export function findLinkInRows(rows: SheetRow[], userName?: string | null, email?: string | null) {
  if (!rows || rows.length === 0) return null;
  const header = rows[0].map((h) => (h ?? "").toString().trim().toLowerCase());

  const emailIdx = header.findIndex((h) => h === "email");
  const nameIdx = header.findIndex((h) => h === "username" || h === "name");
  const linkIdx = header.findIndex((h) => h === "link" || h === "url" || h === "drive_link" || h === "file" || h === "file_link");

  if (linkIdx === -1) return null;

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (emailIdx !== -1 && email && row[emailIdx] && row[emailIdx].toString().trim().toLowerCase() === email.toLowerCase()) {
      return row[linkIdx]?.toString() ?? null;
    }
  }
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (nameIdx !== -1 && userName && row[nameIdx] && row[nameIdx].toString().trim().toLowerCase() === userName.toLowerCase()) {
      return row[linkIdx]?.toString() ?? null;
    }
  }

  return null;
}

/**
 * Convert a Google Drive share/view URL into a direct-download endpoint.
 * This version also handles Google Sheets export.
 */
export function makeDriveDirectDownloadUrl(link: string | null, apiKey: string) {
  if (!link) return null;

  try {
    const l = link.trim();
    const idMatch = l.match(/\/d\/([a-zA-Z0-9_-]{28,})/);

    if (idMatch && idMatch[1]) {
      const fileId = idMatch[1];
      const isGoogleSheet = fileId.length >= 44; 

      if (isGoogleSheet) {
        const mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        return `https://www.googleapis.com/drive/v3/files/${fileId}/export?mimeType=${encodeURIComponent(mimeType)}&key=${encodeURIComponent(apiKey)}`;
      } else {
        return `https://drive.google.com/uc?export=download&id=${fileId}`;
      }
    }
    
    return l;
    
  } catch (e) {
    return link;
  }
}