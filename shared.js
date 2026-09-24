// Shared by background.js and popup.js.

const DEFAULT_EXCEPTIONS = ['google.com', 'youtube.com', 'duckduckgo.com', 'bing.com'];

// Login flows pass these in the URL. Stripping them would break sign-in everywhere.
const AUTH_PARAMS = 'code|state|token|access_token|id_token|ticket|nonce|oauth_token|oauth_verifier|SAMLRequest|SAMLResponse';

async function getSettings() {
  const s = await chrome.storage.sync.get(['exceptions', 'enabled']);
  return { exceptions: s.exceptions ?? DEFAULT_EXCEPTIONS, enabled: s.enabled ?? true };
}

async function saveSettings(patch) {
  await chrome.storage.sync.set(patch);
  await syncRules();
}

async function syncRules() {
  const { exceptions, enabled } = await getSettings();
  const page = ['main_frame'];
  const rules = [];
  if (enabled) {
    rules.push({
      id: 1, priority: 1,
      action: { type: 'redirect', redirect: { transform: { query: '' } } },
      condition: { regexFilter: '^https?://[^?#]*\\?', resourceTypes: page, requestMethods: ['get'] },
    });
    rules.push({
      id: 2, priority: 2,
      action: { type: 'allow' },
      condition: { regexFilter: `[?&](${AUTH_PARAMS})=`, resourceTypes: page },
    });
    if (exceptions.length) {
      rules.push({
        id: 3, priority: 2,
        action: { type: 'allow' },
        condition: { requestDomains: exceptions, resourceTypes: page },
      });
    }
  }
  const old = await chrome.declarativeNetRequest.getDynamicRules();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: old.map((r) => r.id),
    addRules: rules,
  });
}

function siteOf(url) {
  try {
    const u = new URL(url);
    return /^https?:$/.test(u.protocol) ? u.hostname.replace(/^www\./, '') : null;
  } catch {
    return null;
  }
}
