importScripts('shared.js');

async function ensureOffscreen() {
  if (await chrome.offscreen.hasDocument()) return;
  await chrome.offscreen.createDocument({
    url: 'offscreen.html',
    reasons: ['CLIPBOARD'],
    justification: 'Watch the clipboard and strip queries from copied URLs',
  });
}

chrome.runtime.onInstalled.addListener(ensureOffscreen);
chrome.runtime.onStartup.addListener(ensureOffscreen);
ensureOffscreen();

// The offscreen page sends each new clipboard text here, since it can't read storage itself.
chrome.runtime.onMessage.addListener((text, _sender, reply) => {
  getExceptions().then((ex) => reply(clean(text, ex)));
  return true;
});
