import Link from "next/link";
import { DIMENSION_GUIDE } from "@/lib/scoring-guide";

export default function ScoringGuidePage() {
  return (
    <div className="min-h-full bayes-shell">
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="surface-panel space-y-4">
          <p className="eyebrow">Bayes AppSec Priority Index</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
              Scoring Explanations
            </h1>
            <Link href="/" className="action-btn">
              Back to Calculator
            </Link>
          </div>
          <p className="max-w-4xl text-sm leading-6 text-[color:var(--text-muted)] sm:text-base">
            Detailed anchor meanings for selected scoring dimensions.
          </p>
          <p className="text-xs text-[color:var(--text-subtle)]">
            Note: most dimensions shown here use the provided 0-5 rubric.
            Detectability Gap uses 1-5 to align with the calculator model.
          </p>
        </header>

        <section className="mt-6 grid gap-6">
          {DIMENSION_GUIDE.map((dimension) => {
            return (
              <article key={dimension.dimension} className="surface-panel space-y-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight">
                    {dimension.dimension}
                  </h2>
                  <p className="text-sm text-[color:var(--text-subtle)]">
                    {dimension.notes}
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[color:var(--surface-stroke)] text-[color:var(--text-subtle)]">
                        <th className="px-3 py-2 font-semibold">Score</th>
                        <th className="px-3 py-2 font-semibold">Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dimension.anchors.map((anchor) => {
                        return (
                          <tr
                            key={`${dimension.dimension}-${anchor.score}`}
                            className="border-b border-[color:var(--surface-stroke)] last:border-0"
                          >
                            <td className="px-3 py-2 font-mono text-[color:var(--text-strong)]">
                              {anchor.score}
                            </td>
                            <td className="px-3 py-2 text-[color:var(--text-muted)]">
                              {anchor.meaning}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
        </section>
      </main>
    </div>
  );
}
