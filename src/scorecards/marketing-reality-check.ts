import type { ScorecardConfig } from "./types";

export const MARKETING_REALITY_CHECK_SCORECARD: ScorecardConfig = {
  slug: "marketing-reality-check",
  title: "Marketing Reality Check",
  subtitle: "12 questions. Immediate diagnosis. Practical next steps.",
  intro: {
    heading: "How it works",
    body: "Score yourself honestly across the four pillars. You will get a clear diagnosis, the three answers that drove it, and the next step that fits your situation.",
  },
  pillars: [
    {
      id: "Soul",
      title: "Soul",
      subtitle: "Positioning and clarity",
      questionRange: "Q1-3",
    },
    {
      id: "Heart",
      title: "Heart",
      subtitle: "Human presence and trust",
      questionRange: "Q4-6",
    },
    {
      id: "Hands",
      title: "Hands",
      subtitle: "Execution and ownership",
      questionRange: "Q7-10",
    },
    {
      id: "Alignment",
      title: "Alignment",
      subtitle: "Strategy showing up in output",
      questionRange: "Q11-12",
    },
  ],
  questions: [
    {
      id: "q1",
      pillar: "Soul",
      text: "If I stopped a random employee/supplier and asked what your business stands for, I'd get the same answer every time.",
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
      text: "We know which marketing activities generate value (we're not guessing).",
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
      text: "If we stopped marketing tomorrow, we'd know exactly what we were losing.",
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
    brandName: "Rob Hutt",
    accent: "#ff7a1a",
    accentHover: "#ff8c3a",
  },
  handoff: {
    source: "robhutt",
    routeTag: "marketing_reality",
  },
  resultsCTA: {
    label: "Get your full 30-90 day action plan",
    description: "If you want the step-by-step roadmap for this diagnosis, we'll email it to you. You can use it yourself or bring it to a call.",
    buttonText: "Email me the action plan",
  },
  diagnosisInsights: {
    Soul: {
      title: "Your primary issue: SOUL",
      pattern: "Positioning is unclear, so the business keeps reacting instead of leading.",
      consequence: "Marketing feels generic and customers cannot repeat what you stand for.",
    },
    Heart: {
      title: "Your primary issue: HEART",
      pattern: "The voice feels safe or distant, so trust takes too long to build.",
      consequence: "People do not connect emotionally and you lose momentum against bolder brands.",
    },
    Hands: {
      title: "Your primary issue: HANDS",
      pattern: "Execution relies on firefighting, not a repeatable system.",
      consequence: "Quality and consistency wobble, which wastes effort and delays results.",
    },
  },
  packageRecommendations: {
    Soul: {
      recommended: {
        title: "Clarity & Positioning Sprint (Consultancy)",
        audience: "For leadership teams who need sharper positioning and confident direction.",
        bullets: [
          "Purpose, audience, and differentiation workshop",
          "Message pillars and narrative outline",
          "Decision framework for what to say no to",
        ],
        outcome: "A clear, defensible position the whole business can repeat.",
        cta: {
          label: "Book a clarity sprint",
          href: "/contact",
        },
      },
      alternative: {
        title: "Hybrid: Strategy + Content Engine Setup",
        audience: "For teams who want strategy and a simple delivery system together.",
        bullets: [
          "Positioning refresh and messaging alignment",
          "Lightweight content engine and cadence",
          "Team enablement to keep it moving",
        ],
        outcome: "Clarity paired with a plan you can execute immediately.",
        cta: {
          label: "Explore the hybrid option",
          href: "/contact",
        },
      },
    },
    Heart: {
      recommended: {
        title: "Human Presence Kit (Story + Video Plan)",
        audience: "For founders or experts who need to be seen and trusted quickly.",
        bullets: [
          "Narrative and story arc development",
          "Video and content plan with prompts",
          "Voice guide that sounds like you",
        ],
        outcome: "A visible, trusted presence that customers remember.",
        cta: {
          label: "Start the presence kit",
          href: "/contact",
        },
      },
      alternative: {
        title: "Hybrid: Content System + Coaching",
        audience: "For teams who want a system plus human coaching support.",
        bullets: [
          "Content engine setup",
          "Founder coaching and story support",
          "Monthly feedback on voice and trust signals",
        ],
        outcome: "Consistent output that feels human and credible.",
        cta: {
          label: "See hybrid coaching",
          href: "/contact",
        },
      },
    },
    Hands: {
      recommended: {
        title: "Marketing System Build (Hybrid)",
        audience: "For teams that need reliable execution without firefighting.",
        bullets: [
          "Operating model and ownership map",
          "Content workflow with templates",
          "Measurement and reporting basics",
        ],
        outcome: "A repeatable system that removes chaos.",
        cta: {
          label: "Build the system",
          href: "/contact",
        },
      },
      alternative: {
        title: "Consultancy: Operating Model & Ownership Reset",
        audience: "For leadership teams who need clarity on roles and accountability.",
        bullets: [
          "Ownership and workflow review",
          "Decision rights and escalation paths",
          "90-day operating plan",
        ],
        outcome: "Clear accountability and calmer delivery.",
        cta: {
          label: "Discuss the reset",
          href: "/contact",
        },
      },
    },
  },
  severityCopy: {
    Critical: "Keep it fast and simple. Stop the waste and focus on one clear move that stabilises momentum.",
    Leaking: "Simplify the plan and remove distractions. Consistency will come once the foundations are steady.",
    Improving: "You have the raw ingredients. Tighten execution and let the results compound over the next quarter.",
    Healthy: "You are in a good place. Focus on refinement and compounding rather than new initiatives.",
  },
  thirtyDayRules: {
    Soul: "For the next 30 days, publish one clear point of view every week that explains what you stand for and who you are not for.",
    Heart: "For the next 30 days, every piece of content must lead with a real person and a real opinion, not a slogan.",
    Hands: "For the next 30 days, pick one channel and ship on a fixed cadence using three repeatable templates.",
  },
  patterns: {
    Soul: {
      critical: "Drifting Direction",
      improving: "Unclear Edge",
    },
    Heart: {
      critical: "Safe Voice, Slow Trust",
      improving: "Invisible Expertise",
    },
    Hands: {
      critical: "Heroics Over Systems",
      improving: "Inconsistent Engine",
    },
  },
  alignmentNotes: {
    Soul: "This is common when direction is unclear: output becomes reactive.",
    Heart: "This is common when trust signals are weak: strategy exists, but people don't feel it.",
    Hands: "This is common when there is no system: good strategy never shows up consistently.",
  },
};
