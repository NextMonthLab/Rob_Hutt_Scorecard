export type PillarKey = "Soul" | "Heart" | "Hands";

export interface ScoreResult {
  soulAvg: number;
  heartAvg: number;
  handsAvg: number;
  alignAvg: number;
  primary: PillarKey;
  secondary: PillarKey;
}

const mean = (values: number[]): number =>
  values.reduce((total, value) => total + value, 0) / values.length;

const roundToOne = (value: number): number => Math.round(value * 10) / 10;

export const calculateScores = (answers: Record<string, number>): ScoreResult => {
  const soulAvg = mean([answers.q1, answers.q2, answers.q3]);
  const heartAvg = mean([answers.q4, answers.q5, answers.q6]);
  const handsAvg = mean([answers.q7, answers.q8, answers.q9, answers.q10]);
  const alignAvg = mean([answers.q11, answers.q12]);

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
    soulAvg: roundToOne(soulAvg),
    heartAvg: roundToOne(heartAvg),
    handsAvg: roundToOne(handsAvg),
    alignAvg: roundToOne(alignAvg),
    primary: sorted[0].key,
    secondary: sorted[1].key,
  };
};
