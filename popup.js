const $ = (id) => document.getElementById(id);
let site;

async function render() {
  const exceptions = await getExceptions();

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
  const covered = isExcepted(site, exceptions);
  $('current').hidden = false;
  $('site').textContent = site;
  $('toggle').textContent = covered ? `Strip queries on ${covered}` : `Keep queries on ${site}`;
  $('toggle').onclick = () => setExceptions(covered ? exceptions.filter((e) => e !== covered) : [...exceptions, site]);
}

async function setExceptions(list) {
  await chrome.storage.sync.set({ exceptions: [...new Set(list)].sort() });
  await render();
}

$('add').onsubmit = async (e) => {
  e.preventDefault();
  const d = siteOf('https://' + $('domain').value.trim().replace(/^https?:\/\//, ''));
  if (!d) return;
  $('domain').value = '';
  await setExceptions([...(await getExceptions()), d]);
};

(async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  site = tab && siteOf(tab.url);
  render();
})();
