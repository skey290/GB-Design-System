export type FoundationStatus = "not-started" | "survey-open" | "completed";

export interface SurveyQuestion {
  id: string;
  /** paired-trait 포맷("I want to be seen as [A], not [B]")은 traitB를 함께 둔다 */
  traitA: string;
  traitB?: string;
}

/** Self-Gap 8문항, 1~5 척도 (`docs/GB_Know_Thyself.md` 3부) */
export const SELF_GAP_QUESTIONS: SurveyQuestion[] = [
  { id: "sg-1", traitA: "When something goes wrong, I stay calm and steady" },
  { id: "sg-2", traitA: "I'm the one who makes the room laugh" },
  { id: "sg-3", traitA: "If I say I'll do it, it gets done" },
  { id: "sg-4", traitA: "People find it easy to open up to me" },
  { id: "sg-5", traitA: "I take bigger risks than most people around me" },
  { id: "sg-6", traitA: "I know what I want out of life" },
  {
    id: "sg-7",
    traitA: "I act like a different person depending on who I'm with",
  },
  { id: "sg-8", traitA: "The first impression I give matches who I really am" },
];

/** Inner Self — TIPI 10문항, 1~7 척도 (`docs/GB_Know_Thyself.md` 4부) */
export const TIPI_QUESTIONS: SurveyQuestion[] = [
  { id: "is-1", traitA: "extraverted", traitB: "enthusiastic" },
  { id: "is-2", traitA: "critical", traitB: "quarrelsome" },
  { id: "is-3", traitA: "dependable", traitB: "self-disciplined" },
  { id: "is-4", traitA: "anxious", traitB: "easily upset" },
  { id: "is-5", traitA: "open to new experiences", traitB: "complex" },
  { id: "is-6", traitA: "reserved", traitB: "quiet" },
  { id: "is-7", traitA: "sympathetic", traitB: "warm" },
  { id: "is-8", traitA: "disorganized", traitB: "careless" },
  { id: "is-9", traitA: "calm", traitB: "emotionally stable" },
  { id: "is-10", traitA: "conventional", traitB: "uncreative" },
];

/** Outer Self — paired-trait 8문항, 1~5 척도 (`docs/GB_Know_Thyself.md` 5부) */
export const OUTER_SELF_QUESTIONS: SurveyQuestion[] = [
  { id: "os-1", traitA: "approachable", traitB: "authoritative" },
  { id: "os-2", traitA: "bold", traitB: "minimal" },
  { id: "os-3", traitA: "playful", traitB: "serious" },
  { id: "os-4", traitA: "an expert", traitB: "a peer" },
  { id: "os-5", traitA: "innovative", traitB: "traditional" },
  { id: "os-6", traitA: "high-energy", traitB: "calm" },
  { id: "os-7", traitA: "polished", traitB: "raw/authentic" },
  { id: "os-8", traitA: "niche", traitB: "broadly relatable" },
];

export interface NumberlineRow {
  question: string;
  me: number;
  friends: number;
}

/** Self-Gap 상세 결과 — 8문항 넘버라인 비교용 목 데이터 (1~5 척도) */
export const SELF_GAP_NUMBERLINE: NumberlineRow[] = SELF_GAP_QUESTIONS.map(
  (question, index) => ({
    question: question.traitA,
    me: [4, 2, 5, 3, 2, 4, 2, 4][index],
    friends: [3, 4, 4, 4, 4, 3, 3, 3][index],
  }),
);
