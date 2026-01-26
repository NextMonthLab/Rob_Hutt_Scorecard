import { questions, type Pillar } from "../data/questions";

export type PillarKey = "Soul" | "Heart" | "Hands";

export type SeverityBand = "Healthy" | "Improving" | "Leaking" | "Critical";

export interface PillarAverages {
  soulAvg: number;
  heartAvg: number;
  handsAvg: number;
  alignAvg: number;
}

export interface ScoreResult extends PillarAverages {
  primary: PillarKey;
  secondary: PillarKey;
}

export interface LowestQuestion {
  id: string;
  pillar: Pillar;
  text: string;
  score: number;
}

const mean = (values: number[]): number =>
  values.reduce((total, value) => total + value, 0) / values.length;

const roundToOne = (value: number): number => Math.round(value * 10) / 10;

export const calculatePillarAverages = (
  answers: Record<string, number>,
): PillarAverages => {
  const soulAvg = mean([answers.q1, answers.q2, answers.q3]);
  const heartAvg = mean([answers.q4, answers.q5, answers.q6]);
  const handsAvg = mean([answers.q7, answers.q8, answers.q9, answers.q10]);
  const alignAvg = mean([answers.q11, answers.q12]);

  return {
    soulAvg: roundToOne(soulAvg),
    heartAvg: roundToOne(heartAvg),
    handsAvg: roundToOne(handsAvg),
    alignAvg: roundToOne(alignAvg),
  };
};

export const calculateScores = (answers: Record<string, number>): ScoreResult => {
  const { soulAvg, heartAvg, handsAvg, alignAvg } =
    calculatePillarAverages(answers);

  const entries: Array<{ key: PillarKey; value: number; order: number }> = [
    { key: "Soul", value: soulAvg, order: 0 },
    { key: "Heart", value: heartAvg, order: 1 },
    { key: "Hands", value: handsAvg, order: 2 },
  ];

  const sorted = [...entries].sort((a, b) => {
    if (a.value === b.value) {
      return a.order - b.order;
    }
    return a.value - b.value;
  });

  return {
    soulAvg,
    heartAvg,
    handsAvg,
    alignAvg,
    primary: sorted[0].key,
    secondary: sorted[1].key,
  };
};

export const getSeverityBand = (score: number): SeverityBand => {
  if (score >= 4) {
    return "Healthy";
  }
  if (score >= 3) {
    return "Improving";
  }
  if (score >= 2) {
    return "Leaking";
  }
  return "Critical";
};

export const getPattern = (primary: PillarKey, severity: SeverityBand): string => {
  const isCritical = severity === "Critical" || severity === "Leaking";

  if (primary === "Soul") {
    return isCritical ? "Drifting Direction" : "Unclear Edge";
  }

  if (primary === "Heart") {
    return isCritical ? "Safe Voice, Slow Trust" : "Invisible Expertise";
  }

  return isCritical ? "Heroics Over Systems" : "Inconsistent Engine";
};

export const getThirtyDayRule = (primary: PillarKey): string => {
  if (primary === "Soul") {
    return "For the next 30 days, publish one clear point of view every week that explains what you stand for and who you are not for.";
  }

  if (primary === "Heart") {
    return "For the next 30 days, every piece of content must lead with a real person and a real opinion, not a slogan.";
  }

  return "For the next 30 days, pick one channel and ship on a fixed cadence using three repeatable templates.";
};

export const getLowestQuestions = (
  answers: Record<string, number>,
  count = 3,
): LowestQuestion[] => {
  const scored = questions.map((question, index) => ({
    ...question,
    score: answers[question.id],
    order: index,
  }));

  return scored
    .sort((a, b) => {
      if (a.score === b.score) {
        return a.order - b.order;
      }
      return a.score - b.score;
    })
    .slice(0, count)
    .map(({ order, ...rest }) => rest);
};
