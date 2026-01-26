export type Pillar = "Soul" | "Heart" | "Hands" | "Alignment";

export interface Question {
  id: string;
  pillar: Pillar;
  text: string;
}

export const questions: Question[] = [
  {
    id: "q1",
    pillar: "Soul",
    text: "If I stopped a random employee/supplier and asked what your business stands for, I’d get the same answer every time.",
  },
  {
    id: "q2",
    pillar: "Soul",
    text: "We actively choose our direction rather than reacting to competitors, trends, or pressure.",
  },
  {
    id: "q3",
    pillar: "Soul",
    text: "We are clear about who we are NOT trying to win.",
  },
  {
    id: "q4",
    pillar: "Heart",
    text: "We understand customers as real people (motivations, fears, frustrations), not just demographics.",
  },
  {
    id: "q5",
    pillar: "Heart",
    text: "Our marketing sounds like a real human being, not a committee.",
  },
  {
    id: "q6",
    pillar: "Heart",
    text: "The people customers trust most are visible in our marketing (founders/experts/team).",
  },
  {
    id: "q7",
    pillar: "Hands",
    text: "We know which marketing activities generate value (we’re not guessing).",
  },
  {
    id: "q8",
    pillar: "Hands",
    text: "Marketing feels like a system, not a series of last-minute scrambles.",
  },
  {
    id: "q9",
    pillar: "Hands",
    text: "We can produce consistent, high-quality content without it becoming a fire drill.",
  },
  {
    id: "q10",
    pillar: "Hands",
    text: "Marketing is clearly owned by someone accountable.",
  },
  {
    id: "q11",
    pillar: "Alignment",
    text: "Our strategy clearly shows up in what we publish (messages, content, campaigns align).",
  },
  {
    id: "q12",
    pillar: "Alignment",
    text: "If we stopped marketing tomorrow, we’d know exactly what we were losing.",
  },
];
