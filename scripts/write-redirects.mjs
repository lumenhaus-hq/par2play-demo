import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const base = (process.env.VITE_BASE || "/").replace(/\/?$/, "/");
const poster = resolve("dist/media/hero-poster.jpg");
if (!existsSync(poster)) {
  throw new Error("og:image missing from the build: dist/media/hero-poster.jpg");
}

const redirects = [
  ["bay-rental", "membership/", "Membership"],
  ["holiday-party", "events/", "Events"],
  ["location", "", "Par2Play"],
  ["golf-lessions", "coaching/", "Golf lessons"],
];

for (const [from, to, label] of redirects) {
  const target = `${base}${to}`;
  const canonical = `https://par2play.com/${to}`;
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Redirecting to ${label}</title>
    <link rel="canonical" href="${canonical}" />
    <meta name="robots" content="noindex" />
    <meta http-equiv="refresh" content="0; url=${target}" />
    <script>location.replace(${JSON.stringify(target)});</script>
  </head>
  <body>
    <p><a href="${target}">${label}</a></p>
  </body>
</html>
`;
  const file = resolve("dist", from, "index.html");
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log("redirect", `/${from}/`, "->", target);
}

console.log("og:image", poster);
