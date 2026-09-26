# Unquery

A tiny Chrome extension that removes the whole query string (`?utm_source=...&fbclid=...`) from URLs you copy, so the links you share are clean. Browsing is untouched: pages load with their full URL.

Copy `https://example.com/post?utm_source=x&ref=y#top` and you paste `https://example.com/post#top`.

## Install

1. Clone or download this repo.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and pick the folder.

## Use

Copy a URL the usual way (address bar, right-click "Copy link address", Cmd+C). Paste it anywhere and the query is gone.

Some links need their query, like `youtube.com/watch?v=...`. Click the icon to keep queries on the current site, or add and remove exceptions by hand. An exception covers its subdomains too, so `google.com` also covers `mail.google.com`.

## Details

- Only a clipboard holding just a URL is changed. Text with a URL inside it is left alone.
- It works while Chrome is open, including for URLs copied in other apps.
- It checks the clipboard twice a second from a hidden extension page. Nothing is logged or sent anywhere. Exceptions sync through your Chrome profile.

## License

MIT
