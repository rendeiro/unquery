importScripts('shared.js');

chrome.runtime.onInstalled.addListener(syncRules);

// Remember the original URL of each tab, so the popup can restore it after you add an exception.
chrome.webRequest.onBeforeRequest.addListener(
  (d) => {
    if (d.tabId >= 0 && d.url.includes('?')) chrome.storage.session.set({ [`tab${d.tabId}`]: d.url });
  },
  { urls: ['<all_urls>'], types: ['main_frame'] }
);

chrome.tabs.onRemoved.addListener((tabId) => chrome.storage.session.remove(`tab${tabId}`));
