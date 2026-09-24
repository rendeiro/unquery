const $ = (id) => document.getElementById(id);
let tab, site, original;

async function render() {
  const { exceptions, enabled } = await getSettings();
  $('enabled').checked = enabled;

  $('list').replaceChildren(...exceptions.map((d) => {
    const li = document.createElement('li');
    const x = document.createElement('button');
    x.textContent = '×';
    x.title = 'Remove';
    x.onclick = () => setExceptions(exceptions.filter((e) => e !== d));
    li.append(d, x);
    return li;
  }));
  if (!exceptions.length) $('list').innerHTML = '<li class="muted">None</li>';

  if (!site) return;
  const covered = exceptions.find((e) => site === e || site.endsWith('.' + e));
  $('current').hidden = false;
  $('site').textContent = site;
  $('toggle').textContent = covered ? `Strip queries on ${covered}` : `Keep queries on ${site}`;
  $('toggle').onclick = () => covered
    ? setExceptions(exceptions.filter((e) => e !== covered))
    : setExceptions([...exceptions, site]).then(restore);
  $('restore').hidden = !(covered && original);
}

async function setExceptions(list) {
  await saveSettings({ exceptions: [...new Set(list)].sort() });
  await render();
}

async function restore() {
  if (original) await chrome.tabs.update(tab.id, { url: original });
  window.close();
}

$('enabled').onchange = (e) => saveSettings({ enabled: e.target.checked });
$('restore').onclick = restore;
$('add').onsubmit = async (e) => {
  e.preventDefault();
  const d = siteOf('https://' + $('domain').value.trim().replace(/^https?:\/\//, ''));
  if (!d) return;
  $('domain').value = '';
  const { exceptions } = await getSettings();
  await setExceptions([...exceptions, d]);
};

(async () => {
  [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  site = tab && siteOf(tab.url);
  if (site) {
    const key = `tab${tab.id}`;
    const saved = (await chrome.storage.session.get(key))[key];
    // Only offer a restore when the saved URL is for this site and differs from what is loaded now.
    if (saved && siteOf(saved) === site && saved !== tab.url) original = saved;
  }
  render();
})();
