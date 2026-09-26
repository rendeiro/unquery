// Shared by background.js and popup.js.

async function getExceptions() {
  return (await chrome.storage.sync.get('exceptions')).exceptions ?? [];
}

function siteOf(url) {
  try {
    const u = new URL(url);
    return /^https?:$/.test(u.protocol) ? u.hostname.replace(/^www\./, '') : null;
  } catch {
    return null;
  }
}

function isExcepted(site, exceptions) {
  return exceptions.find((e) => site === e || site.endsWith('.' + e));
}

// Returns the URL without its query string, or null if the text should be left alone.
function clean(text, exceptions) {
  const t = text.trim();
  if (/\s/.test(t)) return null;
  const site = siteOf(t);
  if (!site || isExcepted(site, exceptions)) return null;
  const u = new URL(t);
  if (!u.search) return null;
  u.search = '';
  return u.href;
}
