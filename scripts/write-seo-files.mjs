import { readFileSync, writeFileSync } from "node:fs";

const source = readFileSync(new URL("../src/data/site.ts", import.meta.url), "utf8");
const business = readFileSync(new URL("../src/data/business.ts", import.meta.url), "utf8");
const site = source.match(/export const SITE_URL = "([^"]+)"/)?.[1];
const courses = business.match(/export const SIMULATOR_COURSE_COUNT = (\d+)/)?.[1];
if (!site || !courses) throw new Error("Could not read SITE_URL or SIMULATOR_COURSE_COUNT");
const origin = site.replace(/\/$/, "");

function readNumber(name) {
  const value = business.match(new RegExp(`^\\s*${name}: (\\d+)`, "m"))?.[1];
  if (!value) throw new Error(`Could not read ${name} from business.ts`);
  return value;
}

const unlimited = readNumber("unlimitedMonthly");
const lesson = readNumber("lessonSingle");
const lessonMinutes = readNumber("lessonMinutes");
const pack = readNumber("lessonPack10");
const swing = readNumber("swingEvaluation");
const swingMinutes = readNumber("swingEvaluationMinutes");
const juniorOnce = readNumber("juniorOneLessonWeekly");
const juniorTwice = readNumber("juniorTwoLessonsWeekly");
const LASTMOD = "2026-11-20";

const routes = [
  ["", "Indoor golf in Somerset, NJ"],
  ["membership/", "Indoor golf membership"],
  ["coaching/", "Golf lessons"],
  ["swing-evaluation/", "Swing evaluation"],
  ["juniors/", "Junior golf"],
  ["events/", "Events"],
  ["tournament/", "Fall League"],
  ["privacy-policy/", "Privacy policy"],
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
  .map(
    ([path]) => `  <url>
    <loc>${origin}/${path}</loc>
    <lastmod>${LASTMOD}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const robots = `User-agent: *
Allow: /

# Search and AI answer engines
User-agent: Googlebot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Bingbot
Allow: /
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Perplexity-User
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Claude-SearchBot
Allow: /
User-agent: Claude-User
Allow: /
User-agent: Applebot
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: CCBot
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

const llms = `# Par2Play

> Par2Play is an indoor golf studio at 695 Hamilton Street, Suite G, Somerset, NJ 08873 (Franklin Township, near New Brunswick). Four enclosed Full Swing golf simulator bays, private golf lessons with PGA professionals, junior golf coaching, memberships, and private events. Phone (732) 448-2769. Email info@par2play.com.

## Key facts
- Address: 695 Hamilton Street, Suite G, Somerset, NJ 08873
- Phone: (732) 448-2769
- Hours: 10am–10pm, Monday–Sunday
- Simulators: Full Swing, 4 enclosed bays, complimentary premium golf clubs, ${courses}+ courses
- Coaching: PGA professionals for private lessons and swing evaluations
- Booking: https://par2play.oclock.app/book
- Instagram: https://www.instagram.com/par2play/
- Facebook: https://www.facebook.com/people/Par2play/100090440193611/ (the page linked from the live par2play.com footer). A Google listing points at a different page, facebook.com/102565266099864. That second page is not used here.

## Prices (USD)
- Unlimited Practice membership: $${unlimited}/month, up to 1 hour a day
- Single bay rental: shown at checkout
- Private lesson, ${lessonMinutes} min: $${lesson}
- Lesson 10-pack: $${pack}
- Swing evaluation, ${swingMinutes} min: $${swing}
- Junior coaching, once a week: $${juniorOnce}/month
- Junior coaching, twice a week: $${juniorTwice}/month
- Event packages and the league fee: price on request

## Pages
- [Home](${origin}/): indoor golf in Somerset, NJ
- [Membership](${origin}/membership/): Unlimited Practice, $${unlimited} a month
- [Golf lessons](${origin}/coaching/): ${lessonMinutes}-minute lessons and the 10-pack
- [Swing evaluation](${origin}/swing-evaluation/): ${swingMinutes} minutes, $${swing}
- [Junior golf](${origin}/juniors/): junior coaching once or twice a week
- [Events](${origin}/events/): holiday parties, company events, birthdays. Price on request
- [Fall League](${origin}/tournament/): indoor golf league. Price on request
`;

writeFileSync(new URL("../public/sitemap.xml", import.meta.url), sitemap);
writeFileSync(new URL("../public/robots.txt", import.meta.url), robots);
writeFileSync(new URL("../public/llms.txt", import.meta.url), llms);
console.log("wrote sitemap, robots.txt, llms.txt for", origin);
