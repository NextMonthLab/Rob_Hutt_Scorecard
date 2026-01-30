import { useMemo, useRef, useState } from "react";
import type {
  ScorecardConfig,
  PillarKey,
  SeverityBand,
  PillarAverages,
  ScorecardInsightsPayload,
  PackageCard,
} from "../scorecards/types";
import { submitScorecardToCharacterX } from "../utils/characterx";

interface ScorecardRunnerProps {
  config: ScorecardConfig;
}

interface ScoreResult extends PillarAverages {
  primary: PillarKey;
  secondary: PillarKey;
}

interface LowestQuestion {
  id: string;
  pillar: string;
  text: string;
  score: number;
}

const mean = (values: number[]): number =>
  values.reduce((total, value) => total + value, 0) / values.length;

const roundToOne = (value: number): number => Math.round(value * 10) / 10;

const calculatePillarAverages = (
  answers: Record<string, number>,
  config: ScorecardConfig,
): PillarAverages => {
  const soulQuestions = config.questions.filter((q) => q.pillar === "Soul");
  const heartQuestions = config.questions.filter((q) => q.pillar === "Heart");
  const handsQuestions = config.questions.filter((q) => q.pillar === "Hands");
  const alignQuestions = config.questions.filter((q) => q.pillar === "Alignment");

  const soulAvg = mean(soulQuestions.map((q) => answers[q.id] || 0));
  const heartAvg = mean(heartQuestions.map((q) => answers[q.id] || 0));
  const handsAvg = mean(handsQuestions.map((q) => answers[q.id] || 0));
  const alignAvg = mean(alignQuestions.map((q) => answers[q.id] || 0));

  return {
    soulAvg: roundToOne(soulAvg),
    heartAvg: roundToOne(heartAvg),
    handsAvg: roundToOne(handsAvg),
    alignAvg: roundToOne(alignAvg),
  };
};

const calculateScores = (
  answers: Record<string, number>,
  config: ScorecardConfig,
): ScoreResult => {
  const { soulAvg, heartAvg, handsAvg, alignAvg } = calculatePillarAverages(answers, config);

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

const getSeverityBand = (score: number): SeverityBand => {
  if (score >= 4) return "Healthy";
  if (score >= 3) return "Improving";
  if (score >= 2) return "Leaking";
  return "Critical";
};

const getLowestQuestions = (
  answers: Record<string, number>,
  config: ScorecardConfig,
  count = 3,
): LowestQuestion[] => {
  const scored = config.questions.map((question, index) => ({
    ...question,
    score: answers[question.id] || 0,
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

const RatingLegend = ({ scaleLabels }: { scaleLabels: string[] }) => (
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

const PackageCardView = ({ card, accent }: { card: PackageCard; accent: string }) => (
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
      className="mt-6 inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-[#0b0b0b] transition hover:opacity-90"
      style={{ backgroundColor: accent }}
      href={card.cta.href}
    >
      {card.cta.label}
    </a>
  </div>
);

export const ScorecardRunner = ({ config }: ScorecardRunnerProps) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [planStatus, setPlanStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [planError, setPlanError] = useState("");
  const resultsRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLDivElement | null>(null);

  const questionsWithNumbers = useMemo(
    () => config.questions.map((question, index) => ({ ...question, number: index + 1 })),
    [config.questions],
  );

  const allAnswered = config.questions.every((question) => answers[question.id]);
  const scores = useMemo(() => {
    if (!hasSubmitted || !allAnswered) {
      return null;
    }
    return calculateScores(answers, config);
  }, [answers, hasSubmitted, allAnswered, config]);

  const lowestQuestions = useMemo(() => {
    if (!scores) {
      return [];
    }
    return getLowestQuestions(answers, config, 3);
  }, [answers, scores, config]);

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
    setPlanStatus("idle");
    setPlanError("");
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

  const getPattern = (primary: PillarKey, sev: SeverityBand): string => {
    const isCritical = sev === "Critical" || sev === "Leaking";
    return isCritical ? config.patterns[primary].critical : config.patterns[primary].improving;
  };

  const overallAvg = scores
    ? roundToOne((scores.soulAvg + scores.heartAvg + scores.handsAvg + scores.alignAvg) / 4)
    : 0;

  const getHighestPillars = (): PillarKey[] => {
    if (!scores) return [];
    const entries: Array<{ key: PillarKey; value: number }> = [
      { key: "Soul", value: scores.soulAvg },
      { key: "Heart", value: scores.heartAvg },
      { key: "Hands", value: scores.handsAvg },
    ];
    return entries
      .sort((a, b) => b.value - a.value)
      .slice(0, 2)
      .map((e) => e.key);
  };

  const getLowestPillars = (): PillarKey[] => {
    if (!scores) return [];
    const entries: Array<{ key: PillarKey; value: number }> = [
      { key: "Soul", value: scores.soulAvg },
      { key: "Heart", value: scores.heartAvg },
      { key: "Hands", value: scores.handsAvg },
    ];
    return entries
      .sort((a, b) => a.value - b.value)
      .slice(0, 2)
      .map((e) => e.key);
  };

  const handleGeneratePlan = async () => {
    if (!scores || !severity) return;

    setPlanStatus("submitting");
    setPlanError("");

    const payload: ScorecardInsightsPayload = {
      source: config.handoff.source,
      routeTag: config.handoff.routeTag,
      completedAt: new Date().toISOString(),
      totals: {
        overallAvg,
        pillarAverages: {
          soulAvg: scores.soulAvg,
          heartAvg: scores.heartAvg,
          handsAvg: scores.handsAvg,
          alignAvg: scores.alignAvg,
        },
      },
      lowestPillars: getLowestPillars(),
      highestPillars: getHighestPillars(),
      answers: config.questions.map((q) => ({
        questionId: q.id,
        pillarId: q.pillar,
        score: answers[q.id],
      })),
    };

    try {
      const result = await submitScorecardToCharacterX(payload);
      if (result.editUrl) {
        window.location.href = result.editUrl;
      } else {
        setPlanStatus("success");
      }
    } catch {
      setPlanStatus("error");
      setPlanError("Something went wrong. Please try again.");
    }
  };

  const { accent, accentHover, brandName } = config.theme;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      <style>
        {`
          .accent-btn {
            background-color: ${accent};
          }
          .accent-btn:hover {
            background-color: ${accentHover};
          }
          .accent-border {
            border-color: ${accent};
          }
          .accent-shadow {
            box-shadow: 0 12px 30px -20px ${accent}cc;
          }
          .accent-text {
            color: ${accent};
          }
        `}
      </style>

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0b0b0f] via-[#0a0f16] to-[#040404]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_rgba(0,0,0,0.8),_transparent_60%)]" />
      </div>

      <div className="relative">
        <header className="border-b border-white/10">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6">
            <span className="text-lg font-semibold tracking-wide text-white">{brandName}</span>
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
                  {config.title}
                </p>
                <h1 className="mt-4 text-4xl font-semibold leading-tight text-white md:text-5xl">
                  {config.title}
                </h1>
                <p className="mt-4 max-w-xl text-base text-white/70 md:text-lg">
                  {config.subtitle}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <button
                    type="button"
                    onClick={scrollToForm}
                    className="accent-btn inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-[#0b0b0b] transition"
                  >
                    Start the scorecard
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
                <h2 className="text-xl font-semibold text-white">{config.intro.heading}</h2>
                <p className="mt-3 text-sm text-white/60">{config.intro.body}</p>
                <div className="mt-6 grid gap-4">
                  {config.pillars.map((pillar) => (
                    <div
                      key={pillar.id}
                      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">{pillar.title}</p>
                        <p className="text-xs text-white/50">{pillar.subtitle}</p>
                      </div>
                      <span className="text-sm font-semibold text-white/70">{pillar.questionRange}</span>
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
            <RatingLegend scaleLabels={config.scaleLabels} />

            <form className="mt-8 space-y-10" onSubmit={handleSubmit}>
              {config.pillars.map((section) => {
                const sectionQuestions = questionsWithNumbers.filter(
                  (question) => question.pillar === section.id,
                );

                return (
                  <div key={section.id} className="space-y-4">
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
                              <span className="accent-text text-xs font-semibold">Required</span>
                            ) : null}
                          </div>
                          <p className="text-base font-medium text-white">{question.text}</p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-[11px] text-white/40">
                          <span>{config.scaleLabels[0]} (1)</span>
                          <span>{config.scaleLabels[4]} (5)</span>
                        </div>
                        <div className="mt-4 grid gap-3 sm:grid-cols-5">
                          {config.scaleLabels.map((label, optionIndex) => {
                            const value = optionIndex + 1;
                            const isChecked = answers[question.id] === value;
                            return (
                              <label
                                key={`${question.id}-${value}`}
                                className={`flex cursor-pointer flex-col items-center gap-2 rounded-xl border px-3 py-3 text-sm transition hover:border-white/40 ${
                                  isChecked
                                    ? "accent-border accent-shadow bg-white/10 text-white"
                                    : "border-white/10 bg-white/5 text-white/60"
                                }`}
                              >
                                <input
                                  type="radio"
                                  name={question.id}
                                  className="h-4 w-4"
                                  style={{ accentColor: accent }}
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
                  className="accent-btn inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-[#0b0b0b] transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                  disabled={!allAnswered}
                >
                  See my diagnosis
                </button>
                {!allAnswered ? (
                  <p className="text-sm text-white/50">
                    Answer all {config.questions.length} questions to see your results.
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
                          {config.diagnosisInsights[scores.primary].title}
                        </h3>
                        {severity ? (
                          <p className="mt-2 text-xs text-white/60">
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
                      <p>{config.diagnosisInsights[scores.primary].pattern}</p>
                      <p>{config.diagnosisInsights[scores.primary].consequence}</p>
                      <p className="text-white">
                        30-day rule: {config.thirtyDayRules[scores.primary]}
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
                    <div
                      className="rounded-2xl border p-5 text-sm text-white/70"
                      style={{ borderColor: `${accent}4d`, backgroundColor: "#140b0580" }}
                    >
                      Alignment is currently weak. Strategy and output are not reinforcing each other,
                      so results stall quickly. {config.alignmentNotes[scores.primary]}
                    </div>
                  ) : null}
                  {scores.alignAvg >= 4.0 ? (
                    <div className="rounded-2xl border border-emerald-200/30 bg-emerald-950/50 p-5 text-sm text-emerald-100">
                      Alignment looks strong. Strategy is showing up in the work, so keep it tight and
                      consistent.
                    </div>
                  ) : null}

                  {config.packageRecommendations && (
                    <div>
                      <h3 className="text-xl font-semibold text-white">Recommended next step</h3>
                      <p className="mt-2 text-sm text-white/60">
                        {severity ? config.severityCopy[severity] : "Choose the path that matches your reality."}
                      </p>
                      <div className="mt-6 grid gap-6 md:grid-cols-2">
                        <PackageCardView
                          card={config.packageRecommendations[scores.primary].recommended}
                          accent={accent}
                        />
                        <PackageCardView
                          card={config.packageRecommendations[scores.primary].alternative}
                          accent={accent}
                        />
                      </div>
                    </div>
                  )}

                  <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_60px_-50px_rgba(0,0,0,0.9)]">
                    <h3 className="text-xl font-semibold text-white">{config.resultsCTA.label}</h3>
                    <p className="mt-2 text-sm text-white/60">{config.resultsCTA.description}</p>
                    <div className="mt-6 space-y-4">
                      <button
                        type="button"
                        onClick={handleGeneratePlan}
                        disabled={planStatus === "submitting" || planStatus === "success"}
                        className="accent-btn inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-[#0b0b0b] transition disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
                      >
                        {planStatus === "submitting" ? "Creating..." : config.resultsCTA.buttonText}
                      </button>
                      {planStatus === "success" && (
                        <p className="text-sm text-emerald-200">
                          Your plan is being prepared. You will be redirected shortly.
                        </p>
                      )}
                      {planStatus === "error" && (
                        <p className="accent-text text-sm">{planError}</p>
                      )}
                    </div>
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

export default ScorecardRunner;
