import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, test } from "vitest";

import { DEFAULT_SETTINGS } from "../../../src/core/config/settings.js";
import { extractCardsFromMarkdown } from "../../../src/core/parse/extract-cards.js";

const HQA_FIXTURE = join(
  process.cwd(),
  "test-vault",
  "features",
  "card-types",
  "hqa.md",
);

function extract(markdown: string) {
  return extractCardsFromMarkdown(markdown, {
    notePath: "card-types/hqa.md",
    settings: DEFAULT_SETTINGS,
  });
}

// HQ&A invariant: a `#question` card always carries front (the question),
// answer, and a highlight (the blockquote below the answer). The highlight is
// merged into `context` together with the heading location. A line break never
// ends the answer: the blockquote does. A `#question` without a highlight is
// invalid and is skipped with a warning.
describe("HQ&A notes (#question hashtag cards)", () => {
  test("turns the test-vault hqa fixture into exactly one basic card", () => {
    const markdown = readFileSync(HQA_FIXTURE, "utf8");
    const result = extract(markdown);

    expect(result.warnings).toEqual([]);
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0]).toMatchObject({
      // The trailing `#question` marker is stripped, like `#card` would be.
      front: "One paragraph that has a tag at the end to indicate it is a",
      // Answer = every paragraph after the question line. A line break is
      // fine; only the blockquote (the source highlight) ends the answer.
      answer: [
        "With the answer in another paragraph.",
        // Trailing space before the soft line break is part of the fixture.
        "This is a continuation of the answer. ",
        "",
        "A line break is fine.",
        "The start of a Markdown quote is the indication that the answer ended and highlight is starting",
      ].join("\n"),
      // The location part is the fixture's heading path (`Heading 1 > Heading 2`).
      context: [
        "With the highlight below it, which is the reference that",
        "I want to be able to refer back to",
        "Heading 1 > Heading 2",
      ].join("\n"),
      kind: "basic",
      source: { syntax: "hqa" },
    });
  });

  test("skips a question without a highlight blockquote", () => {
    const result = extract(
      "What is the capital of France? #question\nParis.",
    );

    expect(result.cards).toHaveLength(0);
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toMatch(/highlight/i);
  });

  test("leaves the blockquote highlight out of the answer", () => {
    const result = extract(
      [
        "Why does a line break end the answer? #question",
        "Because the answer is a single paragraph.",
        "",
        "> Highlight: the reference to refer back to.",
      ].join("\n"),
    );

    expect(result.cards).toHaveLength(1);
    expect(result.cards[0]?.answer).toBe(
      "Because the answer is a single paragraph.",
    );
  });
});

// `#question` is the last resort: every other card syntax gets first claim on
// the text, and HQ&A only sees what is left.
describe("HQ&A precedence", () => {
  test("an inline card on the question line wins over #question", () => {
    const result = extract(
      ["What is 2+2?::4 #question", "", "> Highlight."].join("\n"),
    );

    expect(result.warnings).toEqual([]);
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0]?.source.syntax).toBe("inline");
  });

  test("a cloze in the question paragraph wins over #question", () => {
    const result = extract(
      ["Question #question", "Answer with ==cloze==", "", "> Highlight."].join(
        "\n",
      ),
    );

    expect(result.warnings).toEqual([]);
    expect(result.cards).toHaveLength(1);
    expect(result.cards[0]?.source.syntax).toBe("cloze");
  });

  test("the highlight search stops at a node claimed by another card", () => {
    const result = extract(
      [
        "Question #question",
        "Answer.",
        "",
        "Term::Definition",
        "",
        "> Highlight.",
      ].join("\n"),
    );

    expect(result.cards).toHaveLength(1);
    expect(result.cards[0]?.source.syntax).toBe("inline");
    expect(result.warnings).toHaveLength(1);
    expect(result.warnings[0]).toMatch(/highlight/i);
  });
});
