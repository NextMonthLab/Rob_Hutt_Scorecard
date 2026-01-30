export type Pillar = "Soul" | "Heart" | "Hands" | "Alignment";

export type PillarKey = "Soul" | "Heart" | "Hands";

export type SeverityBand = "Healthy" | "Improving" | "Leaking" | "Critical";

export interface Question {
  id: string;
  pillar: Pillar;
  text: string;
}

export interface PillarSection {
  id: Pillar;
  title: string;
  subtitle: string;
  questionRange: string;
}

export interface PackageCard {
  title: string;
  audience: string;
  bullets: string[];
  outcome: string;
  cta: {
    label: string;
    href: string;
  };
}

export interface DiagnosisInsight {
  title: string;
  pattern: string;
  consequence: string;
}

export interface ThemeConfig {
  brandName: string;
  accent: string;
  accentHover: string;
  logoUrl?: string;
}

export interface HandoffConfig {
  source: string;
  routeTag: string;
}

export interface ResultsCTA {
  label: string;
  description: string;
  buttonText: string;
}

export interface ScorecardConfig {
  slug: string;
  title: string;
  subtitle: string;
  intro: {
    heading: string;
    body: string;
  };
  pillars: PillarSection[];
  questions: Question[];
  scaleLabels: string[];
  theme: ThemeConfig;
  handoff: HandoffConfig;
  resultsCTA: ResultsCTA;
  diagnosisInsights: Record<PillarKey, DiagnosisInsight>;
  packageRecommendations?: Record<PillarKey, { recommended: PackageCard; alternative: PackageCard }>;
  severityCopy: Record<SeverityBand, string>;
  thirtyDayRules: Record<PillarKey, string>;
  patterns: Record<PillarKey, { critical: string; improving: string }>;
  alignmentNotes: Record<PillarKey, string>;
}

export interface ScorecardAnswer {
  questionId: string;
  pillarId: Pillar;
  score: number;
}

export interface PillarAverages {
  soulAvg: number;
  heartAvg: number;
  handsAvg: number;
  alignAvg: number;
}

export interface ScorecardInsightsPayload {
  source: string;
  routeTag: string;
  completedAt: string;
  totals: {
    overallAvg: number;
    pillarAverages: PillarAverages;
  };
  lowestPillars: PillarKey[];
  highestPillars: PillarKey[];
  answers: ScorecardAnswer[];
}
