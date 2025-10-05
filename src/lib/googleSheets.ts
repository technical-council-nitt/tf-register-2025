export type SheetRow = string[];

/**
 * Fetches all values from a Google Sheets range using the Sheets API v4 and API key.
 * Expects environment variables to provide the spreadsheet id and API key, or they can
 * be passed in directly.
 */
export async function fetchSheetValues(spreadsheetId: string, apiKey: string, range = "Sheet1") {
  if (!spreadsheetId || !apiKey) throw new Error("Missing spreadsheetId or apiKey for Google Sheets request");

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(
    spreadsheetId,
  )}/values/${encodeURIComponent(range)}?key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Google Sheets API error: ${res.status} ${res.statusText} - ${text}`);
  }
  const json = await res.json();
  // json.values is an array of arrays (rows)
  return (json.values ?? []) as SheetRow[];
}

/**
 * Find a link from sheet rows by matching either email or username (case-insensitive).
 * Sheet is expected to have a header row containing one of: 'email', 'username'/'name', and 'link'/'url'.
 */
export function findLinkInRows(rows: SheetRow[], userName?: string | null, email?: string | null) {
  if (!rows || rows.length === 0) return null;
  const header = rows[0].map((h) => (h ?? "").toString().trim().toLowerCase());

  const emailIdx = header.findIndex((h) => h === "email");
  const nameIdx = header.findIndex((h) => h === "username" || h === "name");
  const linkIdx = header.findIndex((h) => h === "link" || h === "url" || h === "drive_link" || h === "file" || h === "file_link");

  if (linkIdx === -1) return null;

  // try to match by email first, then by name
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
 * Convert known Google Drive share/view URLs into a direct-download endpoint when possible.
 * Falls back to returning the original link.
 */
export function makeDriveDirectDownloadUrl(link?: string | null) {
  if (!link) return null;
  try {
    const l = link.trim();
    // Patterns like: https://drive.google.com/file/d/FILEID/view?usp=sharing
    const dMatch = l.match(/\/d\/([a-zA-Z0-9_-]{10,})/);
    if (dMatch && dMatch[1]) return `https://drive.google.com/uc?export=download&id=${dMatch[1]}`;
    // Patterns with id=FILEID
    const idMatch = l.match(/[?&]id=([a-zA-Z0-9_-]{10,})/);
    if (idMatch && idMatch[1]) return `https://drive.google.com/uc?export=download&id=${idMatch[1]}`;
    // If the link already points to docs or any other resource, return as-is
    return l;
  } catch (e) {
    return link;
  }
}
