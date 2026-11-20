# Par2Play cutover checklist

Go-live is the night of 20 Nov 2026, after the 10pm IST call. The host is still a choice between Azure Static Web Apps, Netlify, Cloudflare Pages, or another static host. This build does not assume one.

Keep the current WordPress DNS records written down before changing anything. Rollback is pointing DNS back at that host.

## 1. Build the production site

From a clean checkout of the release commit:

```bash
npm ci
npm run build:prod
```

`build:prod` sets:

- `VITE_BASE=/` so CSS, JS, images, and fonts load from the domain root on par2play.com
- `VITE_DEMO=false` so the layout switcher is left out of the header

The GitHub Pages demo stays on the existing workflow. Do not use `build:prod` for that site. Its command is still:

```bash
VITE_BASE=/par2play-demo/ npm run build
```

Upload the `dist/` folder. Do not upload the repo root.

Confirm these files are in the upload:

- `media/hero-poster.jpg` (the Open Graph image at `https://par2play.com/media/hero-poster.jpg`)
- `staticwebapp.config.json` (Azure Static Web Apps)
- `_redirects` (Netlify and Cloudflare Pages)
- `bay-rental/index.html`, `holiday-party/index.html`, `location/index.html`, `golf-lessions/index.html` (meta refresh plus a JavaScript `location.replace`, with a canonical link to the new URL)

## 2. Prefer a server 301

The HTML redirect pages are the fallback when the host cannot rewrite. Use a 301 when the host can.

| Old path | New path |
| --- | --- |
| `/bay-rental` and `/bay-rental/` | `/membership/` |
| `/holiday-party` and `/holiday-party/` | `/events/` |
| `/location` and `/location/` | `/` |
| `/golf-lessions` and `/golf-lessions/` | `/coaching/` |

The spelling `golf-lessions` matches the old WordPress URL.

Azure Static Web Apps reads `staticwebapp.config.json` from the site root. Netlify and Cloudflare Pages read `_redirects`. Both files are already in `dist/`.

## 3. DNS and SSL

1. Deploy `dist/` to a preview URL on the chosen host and run the smoke tests there first.
2. Copy the live DNS records for `par2play.com` and `www.par2play.com`.
3. Attach both hostnames to the new host and wait until the host shows a valid certificate for each.
4. Point DNS at the new host only after the preview smoke tests pass and the certificate is issued.
5. Open `https://par2play.com/` and `https://www.par2play.com/` and confirm the lock icon. The site treats both hostnames as production.

## 4. Analytics

Google Tag Manager container `GTM-M85LSDB3` is the only container this site loads.

- The HTML sets Consent Mode defaults to denied before any tag runs.
- The container script is injected only after a visitor accepts analytics or marketing cookies.
- It is injected only when the hostname is `par2play.com` or `www.par2play.com`. The GitHub Pages demo does not load it.
- Rejecting cookies, or sending Global Privacy Control, keeps marketing off.

## 5. Smoke tests

On the preview URL, then again on `https://par2play.com/`:

- Home, membership, coaching, juniors, events, tournament, and privacy policy each render and show no React hydration error in the console.
- Membership shows Unlimited Practice at $200 a month, up to 1 hour a day. No Silver, Gold, or Platinum.
- Coaching shows a lesson at $100 for 30 minutes, a 10-pack at $750, and swing evaluation at $100 for 30 minutes. The buttons say “Book swing evaluation” and “Book lessons”.
- Events and the tournament say price on request.
- Header shows “Book a Bay” and an icon menu on a phone and on a desktop window. Escape closes the menu.
- `/media/hero-poster.jpg` returns the image.
- `/bay-rental/`, `/holiday-party/`, `/location/`, and `/golf-lessions/` land on membership, events, home, and coaching.
- The privacy page still shows the draft banner and the TBD marks.
- Accepting cookies on the production host loads `gtm.js?id=GTM-M85LSDB3`. Rejecting cookies does not.

Playwright against a demo build:

```bash
VITE_BASE=/par2play-demo/ npm run build
npx playwright test
```

Against a production build, point the suite at the same base the build used:

```bash
npm run build:prod
PLAYWRIGHT_BASE=/ npx playwright test
```

## 6. Rollback

1. Put the saved WordPress DNS records back on `par2play.com` and `www.par2play.com`.
2. Leave the WordPress host running until this cutover has stayed up. The new static deploy can stay in place; traffic follows DNS.
3. Do not delete the WordPress site as part of the first night.
