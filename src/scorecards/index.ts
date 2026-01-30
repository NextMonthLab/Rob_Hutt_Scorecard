import type { ScorecardConfig } from "./types";
import { MARKETING_REALITY_CHECK_SCORECARD } from "./marketing-reality-check";
import { FLASHBUZZ_VIDEO_GROWTH_SCORECARD } from "./flashbuzz-video-growth";
import { HUTT_STUDIO_SCORECARD } from "./hutt-studio";

export * from "./types";

export const SCORECARDS: Record<string, ScorecardConfig> = {
  "marketing-reality-check": MARKETING_REALITY_CHECK_SCORECARD,
  "flashbuzz-video-growth": FLASHBUZZ_VIDEO_GROWTH_SCORECARD,
  "hutt-studio-momentum": HUTT_STUDIO_SCORECARD,
};

export const getScorecardBySlug = (slug: string): ScorecardConfig | undefined => {
  return SCORECARDS[slug];
};

export const getAllScorecardSlugs = (): string[] => {
  return Object.keys(SCORECARDS);
};
