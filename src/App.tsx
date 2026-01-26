import { useMemo, useRef, useState } from "react";
import { questions } from "./data/questions";
import { calculateScores, type PillarKey } from "./utils/scoring";

const scaleLabels = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const diagnosisCopy: Record<
  PillarKey,
  {
    title: string;
    paragraphs: string[];
    looksLike: string[];
    fixes: string[];
  }
> = {
  Soul: {
    title: "Your primary issue: SOUL",
    paragraphs: [
      "When Soul scores lowest, your positioning is fuzzy and the business is reacting rather than leading. The market cannot tell what you stand for or who you are for, so marketing fails to compound.",
      "Without a clear point of view, every campaign becomes a compromise. Teams chase trends, compare themselves to competitors, and avoid saying no, which makes everything feel generic.",
      "Clarity is the engine. Once purpose, audience, and differentiation are crisp, the rest of the system starts to align and build momentum.",
    ],
    looksLike: [
      "Messaging changes from month to month based on external pressure.",
      "The team struggles to explain who you are not trying to win.",
      "Marketing activity feels busy but undirected.",
    ],
    fixes: [
      "Define the point of view and promise you will defend.",
      "Choose a priority audience and be specific about their needs.",
      "Write down the boundaries and the offers you will not pursue.",
    ],
  },
  Heart: {
    title: "Your primary issue: HEART",
    paragraphs: [
      "When Heart is lowest, the marketing might be credible but it feels cold or invisible. Customers do not sense a real human voice, so trust takes too long to build.",
      "Without empathy and presence, you sound like everyone else. It becomes harder to connect with motivations, fears, and frustrations, and the brand feels distant.",
      "Human connection is the accelerator. When real people lead the story, attention grows and the right customers lean in.",
    ],
    looksLike: [
      "Content sounds safe and committee-led.",
      "Founders or experts are rarely seen or heard.",
      "Customer insight is based on assumptions rather than stories.",
    ],
    fixes: [
      "Build the narrative around real customer moments and language.",
      "Put founders and experts front and centre in the marketing.",
      "Create a distinct voice guide that sounds human and consistent.",
    ],
  },
  Hands: {
    title: "Your primary issue: HANDS",
    paragraphs: [
      "When Hands is lowest, the problem is execution and ownership. Marketing is not a system, so output depends on heroics and the quality is inconsistent.",
      "Without clear workflows, measurement, and accountability, the team cannot repeat what works. This blocks compounding and causes constant fire drills.",
      "A simple operating model turns effort into momentum. It makes quality predictable and frees time for strategic moves.",
    ],
    looksLike: [
      "Marketing runs in last-minute scrambles or one-off pushes.",
      "No single person owns the plan end to end.",
      "Results are hard to measure or explain.",
    ],
    fixes: [
      "Define ownership, cadence, and approval routes.",
      "Build a small, repeatable content engine.",
      "Agree on the basic metrics that show progress.",
    ],
  },
};

const packageRecommendations: Record<
  PillarKey,
  {
    recommended: PackageCard;
    alternative: PackageCard;
  }
> = {
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
};

interface PackageCard {
  title: string;
  audience: string;
  bullets: string[];
  outcome: string;
  cta: {
    label: string;
    href: string;
  };
}

const RatingLegend = () => (
  <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
    {scaleLabels.map((label, index) => (
      <span key={label} className="rounded-full bg-slate-100 px-3 py-1">
        {index + 1} = {label}
      </span>
    ))}
  </div>
);

const PackageCardView = ({ card }: { card: PackageCard }) => (
  <div className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div>
      <h4 className="text-lg font-semibold text-slate-900">{card.title}</h4>
      <p className="mt-2 text-sm text-slate-600">{card.audience}</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
        {card.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm font-medium text-slate-800">Outcome: {card.outcome}</p>
    </div>
    <a
      className="mt-6 inline-flex items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
      href={card.cta.href}
    >
      {card.cta.label}
    </a>
  </div>
);

const App = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  const allAnswered = questions.every((question) => answers[question.id]);
  const scores = useMemo(() => {
    if (!hasSubmitted || !allAnswered) {
      return null;
    }
    return calculateScores(answers);
  }, [answers, hasSubmitted, allAnswered]);

  const handleAnswer = (id: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAttemptedSubmit(true);

    if (!allAnswered) {
      return;
    }

    setHasSubmitted(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleReset = () => {
    setAnswers({});
    setHasSubmitted(false);
    setAttemptedSubmit(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
            Marketing Reality Check
          </p>
          <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
            Marketing Reality Check
          </h1>
          <p className="max-w-2xl text-base text-slate-600 md:text-lg">
            12 questions. Immediate diagnosis. Practical next steps.
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-slate-900">Score your reality</h2>
            <p className="text-sm text-slate-600">
              Rate each statement from 1 to 5. Be honest so the diagnosis is useful.
            </p>
          </div>
          <RatingLegend />

          <form className="mt-8 space-y-8" onSubmit={handleSubmit}>
            {questions.map((question, index) => (
              <div
                key={question.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5 md:p-6"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-500">
                      {question.pillar.toUpperCase()} · Q{index + 1}
                    </p>
                    {attemptedSubmit && !answers[question.id] ? (
                      <span className="text-xs font-semibold text-rose-600">
                        Required
                      </span>
                    ) : null}
                  </div>
                  <p className="text-base font-medium text-slate-900">{question.text}</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-5">
                  {scaleLabels.map((label, optionIndex) => {
                    const value = optionIndex + 1;
                    const isChecked = answers[question.id] === value;
                    return (
                      <label
                        key={`${question.id}-${value}`}
                        className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-3 py-3 text-sm transition hover:border-slate-400 ${
                          isChecked
                            ? "border-slate-900 bg-white text-slate-900 shadow-sm"
                            : "border-slate-200 bg-white text-slate-600"
                        }`}
                      >
                        <input
                          type="radio"
                          name={question.id}
                          className="h-4 w-4 text-slate-900"
                          value={value}
                          checked={isChecked}
                          onChange={() => handleAnswer(question.id, value)}
                        />
                        <span className="text-center text-xs font-medium">{label}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="flex flex-col gap-3">
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-300"
                disabled={!allAnswered}
              >
                See my diagnosis
              </button>
              {!allAnswered ? (
                <p className="text-sm text-slate-500">
                  Answer all 12 questions to see your results.
                </p>
              ) : null}
            </div>
          </form>
        </section>

        <section ref={resultsRef} className="mt-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
            <h2 className="text-2xl font-semibold text-slate-900">Results</h2>
            {!scores ? (
              <p className="mt-3 text-sm text-slate-600">
                Submit the scorecard to see your diagnosis, averages, and next steps.
              </p>
            ) : (
              <div className="mt-6 space-y-8">
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">Soul avg</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{scores.soulAvg}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">Heart avg</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{scores.heartAvg}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">Hands avg</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{scores.handsAvg}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase text-slate-500">Alignment avg</p>
                    <p className="mt-2 text-2xl font-semibold text-slate-900">{scores.alignAvg}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold uppercase text-slate-500">
                    Primary diagnosis
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                    {diagnosisCopy[scores.primary].title}
                  </h3>
                  <div className="mt-4 space-y-4 text-sm text-slate-700">
                    {diagnosisCopy[scores.primary].paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                  <p className="mt-4 text-sm font-semibold text-slate-600">
                    Secondary issue: {scores.secondary.toUpperCase()}
                  </p>
                </div>

                {scores.alignAvg <= 2.5 ? (
                  <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                    Alignment is currently weak: strategy and execution are not reinforcing each
                    other.
                  </div>
                ) : null}
                {scores.alignAvg >= 4.0 ? (
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
                    Alignment looks strong: keep strategy and execution connected.
                  </div>
                ) : null}

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <h4 className="text-sm font-semibold uppercase text-slate-500">
                      What this usually looks like
                    </h4>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
                      {diagnosisCopy[scores.primary].looksLike.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                    <h4 className="text-sm font-semibold uppercase text-slate-500">
                      What fixes it
                    </h4>
                    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-700">
                      {diagnosisCopy[scores.primary].fixes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-slate-900">
                    Recommended next step package
                  </h3>
                  <p className="mt-2 text-sm text-slate-600">
                    Choose the path that fits your reality. Start with the recommended option or
                    consider the alternative if you need extra delivery support.
                  </p>
                  <div className="mt-6 grid gap-6 md:grid-cols-2">
                    <PackageCardView card={packageRecommendations[scores.primary].recommended} />
                    <PackageCardView card={packageRecommendations[scores.primary].alternative} />
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    className="inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                    onClick={handleReset}
                  >
                    Reset scorecard
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
