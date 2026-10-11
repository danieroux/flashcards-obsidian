export type CardKind = "basic" | "cloze" | "reminder" | "reversed";
export type CardSyntax =
  | "inline"
  | "cloze"
  | "hashtag"
  | "hqa"
  | "fenced"
  | "atomic"
  | "callout";

export interface CardSource {
  endOffset: number;
  line: number;
  startOffset: number;
  syntax: CardSyntax;
}

export interface Flashcard {
  answer: string;
  /** Prompt context such as the active heading path. Never answer content. */
  context?: string;
  deckName?: string;
  front: string;
  /** HQ&A only: the source quote shown below the answer. Never on the front. Contains answer content. */
  highlight?: string;
  kind: CardKind;
  source: CardSource;
  tags: string[];
}

export type IdentifiedFlashcard = Flashcard & {
  blockId: string;
  // Atomic cards only: the cue hash computed at identity-resolution time
  // (from the raw, pre-media-rewrite front). Carried through every downstream
  // stage so frontmatter writers never recompute it from a possibly-rewritten
  // front (see preview-sync-plan.ts WI-9 comment).
  cue?: string;
};
