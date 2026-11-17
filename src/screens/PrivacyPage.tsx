import { Fragment, type ReactNode } from "react";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { JsonLd } from "../components/JsonLd";
import { PageFrame, pageSpace } from "../components/SiteChrome";
import source from "../content/privacy-policy.md?raw";
import { privacyGraph } from "../data/schema";

const SIGN_OFF = /\[NEEDS ATUL\/CHANDAN SIGN-OFF:\s*([^\]]+)\]/g;

function stripDraftMarks(text: string): string {
  return text
    .replace(/~~[\s\S]*?~~/g, "")
    .replace(/\*\*\[EDIT[^\]]*\]\*\*/g, "")
    .replace(/\[EDIT[^\]]*\]/g, "")
    .replace(/\*\(([^)]*)\)\*/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function inline(text: string, keyPrefix: string): ReactNode[] {
  const cleaned = stripDraftMarks(text);
  const nodes: ReactNode[] = [];
  const pattern = /\[NEEDS ATUL\/CHANDAN SIGN-OFF:\s*([^\]]+)\]|\*\*([^*]+)\*\*|`([^`]+)`|(https?:\/\/[^\s)]+)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = pattern.exec(cleaned))) {
    if (match.index > cursor) nodes.push(cleaned.slice(cursor, match.index));
    const key = `${keyPrefix}-${index}`;
    if (match[1]) {
      nodes.push(
        <span key={key} className="mx-0.5 inline-block rounded bg-[#fff3bf] px-1.5 py-0.5 text-sm font-semibold text-ink">
          TBD — needs Atul/Chandan sign-off: {match[1].trim()}
        </span>,
      );
    } else if (match[2]) {
      nodes.push(<strong key={key}>{match[2]}</strong>);
    } else if (match[3]) {
      nodes.push(
        <code key={key} className="text-sm">
          {match[3]}
        </code>,
      );
    } else if (match[4]) {
      nodes.push(
        <a key={key} className="underline decoration-2 underline-offset-4" href={match[4]}>
          {match[4]}
        </a>,
      );
    }
    cursor = match.index + match[0].length;
    index += 1;
  }
  if (cursor < cleaned.length) nodes.push(cleaned.slice(cursor));
  return nodes;
}

type Block =
  | { kind: "h"; level: 1 | 2 | 3 | 4; text: string }
  | { kind: "p"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "table"; headers: string[]; rows: string[][] };

function cells(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function blocks(): Block[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const result: Block[] = [];
  let index = 0;
  while (index < lines.length) {
    const line = lines[index] ?? "";
    if (!line.trim()) {
      index += 1;
      continue;
    }
    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading?.[1] && heading[2]) {
      result.push({ kind: "h", level: heading[1].length as 1 | 2 | 3 | 4, text: heading[2] });
      index += 1;
      continue;
    }
    if (line.trim().startsWith("|")) {
      const tableLines: string[] = [];
      while (index < lines.length && (lines[index] ?? "").trim().startsWith("|")) {
        tableLines.push(lines[index] ?? "");
        index += 1;
      }
      const headers = cells(tableLines[0] ?? "");
      const rows = tableLines.slice(2).map(cells);
      result.push({ kind: "table", headers, rows });
      continue;
    }
    if (line.trim().startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && (lines[index] ?? "").trim().startsWith("- ")) {
        items.push((lines[index] ?? "").trim().slice(2));
        index += 1;
      }
      result.push({ kind: "ul", items });
      continue;
    }
    const paragraph: string[] = [];
    while (index < lines.length && (lines[index] ?? "").trim() && !/^(#{1,4})\s/.test(lines[index] ?? "") && !(lines[index] ?? "").trim().startsWith("|") && !(lines[index] ?? "").trim().startsWith("- ")) {
      paragraph.push((lines[index] ?? "").trim());
      index += 1;
    }
    result.push({ kind: "p", text: paragraph.join(" ") });
  }
  return result;
}

const headingClass: Record<1 | 2 | 3 | 4, string> = {
  1: "font-display text-4xl font-semibold tracking-tight",
  2: "mt-10 font-display text-2xl font-semibold tracking-tight",
  3: "mt-8 text-xl font-semibold",
  4: "mt-6 text-lg font-semibold",
};

export function PrivacyPage() {
  const signOffs = source.match(SIGN_OFF)?.length ?? 0;
  return (
    <PageFrame>
      <article className={`${pageSpace} max-w-3xl`}>
        <JsonLd data={privacyGraph()} />
        <Breadcrumbs current="Privacy policy" />
        <p className="mb-6 rounded-xl border border-[#b45309] bg-[#fff7ed] px-4 py-3 text-base leading-relaxed text-ink">
          {`Draft. Not reviewed by a lawyer. ${signOffs} items marked TBD still need Atul and Chandan to sign off. Nothing here is legal advice.`}
        </p>
        {blocks().map((block, index) => {
          if (block.kind === "h") {
            const Tag = `h${block.level}` as "h1" | "h2" | "h3" | "h4";
            return (
              <Tag key={index} className={headingClass[block.level]}>
                {inline(block.text, `h${index}`)}
              </Tag>
            );
          }
          if (block.kind === "ul") {
            return (
              <ul key={index} className="mt-3 grid list-disc gap-2 pl-5 text-base leading-relaxed">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>{inline(item, `li${index}-${itemIndex}`)}</li>
                ))}
              </ul>
            );
          }
          if (block.kind === "table") {
            return (
              <div key={index} className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
                  <thead>
                    <tr>
                      {block.headers.map((header) => (
                        <th key={header} className="border border-ink/15 bg-[#f3f6f1] px-2 py-2 font-semibold">
                          {inline(header, header)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="border border-ink/15 px-2 py-2 align-top">
                            {inline(cell, `c${index}-${rowIndex}-${cellIndex}`)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          const text = stripDraftMarks(block.text);
          if (!text) return <Fragment key={index} />;
          return (
            <p key={index} className="mt-3 text-base leading-relaxed">
              {inline(block.text, `p${index}`)}
            </p>
          );
        })}
      </article>
    </PageFrame>
  );
}
