// Apps Script for the signup form.
//
// Where this goes:
//   1. Create a Google Sheet.
//   2. Add headers in row 1: timestamp / email / source.
//   3. Tools → Apps Script. Paste this whole file in.
//   4. Replace SHEET_ID below with your Sheet's ID (the long string in the Sheet's URL,
//      between /d/ and /edit).
//   5. Save. Deploy → New deployment → Type: Web app → Access: Anyone → Deploy.
//   6. Authorize (Google will warn the script is "unsafe" because it's yours,
//      click Advanced → "Go to (unsafe) project" → Allow).
//   7. Copy the Web app URL it gives you. Paste it into index.html as ENDPOINT.

const SHEET_ID = 'PASTE_YOUR_SHEET_ID_HERE';
const SHEET_NAME = 'Sheet1';

function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  sheet.appendRow([
    new Date(),
    data.email || '',
    data.source || ''
  ]);
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Optional: a doGet for a sanity check in the browser.
// Visit your Web app URL in a tab and you should see {"status":"ok"}.
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
