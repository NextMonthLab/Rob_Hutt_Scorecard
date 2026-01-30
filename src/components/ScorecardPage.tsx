import { useParams, Navigate } from "react-router-dom";
import { getScorecardBySlug } from "../scorecards";
import { ScorecardRunner } from "./ScorecardRunner";

export const ScorecardPage = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/scorecards/marketing-reality-check" replace />;
  }

  const config = getScorecardBySlug(slug);

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050505] text-white">
        <div className="text-center">
          <h1 className="text-4xl font-semibold">Scorecard not found</h1>
          <p className="mt-4 text-white/60">
            The scorecard "{slug}" does not exist.
          </p>
          <a
            href="/scorecards/marketing-reality-check"
            className="mt-8 inline-block rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Go to Marketing Reality Check
          </a>
        </div>
      </div>
    );
  }

  return <ScorecardRunner config={config} />;
};

export default ScorecardPage;
