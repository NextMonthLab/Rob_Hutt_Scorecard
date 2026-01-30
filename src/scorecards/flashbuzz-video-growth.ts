import type { ScorecardConfig } from "./types";

export const FLASHBUZZ_VIDEO_GROWTH_SCORECARD: ScorecardConfig = {
  slug: "flashbuzz-video-growth",
  title: "Video Growth Reality Check",
  subtitle: "12 questions. Immediate diagnosis. Practical next steps for video-led growth.",
  intro: {
    heading: "How it works",
    body: "Score yourself honestly across the four pillars. You'll get a clear diagnosis, the answers that drove it, and the next step for video-led growth.",
  },
  pillars: [
    {
      id: "Soul",
      title: "Soul",
      subtitle: "Video strategy and positioning",
      questionRange: "Q1-3",
    },
    {
      id: "Heart",
      title: "Heart",
      subtitle: "Trust and human presence",
      questionRange: "Q4-6",
    },
    {
      id: "Hands",
      title: "Hands",
      subtitle: "Execution system and output",
      questionRange: "Q7-10",
    },
    {
      id: "Alignment",
      title: "Alignment",
      subtitle: "Distribution and conversion",
      questionRange: "Q11-12",
    },
  ],
  questions: [
    {
      id: "q1",
      pillar: "Soul",
      text: "If a stranger watched our main video, they'd instantly understand what we do and why we're different.",
    },
    {
      id: "q2",
      pillar: "Soul",
      text: "We are clear on the one audience segment this next video is primarily trying to win.",
    },
    {
      id: "q3",
      pillar: "Soul",
      text: "We can describe the single action we want viewers to take after watching (and it matches a real business goal).",
    },
    {
      id: "q4",
      pillar: "Heart",
      text: "The people customers trust most in our business are visible on camera (founder, experts, team).",
    },
    {
      id: "q5",
      pillar: "Heart",
      text: "Our videos sound like real humans, not corporate scripts or jargon.",
    },
    {
      id: "q6",
      pillar: "Heart",
      text: "We have credible proof ready to show on video (case studies, testimonials, results, behind-the-scenes).",
    },
    {
      id: "q7",
      pillar: "Hands",
      text: "We can produce video without it becoming a painful fire drill (planning, approvals, logistics are manageable).",
    },
    {
      id: "q8",
      pillar: "Hands",
      text: "We have a repeatable process for turning ideas into filmed content (not starting from scratch each time).",
    },
    {
      id: "q9",
      pillar: "Hands",
      text: "We know how we'll repurpose one video into multiple outputs (shorts, clips, posts, landing pages).",
    },
    {
      id: "q10",
      pillar: "Hands",
      text: "Someone is clearly accountable for shipping video consistently (owner, team member, agency partner).",
    },
    {
      id: "q11",
      pillar: "Alignment",
      text: "We have a clear distribution plan for every video (where it goes, when it ships, how it's promoted).",
    },
    {
      id: "q12",
      pillar: "Alignment",
      text: "We can measure whether video is working (leads, bookings, enquiries, sales), not just likes and views.",
    },
  ],
  scaleLabels: [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree",
  ],
  theme: {
    brandName: "FlashBuzz",
    accent: "#6366f1",
    accentHover: "#818cf8",
  },
  handoff: {
    source: "flashbuzz",
    routeTag: "flashbuzz_video",
  },
  resultsCTA: {
    label: "Generate my 90-day video plan",
    description: "Turn this diagnosis into a quarter plan with wins, builds, risks, and weekly check-ins.",
    buttonText: "Create my plan",
  },
  diagnosisInsights: {
    Soul: {
      title: "Your primary issue: SOUL",
      pattern: "Video strategy is unclear, so content feels random and fails to differentiate.",
      consequence: "Viewers don't understand what you do or why you're different, and engagement stays low.",
    },
    Heart: {
      title: "Your primary issue: HEART",
      pattern: "The human presence is missing or feels distant, so trust takes too long to build.",
      consequence: "Videos feel corporate or scripted, and viewers don't connect emotionally with your brand.",
    },
    Hands: {
      title: "Your primary issue: HANDS",
      pattern: "Video production relies on heroics instead of a repeatable system.",
      consequence: "Output is inconsistent, quality varies, and the team dreads the next video project.",
    },
  },
  severityCopy: {
    Critical: "Keep it fast and simple. Stop the waste and focus on one clear move that stabilises your video momentum.",
    Leaking: "Simplify the plan and remove distractions. Consistency will come once the foundations are steady.",
    Improving: "You have the raw ingredients. Tighten execution and let the results compound over the next quarter.",
    Healthy: "You are in a good place. Focus on refinement and compounding rather than new initiatives.",
  },
  thirtyDayRules: {
    Soul: "For the next 30 days, every video must answer one question: what do we do and why does it matter to this specific audience?",
    Heart: "For the next 30 days, every video must feature a real person from your team sharing a real opinion or story.",
    Hands: "For the next 30 days, use one repeatable video format and ship on a fixed weekly cadence.",
  },
  patterns: {
    Soul: {
      critical: "Random Content",
      improving: "Unclear Positioning",
    },
    Heart: {
      critical: "Faceless Brand",
      improving: "Distant Voice",
    },
    Hands: {
      critical: "Video Fire Drills",
      improving: "Inconsistent Output",
    },
  },
  alignmentNotes: {
    Soul: "This is common when video strategy is unclear: content gets made but doesn't build toward anything.",
    Heart: "This is common when trust signals are weak: videos exist but don't create connection.",
    Hands: "This is common when there's no system: good ideas never become consistent output.",
  },
};
