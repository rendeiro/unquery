# Unquery

A tiny Chrome extension that removes the whole query string (`?utm_source=...&fbclid=...`) from every page you open. No lists of tracking parameters to maintain: everything after the `?` goes, unless you've added the site as an exception.

`https://example.com/post?utm_source=x&ref=y#top` becomes `https://example.com/post#top`

## Install

1. Clone or download this repo.
2. Open `chrome://extensions` and turn on **Developer mode**.
3. Click **Load unpacked** and pick the folder.

## Use

Click the icon to:

- turn it on or off
- keep queries on the current site (it reloads the page with the original URL)
- add or remove exceptions by hand

An exception covers its subdomains too, so `google.com` also covers `mail.google.com`.

## Defaults

- **Exceptions:** `google.com`, `youtube.com`, `duckduckgo.com`, `bing.com`, since search and video pages need their queries. Remove them if you don't want them.
- **Login links are left alone.** URLs carrying `code`, `state`, `token`, `ticket` and similar sign-in parameters are never touched, so logging in still works.
- Only top-level page loads using GET are affected. Images, scripts, API calls and form posts are not.

## How it works

It uses Chrome's `declarativeNetRequest` to rewrite the URL before the request is sent. Nothing is logged or sent anywhere. Settings sync through your Chrome profile.

## License

MIT
