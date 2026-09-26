const box = document.getElementById('box');
let last = null;

function read() {
  box.value = '';
  box.select();
  document.execCommand('paste');
  return box.value;
}

function write(text) {
  box.value = text;
  box.select();
  document.execCommand('copy');
}

setInterval(async () => {
  const text = read();
  if (text === last) return;
  last = text;
  const cleaned = await chrome.runtime.sendMessage(text);
  if (cleaned && cleaned !== text) {
    write(cleaned);
    last = cleaned;
  }
}, 500);
