import type { ScorecardInsightsPayload } from "../scorecards/types";

export interface CharacterXResponse {
  editUrl: string;
}

/**
 * Submit scorecard insights to CharacterX for 90-day plan generation.
 * This is a universal endpoint that uses routeTag to determine plan type.
 *
 * @param payload - The scorecard insights payload
 * @returns Promise with editUrl for the generated plan
 */
export const submitScorecardToCharacterX = async (
  payload: ScorecardInsightsPayload,
): Promise<CharacterXResponse> => {
  // Try to call the real CharacterX endpoint
  try {
    const response = await fetch("/api/characterx/90-day-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      return { editUrl: data.editUrl };
    }
  } catch {
    // Fall through to stub response
  }

  // Stub response - return a fake URL for now
  // In production, this should call the real CharacterX API
  console.log("[CharacterX Stub] Received payload:", payload);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Return a stubbed edit URL based on the routeTag
  const stubUrl = `https://characterx.example.com/plan/${payload.routeTag}?session=${Date.now()}`;

  return { editUrl: stubUrl };
};
