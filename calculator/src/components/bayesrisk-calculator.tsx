"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_STATE,
  DIMENSIONS,
  EXAMPLE_ONE_STATE,
  EXAMPLE_TWO_STATE,
  MAX_RAW_SCORE,
  SCORE_VALUES,
  WEIGHT_SUM,
  computeScore,
  isCalculatorState,
  type CalculatorState,
  type DimensionGroup,
  type DimensionKey,
  type PriorityLevel,
  type ScoreValue,
} from "@/lib/bayesrisk";
import { getScoreMeaning } from "@/lib/scoring-guide";

const STORAGE_KEY = "bayesrisk:v1";
const STORAGE_VERSION = 1;
const SAVE_DEBOUNCE_MS = 200;

type PersistedPayload = {
  version: number;
  state: CalculatorState;
};

const GROUP_ORDER: DimensionGroup[] = ["Exposure", "Impact", "Context"];

const GROUP_DESCRIPTION: Record<DimensionGroup, string> = {
  Exposure: "How reachable and practical exploitation is.",
  Impact: "How severe the data/system impact can become.",
  Context: "How detection, controls, and business factors shift urgency.",
};

const PRIORITY_LABELS: Record<PriorityLevel, string> = {
  Low: "Low",
  Medium: "Medium",
  High: "High",
  Critical: "Critical",
};

const PRIORITY_TEXT: Record<PriorityLevel, string> = {
  Low: "Limited practical risk or low remediation urgency.",
  Medium: "Meaningful risk that should be planned and remediated.",
  High: "Significant application risk requiring prioritized remediation.",
  Critical: "Severe business or security risk requiring urgent remediation.",
};

function groupDimensions() {
  return GROUP_ORDER.map((group) => {
    const dimensions = DIMENSIONS.filter((dimension) => dimension.group === group);
    return { group, dimensions };
  });
}

const GROUPED_DIMENSIONS = groupDimensions();

function parsePersistedState(value: string): CalculatorState | null {
  try {
    const parsed = JSON.parse(value) as Partial<PersistedPayload>;

    if (
      parsed &&
      parsed.version === STORAGE_VERSION &&
      isCalculatorState(parsed.state)
    ) {
      return parsed.state;
    }
  } catch {
    return null;
  }

  return null;
}

function loadInitialState(): CalculatorState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return DEFAULT_STATE;
  }

  return parsePersistedState(stored) ?? DEFAULT_STATE;
}

function priorityClass(priority: PriorityLevel): string {
  if (priority === "Low") {
    return "priority-low";
  }

  if (priority === "Medium") {
    return "priority-medium";
  }

  if (priority === "High") {
    return "priority-high";
  }

  return "priority-critical";
}

export default function BayesRiskCalculator() {
  const [state, setState] = useState<CalculatorState>(() => loadInitialState());

  const scoreResult = useMemo(() => {
    return computeScore(state);
  }, [state]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const payload: PersistedPayload = {
        version: STORAGE_VERSION,
        state,
      };

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore storage failures to keep scoring available in restricted browsers.
      }
    }, SAVE_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [state]);

  const handleDimensionChange = (key: DimensionKey, value: ScoreValue) => {
    setState((currentState) => ({
      ...currentState,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
  };

  return (
    <div className="min-h-full bayes-shell" suppressHydrationWarning>
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="surface-panel space-y-4">
          <p className="eyebrow">Bayes AppSec Priority Index</p>
          <h1 className="text-balance text-3xl font-semibold tracking-tight sm:text-4xl">
            BayesRisk Calculator
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[color:var(--text-muted)] sm:text-base">
            Evidence-based AppSec remediation priority. Score one finding at a time
            using application context, then prioritize remediation using a normalized
            0-10 index.
          </p>
          <p className="font-mono text-xs text-[color:var(--text-subtle)]">
            Formula: Raw = Sum(dimension * weight), Normalized = (Raw / {MAX_RAW_SCORE.toFixed(2)})
            * 10, Weights = {WEIGHT_SUM.toFixed(2)}
          </p>
          <div className="flex flex-wrap gap-2">
            <Link href="/scoring-guide" className="action-btn">
              Scoring Explanation Guide
            </Link>
          </div>
        </header>

        <section className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="space-y-6">
            <div className="surface-panel flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-[color:var(--text-strong)]">
                  Presets and Actions
                </p>
                <p className="text-xs text-[color:var(--text-subtle)]">
                  Example values are illustrative and map to README narratives.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => setState(EXAMPLE_ONE_STATE)}
                >
                  Use Example 1
                </button>
                <button
                  type="button"
                  className="action-btn"
                  onClick={() => setState(EXAMPLE_TWO_STATE)}
                >
                  Use Example 2
                </button>
                <button type="button" className="action-btn" onClick={handleReset}>
                  Reset to Defaults
                </button>
              </div>
            </div>

            {GROUPED_DIMENSIONS.map(({ group, dimensions }) => {
              return (
                <section key={group} className="surface-panel space-y-4">
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold tracking-tight">{group}</h2>
                    <p className="text-sm text-[color:var(--text-subtle)]">
                      {GROUP_DESCRIPTION[group]}
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {dimensions.map((dimension) => {
                      const currentValue = state[dimension.key];

                      return (
                        <fieldset key={dimension.key} className="dimension-card">
                          <legend className="dimension-title">{dimension.label}</legend>
                          <p className="dimension-description">{dimension.description}</p>

                          <div className="mt-3 flex items-center justify-between text-xs text-[color:var(--text-subtle)]">
                            <span>Lower urgency</span>
                            <span>Higher urgency</span>
                          </div>

                          <div className="mt-2 grid grid-cols-5 gap-2">
                            {SCORE_VALUES.map((value) => {
                              const scoreMeaning = getScoreMeaning(dimension.key, value);
                              const tooltipText = scoreMeaning
                                ? `${dimension.label} ${value}: ${scoreMeaning}`
                                : `${dimension.label} ${value}`;

                              return (
                                <label
                                  key={`${dimension.key}-${value}`}
                                  className="score-label"
                                  title={tooltipText}
                                >
                                  <input
                                    type="radio"
                                    name={dimension.key}
                                    value={value}
                                    checked={currentValue === value}
                                    onChange={() =>
                                      handleDimensionChange(dimension.key, value)
                                    }
                                    className="sr-only"
                                    aria-label={tooltipText}
                                  />
                                  <span className="score-pill">{value}</span>
                                </label>
                              );
                            })}
                          </div>

                          <p className="mt-3 text-xs text-[color:var(--text-subtle)]">
                            Weight: <span className="font-mono">{dimension.weight.toFixed(2)}</span>
                          </p>
                        </fieldset>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>

          <aside className="space-y-4 lg:sticky lg:top-6 lg:h-fit">
            <section className="surface-panel space-y-4">
              <h2 className="text-lg font-semibold tracking-tight">Result</h2>
              <div className="rounded-xl border border-[color:var(--surface-stroke)] bg-[color:var(--surface-muted)] p-4">
                <p className="text-xs uppercase tracking-wide text-[color:var(--text-subtle)]">
                  Normalized Score
                </p>
                <p className="mt-1 font-mono text-4xl font-semibold text-[color:var(--text-strong)]">
                  {scoreResult.normalized.toFixed(1)}
                </p>
                <p className="mt-1 font-mono text-xs text-[color:var(--text-subtle)]">
                  Raw: {scoreResult.raw.toFixed(2)} / {MAX_RAW_SCORE.toFixed(2)}
                </p>
              </div>

              <div>
                <span className={`priority-chip ${priorityClass(scoreResult.priority)}`}>
                  {PRIORITY_LABELS[scoreResult.priority]}
                </span>
                <p className="mt-2 text-sm text-[color:var(--text-muted)]">
                  {PRIORITY_TEXT[scoreResult.priority]}
                </p>
              </div>

              <p className="text-xs text-[color:var(--text-subtle)]">
                State is stored locally in this browser when storage is available.
              </p>
            </section>

            <section className="surface-panel">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-[color:var(--text-subtle)]">
                Contribution Breakdown
              </h2>
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[color:var(--surface-stroke)] text-[color:var(--text-subtle)]">
                      <th className="px-2 py-2 font-medium">Dimension</th>
                      <th className="px-2 py-2 font-medium">Score</th>
                      <th className="px-2 py-2 font-medium">Weighted</th>
                      <th className="px-2 py-2 font-medium">% Max</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scoreResult.contributions.map((contribution) => {
                      return (
                        <tr
                          key={contribution.key}
                          className="border-b border-[color:var(--surface-stroke)] last:border-0"
                        >
                          <td className="px-2 py-2 text-[color:var(--text-muted)]">
                            {contribution.label}
                          </td>
                          <td className="px-2 py-2 font-mono text-[color:var(--text-strong)]">
                            {contribution.score}
                          </td>
                          <td className="px-2 py-2 font-mono text-[color:var(--text-strong)]">
                            {contribution.weightedRaw.toFixed(2)}
                          </td>
                          <td className="px-2 py-2 font-mono text-[color:var(--text-strong)]">
                            {contribution.percentOfMax.toFixed(0)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  );
}
