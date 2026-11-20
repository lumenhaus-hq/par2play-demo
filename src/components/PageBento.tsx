import { BentoGrid, BentoTile } from "./MembershipBento";
import { ADDRESS_LINE, NAP, PRICES, SIMULATOR_COURSE_COUNT } from "../data/business";
import { HOURS_LABEL } from "../data/site";

type PageId = "membership" | "coaching" | "juniors" | "events" | "tournament";

type TileCopy = { eyebrow: string; title: string; line: string };

const hour = `$${PRICES.unlimitedMonthly} a month`;
const lesson = `$${PRICES.lessonSingle} for ${PRICES.lessonMinutes} minutes`;
const pack = `$${PRICES.lessonPack10}`;
const swing = `$${PRICES.swingEvaluation} for ${PRICES.swingEvaluationMinutes} minutes`;
const juniorOnce = `$${PRICES.juniorOneLessonWeekly} a month`;
const juniorTwice = `$${PRICES.juniorTwoLessonsWeekly} a month`;

const PAGES: Record<PageId, { heading: string; lead: string; tiles: readonly TileCopy[] }> = {
  membership: {
    heading: "A bay hour, every day",
    lead: `Unlimited Practice is ${hour}, up to one hour a day, on Full Swing simulators. Four enclosed bays at ${ADDRESS_LINE} are open ${HOURS_LABEL}. More than ${SIMULATOR_COURSE_COUNT} courses are loaded, and premium clubs are on hand when you walk in.`,
    tiles: [
      {
        eyebrow: "The plan",
        title: "One membership",
        line: `${hour} covers up to one hour in a bay every day. There is no second or third tier on this page.`,
      },
      {
        eyebrow: "The room",
        title: "Four enclosed bays",
        line: `Full Swing simulators, more than ${SIMULATOR_COURSE_COUNT} courses, and clubs waiting so you can play in what you wore to work.`,
      },
      {
        eyebrow: "The clock",
        title: HOURS_LABEL,
        line: `Open every day, ${NAP.street}, ${NAP.city}, ${NAP.region}. Book the hour that fits, then come back tomorrow.`,
      },
      {
        eyebrow: "First visit",
        title: "Try a bay first",
        line: `A single bay rental is the way to try Par2Play before Unlimited Practice. Call ${NAP.phoneDisplay} or book a bay online.`,
      },
    ],
  },
  coaching: {
    heading: "Lessons that fit a lunch break",
    lead: `A private lesson is ${lesson}. A 10-pack is ${pack}. A swing evaluation is ${swing}. PGA professionals teach on Full Swing simulators with swing-evaluation cameras, at ${ADDRESS_LINE}. The studio is open ${HOURS_LABEL}, with more than ${SIMULATOR_COURSE_COUNT} courses and clubs on hand.`,
    tiles: [
      {
        eyebrow: "Single lesson",
        title: lesson,
        line: "Thirty minutes with a PGA professional. One session, one plan, then you are back on the course list.",
      },
      {
        eyebrow: "10-pack",
        title: pack,
        line: "Ten private lessons in one pack. The studio is open 10am to 10pm every day, so the next lesson can sit on a weekday.",
      },
      {
        eyebrow: "Swing evaluation",
        title: swing,
        line: "Thirty minutes on the swing-evaluation cameras. A clear place to start before a lesson pack.",
      },
      {
        eyebrow: "The studio",
        title: "Full Swing bays",
        line: `Four enclosed bays, more than ${SIMULATOR_COURSE_COUNT} courses, and clubs on hand at ${NAP.street}.`,
      },
    ],
  },
  juniors: {
    heading: "A weekly hour for kids",
    lead: `Junior coaching is ${juniorOnce} once a week, or ${juniorTwice} for age-group sessions twice a week, one hour each. Lessons are on Full Swing simulators at ${ADDRESS_LINE}, open ${HOURS_LABEL}. Premium clubs are on hand, and more than ${SIMULATOR_COURSE_COUNT} courses are loaded.`,
    tiles: [
      {
        eyebrow: "Once a week",
        title: juniorOnce,
        line: "One hour a week with the junior coaching plan. Same studio, same Full Swing bays, a rhythm you can keep.",
      },
      {
        eyebrow: "Twice a week",
        title: juniorTwice,
        line: "Age-group sessions twice a week, one hour each. The extra day is for kids who want more reps.",
      },
      {
        eyebrow: "The hour",
        title: "One hour each",
        line: `Sessions are one hour. The studio is open ${HOURS_LABEL}, so a lesson can sit after school.`,
      },
      {
        eyebrow: "Somerset",
        title: "Clubs are here",
        line: `Premium clubs are on hand at ${NAP.street}, ${NAP.city}. More than ${SIMULATOR_COURSE_COUNT} courses are on the simulators.`,
      },
    ],
  },
  events: {
    heading: "Your group, our four bays",
    lead: `Par2Play hosts holiday parties, company events, birthdays, and smaller gatherings in four enclosed Full Swing bays. Price is on request. The studio at ${ADDRESS_LINE} is open ${HOURS_LABEL}.`,
    tiles: [
      {
        eyebrow: "Price",
        title: "Price on request",
        line: "Event packages are not listed with a dollar amount. Tell us the date and the group, and we reply with the package.",
      },
      {
        eyebrow: "The group",
        title: "Six to forty",
        line: "Holiday gatherings are invited from 6 to 40 guests. Each bay holds up to 6. Company visits can be 50 or more.",
      },
      {
        eyebrow: "The visit",
        title: "Two or three hours",
        line: "Bookings are 2 hours or 3 hours. A golf pro can run mini-lessons and casual contests. Clubs are complimentary.",
      },
      {
        eyebrow: "Bring-ins",
        title: "Food and BYOB",
        line: "Food can be catered or brought in. Beers and wines are welcome. The room has SONOS music and a karaoke system on the TVs.",
      },
    ],
  },
  tournament: {
    heading: "Fall league, on the simulators",
    lead: `The Par2Play Fall League is an indoor round on Full Swing simulators: 18 holes each round. Entry price is on request. Play at ${ADDRESS_LINE}, open ${HOURS_LABEL}. Four enclosed bays, more than ${SIMULATOR_COURSE_COUNT} courses, and premium clubs on hand if you do not bring a bag. The league is coming soon. Leave an email and Par2Play will write when the list opens. Weather stays outside. The round is on the simulators either way. Call ${NAP.phoneDisplay} if you want the entry confirmed before the note goes out.`,
    tiles: [
      {
        eyebrow: "The round",
        title: "18 holes",
        line: `Each round is 18 holes on the simulators. Same four enclosed bays, more than ${SIMULATOR_COURSE_COUNT} courses to draw from.`,
      },
      {
        eyebrow: "Price",
        title: "Price on request",
        line: `The league fee is not published. Join the list or call ${NAP.phoneDisplay} and we will confirm the entry.`,
      },
      {
        eyebrow: "Where",
        title: NAP.city,
        line: `${ADDRESS_LINE}. Indoor, so the round does not wait on weather. Open ${HOURS_LABEL}.`,
      },
      {
        eyebrow: "Gear",
        title: "Clubs on hand",
        line: "Premium clubs are here if you do not bring a bag. The league is coming soon. The form on this page asks for an email only. Nothing is charged here, because the entry price is still on request.",
      },
    ],
  },
};

export function PageBento({ page }: { page: PageId }) {
  const copy = PAGES[page];
  return (
    <section className="page-bento scroll-mt-32 mt-16" aria-labelledby={`${page}-bento-heading`}>
      <h2 id={`${page}-bento-heading`} className="font-display text-3xl font-semibold tracking-tight">
        {copy.heading}
      </h2>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed">{copy.lead}</p>
      <div className="mt-8">
        <BentoGrid>
          {copy.tiles.map((tile) => (
            <BentoTile key={tile.title} label={tile.title}>
              <p className="membership-bento__eyebrow">{tile.eyebrow}</p>
              <h3 className="membership-bento__title">{tile.title}</h3>
              <p className="membership-bento__line">{tile.line}</p>
            </BentoTile>
          ))}
        </BentoGrid>
      </div>
    </section>
  );
}
