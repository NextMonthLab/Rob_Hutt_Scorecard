import type { ScorecardConfig } from "./types";

export const HUTT_STUDIO_SCORECARD: ScorecardConfig = {
  slug: "hutt-studio-momentum",
  title: "Studio Momentum Reality Check",
  subtitle: "12 questions. Immediate diagnosis. Practical next steps across film, campaigns, technology, and environments.",
  intro: {
    heading: "How it works",
    body: "Score yourself honestly across the four pillars. You'll get a clear diagnosis, the answers that drove it, and the next step for studio-led growth.",
  },
  pillars: [
    {
      id: "Soul",
      title: "Story",
      subtitle: "Clarity, differentiation, and narrative",
      questionRange: "Q1-3",
    },
    {
      id: "Heart",
      title: "Proof",
      subtitle: "Credibility, case studies, and premium perception",
      questionRange: "Q4-6",
    },
    {
      id: "Hands",
      title: "Delivery",
      subtitle: "Execution across film, campaigns, tech, and environments",
      questionRange: "Q7-10",
    },
    {
      id: "Alignment",
      title: "Momentum",
      subtitle: "Distribution, demand, and measurable outcomes",
      questionRange: "Q11-12",
    },
  ],
  questions: [
    {
      id: "q1",
      pillar: "Soul",
      text: "A stranger could land on our website and instantly understand what we do and why we're different.",
    },
    {
      id: "q2",
      pillar: "Soul",
      text: "We are clear on the one type of client we most want to win (and we speak directly to them).",
    },
    {
      id: "q3",
      pillar: "Soul",
      text: "We can describe the single outcome we deliver that matters most to clients (not just a list of services).",
    },
    {
      id: "q4",
      pillar: "Heart",
      text: "Our best work is visible and easy to find (case studies, showreels, examples) and matches the clients we want.",
    },
    {
      id: "q5",
      pillar: "Heart",
      text: "We have credible proof that builds trust quickly (results, testimonials, transformations, behind-the-scenes).",
    },
    {
      id: "q6",
      pillar: "Heart",
      text: "Our brand presence feels premium and consistent across touchpoints (website, socials, proposals, environments).",
    },
    {
      id: "q7",
      pillar: "Hands",
      text: "We can deliver projects without them becoming a painful fire drill (planning, approvals, logistics are manageable).",
    },
    {
      id: "q8",
      pillar: "Hands",
      text: "We have a repeatable process for turning ideas into high-quality output (not starting from scratch each time).",
    },
    {
      id: "q9",
      pillar: "Hands",
      text: "We can deliver across multiple lanes when needed (film, campaigns, technology, environments) without chaos.",
    },
    {
      id: "q10",
      pillar: "Hands",
      text: "Someone is clearly accountable for shipping consistently (owner, lead, or named team member) and decisions are made fast.",
    },
    {
      id: "q11",
      pillar: "Alignment",
      text: "We have a clear distribution / launch plan for our work (where it goes, when it ships, how it's promoted).",
    },
    {
      id: "q12",
      pillar: "Alignment",
      text: "We measure whether our work is working (enquiries, pipeline, bookings, revenue), not just likes and views.",
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
    brandName: "HUTT STUDIO",
    accent: "#1e3a5f",
    accentHover: "#2d4a6f",
  },
  handoff: {
    source: "huttstudio",
    routeTag: "hutt_studio_momentum",
  },
  resultsCTA: {
    label: "Generate my 90-day studio plan",
    description: "Turn this diagnosis into a quarter plan with wins, builds, risks, and weekly check-ins.",
    buttonText: "Create my plan",
  },
  diagnosisInsights: {
    Soul: {
      title: "Your primary issue: STORY",
      pattern: "Your positioning is unclear, so the market doesn't understand what you do or why you're different.",
      consequence: "Potential clients can't quickly grasp your value, and you blend in with competitors.",
    },
    Heart: {
      title: "Your primary issue: PROOF",
      pattern: "Trust signals are weak or hidden, so credibility takes too long to build.",
      consequence: "Your best work isn't visible, and prospects hesitate before engaging.",
    },
    Hands: {
      title: "Your primary issue: DELIVERY",
      pattern: "Production relies on heroics instead of a repeatable system.",
      consequence: "Projects become fire drills, quality varies, and the team dreads the next big deliverable.",
    },
  },
  severityCopy: {
    Critical: "Keep it fast and simple. Stop the waste and focus on one clear move that stabilises your studio momentum.",
    Leaking: "Simplify the plan and remove distractions. Consistency will come once the foundations are steady.",
    Improving: "You have the raw ingredients. Tighten execution and let the results compound over the next quarter.",
    Healthy: "You are in a good place. Focus on refinement and compounding rather than new initiatives.",
  },
  thirtyDayRules: {
    Soul: "For the next 30 days, every piece of content must answer one question: what do we do and why does it matter to our ideal client?",
    Heart: "For the next 30 days, make your best work visible: surface one case study, showreel, or proof point each week.",
    Hands: "For the next 30 days, use one repeatable process for delivery and ship on a fixed weekly cadence.",
  },
  patterns: {
    Soul: {
      critical: "Invisible Positioning",
      improving: "Unclear Narrative",
    },
    Heart: {
      critical: "Hidden Proof",
      improving: "Weak Trust Signals",
    },
    Hands: {
      critical: "Studio Fire Drills",
      improving: "Inconsistent Delivery",
    },
  },
  alignmentNotes: {
    Soul: "This is common when positioning is unclear: work gets done but doesn't build toward a recognisable brand.",
    Heart: "This is common when proof is hidden: great work exists but doesn't create trust quickly.",
    Hands: "This is common when there's no system: ambitious projects rarely ship smoothly or consistently.",
  },
};
