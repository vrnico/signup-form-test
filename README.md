# signup-form-test

A tiny static page with an email signup form that POSTs to a Google Apps Script
endpoint, which writes each submission as a row in a Google Sheet.

Built as a teaching artifact for the Founding Federation cohort. Demo of the
"form → Apps Script → Sheet" pattern: no backend, no database, no Mailchimp, no
domain. Free, forever, ~15 lines of code.

## What's in the repo

- `index.html` — the form. Paste your Apps Script Web app URL into the
  `ENDPOINT` constant near the bottom of the file.
- `apps-script.gs` — the Apps Script that lives inside the Google Sheet. Paste
  it into Tools → Apps Script and replace `SHEET_ID` with your Sheet's ID.
- `README.md` — this file.

## Setup, end to end

1. **Make a Google Sheet.** Add three column headers in row 1:
   `timestamp / email / source`.
2. **Open Apps Script** from inside the Sheet: Tools → Apps Script. Paste in
   the contents of `apps-script.gs`. Replace `SHEET_ID` with the long ID from
   the Sheet's URL (the part between `/d/` and `/edit`). Save.
3. **Deploy.** Deploy → New deployment → Type: Web app → Description: anything
   → Execute as: Me → Who has access: Anyone → Deploy. Authorize when prompted
   (Google will warn the script is "unsafe" because it's a personal script —
   click Advanced → "Go to (unsafe) project" → Allow). Copy the Web app URL.
4. **Wire up the form.** Open `index.html` and paste the Web app URL into the
   `ENDPOINT` constant (search for `PASTE_YOUR_APPS_SCRIPT_URL_HERE`).
5. **Test.** Open the page (locally, on GitHub Pages, wherever). Submit your
   own email from your phone. The row should appear in the Sheet within a
   second or two. **Don't share the form URL publicly until you've seen a real
   row land.**

## Hosting this page

This is a single static HTML file. Anywhere that serves static files works:

- **GitHub Pages** — Settings → Pages → Source: Deploy from a branch → `main`
  → `/root` → Save. Public URL appears within ~30 seconds. Free.
- **Netlify Drop** — drag the file in.
- **Local `file://`** — for the demo, just open `index.html` in a browser.
- **Your existing site** — paste the HTML into wherever your landing page
  lives (a Code Block on Squarespace, an HTML block in Notion via embed.im or
  super.so, the Custom Code embed on Carrd, the Embed element in Webflow, an
  HTML block in WordPress).

## Why `no-cors`?

The fetch in `index.html` uses `mode: 'no-cors'` to avoid a CORS preflight
request. Apps Script's Web app endpoint accepts the POST regardless. We can't
read the response from the browser, but the row still lands in the Sheet,
which is the part that matters. The form shows a "thanks!" message on its
own.

If you need to read the response (e.g. to show a server-rendered error), you
can change the Apps Script to return CORS headers, but for a confirmation flow
the no-cors approach is the simplest reliable thing.

## Customizing

- Change the heading, paragraph copy, and button text in `index.html` to match
  your project's voice.
- The CSS at the top of the file is the only styling; tweak colors via the
  `:root` variables.
- The `source` field defaults to `location.hostname` so you can later tell
  which page a signup came from. Useful if you put the same form on multiple
  pages.

## Adding more fields

Add another input to the form and pass it through in the JSON body:

```html
<input name="name" type="text" placeholder="your name">
```

```js
body: JSON.stringify({
  email,
  name: form.name.value,
  source: location.hostname || 'local'
})
```

Then update `apps-script.gs` to push it onto the row:

```js
sheet.appendRow([new Date(), data.email, data.name || '', data.source || '']);
```

## What this is not

- Not a transactional email service. If you want to send the signer a
  confirmation email automatically, that's another 10 lines of Apps Script
  using `MailApp.sendEmail`, but Google's free tier caps outbound mail at
  ~100/day.
- Not a newsletter system. For broadcasts, segmentation, click tracking, and
  unsubscribe handling, graduate to a real mail provider (ConvertKit,
  Buttondown, Mailchimp, Resend, Zoho).
- Not a substitute for talking to your first 25 signups by hand. It's just
  the gate that catches the moment they care.
