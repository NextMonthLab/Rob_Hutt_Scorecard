import { useMemo, useRef, useState } from "react";
import { questions, type Pillar } from "./data/questions";
import {
  calculateScores,
  getLowestQuestions,
  getPattern,
  getSeverityBand,
  getThirtyDayRule,
  type PillarKey,
  type SeverityBand,
} from "./utils/scoring";

const scaleLabels = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const questionSections: Array<{
  title: string;
  subtitle: string;
  pillar: Pillar;
}> = [
  {
    title: "Soul",
    subtitle: "Positioning and clarity",
    pillar: "Soul",
  },
  {
    title: "Heart",
    subtitle: "Human presence and trust",
    pillar: "Heart",
  },
  {
    title: "Hands",
    subtitle: "Execution and ownership",
    pillar: "Hands",
  },
  {
    title: "Alignment",
    subtitle: "Strategy showing up in output",
    pillar: "Alignment",
  },
];

const diagnosisInsights: Record<
  PillarKey,
  {
    title: string;
    pattern: string;
    consequence: string;
    quickWin: string;
  }
> = {
  Soul: {
    title: "Your primary issue: SOUL",
    pattern: "Positioning is unclear, so the business keeps reacting instead of leading.",
    consequence: "Marketing feels generic and customers cannot repeat what you stand for.",
    quickWin: "Write a one-paragraph point of view and test it on three real customers.",
  },
  Heart: {
    title: "Your primary issue: HEART",
    pattern: "The voice feels safe or distant, so trust takes too long to build.",
    consequence: "People do not connect emotionally and you lose momentum against bolder brands.",
    quickWin: "Put a founder or expert front and centre in one piece of content this week.",
  },
  Hands: {
    title: "Your primary issue: HANDS",
    pattern: "Execution relies on firefighting, not a repeatable system.",
    consequence: "Quality and consistency wobble, which wastes effort and delays results.",
    quickWin: "Define one owner, one cadence, and one metric for the next 30 days.",
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

const severityCopy: Record<SeverityBand, string> = {
  Critical:
    "Keep it fast and simple. Stop the waste and focus on one clear move that stabilises momentum.",
  Leaking:
    "Simplify the plan and remove distractions. Consistency will come once the foundations are steady.",
  Improving:
    "You have the raw ingredients. Tighten execution and let the results compound over the next quarter.",
  Healthy:
    "You are in a good place. Focus on refinement and compounding rather than new initiatives.",
};

const RatingLegend = () => (
  <div className="mt-4 flex flex-wrap gap-3 text-xs text-white/60">
    {scaleLabels.map((label, index) => (
      <span
        key={label}
        className="rounded-full border border-white/10 bg-white/5 px-3 py-1"
      >
        {index + 1} = {label}
      </span>
    ))}
  </div>
);

const PackageCardView = ({ card }: { card: PackageCard }) => (
  <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_-40px_rgba(0,0,0,0.9)] backdrop-blur">
    <div>
      <h4 className="text-lg font-semibold text-white">{card.title}</h4>
      <p className="mt-2 text-sm text-white/60">{card.audience}</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-white/70">
        {card.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
      <p className="mt-4 text-sm font-medium text-white/80">Outcome: {card.outcome}</p>
    </div>
    <a
      className="mt-6 inline-flex items-center justify-center rounded-full bg-[#ff7a1a] px-4 py-2 text-sm font-semibold text-[#0b0b0b] transition hover:bg-[#ff8c3a]"
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
  const [leadEmail, setLeadEmail] = useState("");
  const [leadConsent, setLeadConsent] = useState(false);
  const [leadStatus, setLeadStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );
  const [leadError, setLeadError] = useState("");
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const questionsWithNumbers = useMemo(
    () => questions.map((question, index) => ({ ...question, number: index + 1 })),
    [],
  );

  const allAnswered = questions.every((question) => answers[question.id]);
  const scores = useMemo(() => {
    if (!hasSubmitted || !allAnswered) {
      return null;
    }
    return calculateScores(answers);
  }, [answers, hasSubmitted, allAnswered]);

  const lowestQuestions = useMemo(() => {
    if (!scores) {
      return [];
    }
    return getLowestQuestions(answers, 3);
  }, [answers, scores]);

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
    setLeadEmail("");
    setLeadConsent(false);
    setLeadStatus("idle");
    setLeadError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const primaryScore = scores
    ? {
        Soul: scores.soulAvg,
        Heart: scores.heartAvg,
        Hands: scores.handsAvg,
      }[scores.primary]
    : null;

  const severity = primaryScore ? getSeverityBand(primaryScore) : null;
  const showSeverityNote = severity === "Critical" || severity === "Leaking";
  const alignmentSupplement = scores
    ? {
        Heart: "This is common when trust signals are weak: strategy exists, but people don’t feel it.",
        Soul: "This is common when direction is unclear: output becomes reactive.",
        Hands: "This is common when there is no system: good strategy never shows up consistently.",
      }[scores.primary]
    : "";
  const isLeadSuccess = leadStatus === "success";
  const isLeadSubmitting = leadStatus === "submitting";
  const emailIsValid = emailRegex.test(leadEmail);

  const handleLeadSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!scores || !severity || !emailIsValid || !leadConsent) {
      return;
    }

    setLeadStatus("submitting");
    setLeadError("");

    const payload = {
      email: leadEmail,
      answers: questions.map((question) => answers[question.id]),
      primaryDiagnosis: scores.primary,
      severity,
      pillarAverages: {
        soul: scores.soulAvg,
        heart: scores.heartAvg,
        hands: scores.handsAvg,
        alignment: scores.alignAvg,
      },
      lowest3: lowestQuestions.map(({ id, score }) => ({ id, score })),
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Lead capture failed");
      }

      setLeadStatus("success");
    } catch (error) {
      console.error(error);
      setLeadStatus("error");
      setLeadError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b0b0f] via-[#0a0f16] to-[#040404]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,0,0,0.8),_transparent_60%)]" />
      </div>

      <div className="relative">
        <header className="border-b border-white/10">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
            <span className="text-lg font-semibold tracking-wide text-white">Rob Hutt</span>
            <nav className="flex items-center gap-6 text-sm text-white/70">
              <a className="transition hover:text-white" href="/work">
                Work
              </a>
              <a className="transition hover:text-white" href="/contact">
                Contact
              </a>
            </nav>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-6 pb-20">
          <section className="pt-16">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/50">
                  Marketing Reality Check
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
                  Marketing Reality Check
                </h1>
                <p className="mt-4 max-w-xl text-base text-white/70 md:text-lg">
                  12 questions. Immediate diagnosis. Practical next steps.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="inline-flex items-center justify-center rounded-full bg-[#ff7a1a] px-6 py-3 text-sm font-semibold text-[#0b0b0b] transition hover:bg-[#ff8c3a]"
                  >
                    Start the scorecard →
                  </button>
                  <a
                    className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white"
                    href="/"
                  >
                    Back to site
                  </a>
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-50px_rgba(0,0,0,0.9)] backdrop-blur md:p-8">
                <h2 className="text-xl font-semibold text-white">How it works</h2>
                <p className="mt-3 text-sm text-white/60">
                  Score yourself honestly across the four pillars. You will get a clear diagnosis, the
                  three answers that drove it, and the next step that fits your situation.
                </p>
                <div className="mt-6 grid gap-4">
                  {questionSections.map((section) => (
                    <div
                      key={section.pillar}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{section.title}</p>
                        <p className="text-xs text-white/50">{section.subtitle}</p>
                      </div>
                      <span className="text-sm font-semibold text-white/70">
                        {section.pillar === "Soul" && "Q1-3"}
                        {section.pillar === "Heart" && "Q4-6"}
                        {section.pillar === "Hands" && "Q7-10"}
                        {section.pillar === "Alignment" && "Q11-12"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section ref={formRef} className="mt-16 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)] backdrop-blur md:p-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-white">Score your reality</h2>
              <p className="text-sm text-white/60">
                Rate each statement from 1 to 5. Be honest so the diagnosis is useful.
              </p>
            </div>
            <RatingLegend />

            <form className="mt-8 space-y-10" onSubmit={handleSubmit}>
              {questionSections.map((section) => {
                const sectionQuestions = questionsWithNumbers.filter(
                  (question) => question.pillar === section.pillar,
                );

                return (
                  <div key={section.pillar} className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
                          {section.title}
                        </p>
                        <h3 className="text-lg font-semibold text-white">{section.subtitle}</h3>
                      </div>
                      <span className="text-xs font-semibold text-white/40">
                        {sectionQuestions.length} questions
                      </span>
                    </div>

                    {sectionQuestions.map((question) => (
                      <div
                        key={question.id}
                        className="rounded-2xl border border-white/10 bg-[#0c0c0f]/80 p-5 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.8)] md:p-6"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                              {question.pillar.toUpperCase()} · Q{question.number}
                            </p>
                            {attemptedSubmit && !answers[question.id] ? (
                              <span className="text-xs font-semibold text-[#ff7a1a]">Required</span>
                            ) : null}
                          </div>
                          <p className="text-base font-medium text-white">{question.text}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-[11px] text-white/40">
                          <span>Strongly Disagree (1)</span>
                          <span>Strongly Agree (5)</span>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-5">
                          {scaleLabels.map((label, optionIndex) => {
                            const value = optionIndex + 1;
                            const isChecked = answers[question.id] === value;
                            return (
                              <label
                                key={`${question.id}-${value}`}
                                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-3 py-3 text-sm transition hover:border-white/40 ${
                                  isChecked
                                    ? "border-[#ff7a1a] bg-white/10 text-white shadow-[0_12px_30px_-20px_rgba(255,122,26,0.8)]"
                                    : "border-white/10 bg-white/5 text-white/60"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={question.id}
                                  className="h-4 w-4 text-[#ff7a1a]"
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
                  </div>
                );
              })}

              <div className="flex flex-col gap-3">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#ff7a1a] px-6 py-3 text-sm font-semibold text-[#0b0b0b] transition hover:bg-[#ff8c3a] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                  disabled={!allAnswered}
                >
                  See my diagnosis
                </button>
                {!allAnswered ? (
                  <p className="text-sm text-white/50">
                    Answer all 12 questions to see your results.
                  </p>
                ) : null}
              </div>
            </form>
          </section>

          <section ref={resultsRef} className="mt-12">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_30px_80px_-60px_rgba(0,0,0,0.9)] backdrop-blur md:p-10">
              <h2 className="text-2xl font-semibold text-white">Results</h2>
              {!scores ? (
                <p className="mt-3 text-sm text-white/60">
                  Submit the scorecard to see your diagnosis and next steps.
                </p>
              ) : (
                <div className="mt-6 space-y-8">
                  <div className="rounded-3xl border border-white/10 bg-[#101018]/80 p-6 shadow-[0_30px_70px_-50px_rgba(0,0,0,0.9)] md:p-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                          Primary diagnosis
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold text-white">
                          {diagnosisInsights[scores.primary].title}
                        </h3>
                        {severity ? (
                          <p className="mt-2 text-sm text-white/60">
                            Pattern: {getPattern(scores.primary, severity)}
                          </p>
                        ) : null}
                      </div>
                      {severity ? (
                        <div className="text-right">
                          <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                            {severity}
                          </span>
                          {showSeverityNote ? (
                            <p className="mt-3 text-xs text-white/50">
                              Left unchecked, this usually stalls growth even if spend increases.
                            </p>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    <div className="mt-6 space-y-3 text-sm text-white/70">
                      <p>{diagnosisInsights[scores.primary].pattern}</p>
                      <p>{diagnosisInsights[scores.primary].consequence}</p>
                      <p className="text-white">
                        30-day rule: {getThirtyDayRule(scores.primary)}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase text-white/50">Soul avg</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{scores.soulAvg}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase text-white/50">Heart avg</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{scores.heartAvg}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase text-white/50">Hands avg</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{scores.handsAvg}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-semibold uppercase text-white/50">Alignment avg</p>
                      <p className="mt-2 text-2xl font-semibold text-white">{scores.alignAvg}</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
                    <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/50">
                      What drove this diagnosis
                    </h4>
                    <div className="mt-4 space-y-3">
                      {lowestQuestions.map((item) => {
                        const questionNumber =
                          questionsWithNumbers.find((question) => question.id === item.id)
                            ?.number ?? 0;
                        return (
                          <div
                            key={item.id}
                            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-[#0b0b0f]/70 p-4 text-sm text-white/70"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                                Q{questionNumber} · {item.pillar}
                              </span>
                              <span className="text-xs font-semibold text-white/60">
                                Score {item.score}
                              </span>
                            </div>
                            <p className="text-white/80">{item.text}</p>
                          </div>
                        );
                      })}
                    </div>
                    <p className="mt-4 text-sm text-white/60">
                      These answers usually indicate the core issue is blocking momentum elsewhere.
                    </p>
                  </div>

                  {scores.alignAvg <= 2.5 ? (
                    <div className="rounded-2xl border border-[#ff7a1a]/30 bg-[#140b05]/80 p-5 text-sm text-white/70">
                      Alignment is currently weak. Strategy and output are not reinforcing each other,
                      so results stall quickly. {alignmentSupplement}
                    </div>
                  ) : null}
                  {scores.alignAvg >= 4.0 ? (
                    <div className="rounded-2xl border border-emerald-200/30 bg-emerald-950/50 p-5 text-sm text-emerald-100">
                      Alignment looks strong. Strategy is showing up in the work, so keep it tight and
                      consistent.
                    </div>
                  ) : null}

                  <div>
                    <h3 className="text-xl font-semibold text-white">Recommended next step</h3>
                    <p className="mt-2 text-sm text-white/60">
                      {severity ? severityCopy[severity] : "Choose the path that matches your reality."}
                    </p>
                    <div className="mt-6 grid gap-6 md:grid-cols-2">
                      <PackageCardView card={packageRecommendations[scores.primary].recommended} />
                      <PackageCardView card={packageRecommendations[scores.primary].alternative} />
                    </div>
                  </div>

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_-50px_rgba(0,0,0,0.9)]">
                    <h3 className="text-xl font-semibold text-white">
                      Get your full 30–90 day action plan
                    </h3>
                    <p className="mt-2 text-sm text-white/60">
                      If you want the step-by-step roadmap for this diagnosis, we’ll email it to you.
                      You can use it yourself or bring it to a call.
                    </p>
                    <form className="mt-6 space-y-4" onSubmit={handleLeadSubmit}>
                      <label className="block text-sm text-white/70">
                        Email
                        <input
                          type="email"
                          name="email"
                          required
                          value={leadEmail}
                          onChange={(event) => {
                            setLeadEmail(event.target.value);
                            if (leadStatus !== "idle") {
                              setLeadStatus("idle");
                              setLeadError("");
                            }
                          }}
                          className="mt-2 w-full rounded-2xl border border-white/10 bg-[#0b0b0f]/70 px-4 py-3 text-sm text-white outline-none transition focus:border-[#ff7a1a]"
                          placeholder="you@company.com"
                        />
                      </label>
                      <label className="flex items-start gap-3 text-sm text-white/70">
                        <input
                          type="checkbox"
                          required
                          checked={leadConsent}
                          onChange={(event) => {
                            setLeadConsent(event.target.checked);
                            if (leadStatus !== "idle") {
                              setLeadStatus("idle");
                              setLeadError("");
                            }
                          }}
                          className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent text-[#ff7a1a]"
                        />
                        <span>I agree to be emailed my results and occasional follow-ups.</span>
                      </label>
                      <button
                        type="submit"
                        disabled={!emailIsValid || !leadConsent || isLeadSubmitting || isLeadSuccess}
                        className="inline-flex items-center justify-center rounded-full bg-[#ff7a1a] px-6 py-3 text-sm font-semibold text-[#0b0b0b] transition hover:bg-[#ff8c3a] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                      >
                        {isLeadSubmitting ? "Sending..." : "Email me the action plan"}
                      </button>
                      {isLeadSuccess ? (
                        <p className="text-sm text-emerald-200">
                          Done. Check your inbox in a minute.
                        </p>
                      ) : null}
                      {leadStatus === "error" ? (
                        <p className="text-sm text-[#ff7a1a]">{leadError}</p>
                      ) : null}
                    </form>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      className="inline-flex w-full items-center justify-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white/70 transition hover:border-white/40 hover:text-white"
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
    </div>
  );
};

export default App;
