export const SCORE_VALUES = [1, 2, 3, 4, 5] as const;

export type ScoreValue = (typeof SCORE_VALUES)[number];

export type DimensionKey =
  | "exploitability"
  | "requiredAccess"
  | "reachability"
  | "blastRadius"
  | "dataSensitivity"
  | "integrityImpact"
  | "availabilityImpact"
  | "detectabilityGap"
  | "compensatingControls"
  | "businessCriticality";

export type DimensionGroup = "Exposure" | "Impact" | "Context";

export type DimensionConfig = {
  key: DimensionKey;
  label: string;
  description: string;
  weight: number;
  group: DimensionGroup;
};

export type CalculatorState = {
  [K in DimensionKey]: ScoreValue;
};

export type PriorityLevel = "Low" | "Medium" | "High" | "Critical";

export type Contribution = {
  key: DimensionKey;
  label: string;
  score: ScoreValue;
  weight: number;
  weightedRaw: number;
  maxWeightedRaw: number;
  percentOfMax: number;
};

export type ScoreResult = {
  raw: number;
  normalized: number;
  priority: PriorityLevel;
  contributions: Contribution[];
};

export const DIMENSIONS: readonly DimensionConfig[] = [
  {
    key: "exploitability",
    label: "Exploitability",
    description: "How practical exploitation is in the real application.",
    weight: 0.2,
    group: "Exposure",
  },
  {
    key: "requiredAccess",
    label: "Required Access",
    description: "How little access an attacker needs (5 means none/minimal access).",
    weight: 0.1,
    group: "Exposure",
  },
  {
    key: "reachability",
    label: "Reachability",
    description: "Whether the vulnerable path is reachable in deployed environments.",
    weight: 0.15,
    group: "Exposure",
  },
  {
    key: "blastRadius",
    label: "Blast Radius",
    description: "How broadly users, tenants, or systems can be impacted.",
    weight: 0.15,
    group: "Impact",
  },
  {
    key: "dataSensitivity",
    label: "Data Sensitivity",
    description: "Sensitivity of data that could be exposed, altered, or destroyed.",
    weight: 0.15,
    group: "Impact",
  },
  {
    key: "integrityImpact",
    label: "Integrity Impact",
    description: "Degree of unauthorized data or system modification possible.",
    weight: 0.1,
    group: "Impact",
  },
  {
    key: "availabilityImpact",
    label: "Availability Impact",
    description: "Potential service disruption or degradation caused by exploitation.",
    weight: 0.05,
    group: "Impact",
  },
  {
    key: "detectabilityGap",
    label: "Detectability Gap",
    description: "How likely exploitation is to evade existing detection controls.",
    weight: 0.05,
    group: "Context",
  },
  {
    key: "compensatingControls",
    label: "Compensating Controls",
    description: "How weak compensating controls are (5 means little/no mitigation).",
    weight: 0.1,
    group: "Context",
  },
  {
    key: "businessCriticality",
    label: "Business Criticality",
    description: "Importance of the affected feature, workflow, or environment.",
    weight: 0.15,
    group: "Context",
  },
] as const;

export const WEIGHT_SUM = DIMENSIONS.reduce((sum, dimension) => {
  return sum + dimension.weight;
}, 0);

export const MAX_RAW_SCORE = 5 * WEIGHT_SUM;

export const DEFAULT_STATE: CalculatorState = Object.fromEntries(
  DIMENSIONS.map((dimension) => [dimension.key, 3])
) as CalculatorState;

export const EXAMPLE_ONE_STATE: CalculatorState = {
  exploitability: 2,
  requiredAccess: 1,
  reachability: 1,
  blastRadius: 1,
  dataSensitivity: 1,
  integrityImpact: 2,
  availabilityImpact: 1,
  detectabilityGap: 2,
  compensatingControls: 1,
  businessCriticality: 2,
};

export const EXAMPLE_TWO_STATE: CalculatorState = {
  exploitability: 4,
  requiredAccess: 4,
  reachability: 5,
  blastRadius: 5,
  dataSensitivity: 5,
  integrityImpact: 4,
  availabilityImpact: 2,
  detectabilityGap: 4,
  compensatingControls: 4,
  businessCriticality: 5,
};

export function computePriority(normalizedScore: number): PriorityLevel {
  if (normalizedScore >= 9) {
    return "Critical";
  }

  if (normalizedScore >= 7) {
    return "High";
  }

  if (normalizedScore >= 4) {
    return "Medium";
  }

  return "Low";
}

export function computeScore(state: CalculatorState): ScoreResult {
  const contributions = DIMENSIONS.map((dimension) => {
    const score = state[dimension.key];
    const weightedRaw = score * dimension.weight;
    const maxWeightedRaw = 5 * dimension.weight;

    return {
      key: dimension.key,
      label: dimension.label,
      score,
      weight: dimension.weight,
      weightedRaw,
      maxWeightedRaw,
      percentOfMax: (weightedRaw / maxWeightedRaw) * 100,
    };
  });

  const raw = contributions.reduce((sum, contribution) => {
    return sum + contribution.weightedRaw;
  }, 0);

  const normalized = (raw / MAX_RAW_SCORE) * 10;

  return {
    raw,
    normalized,
    priority: computePriority(normalized),
    contributions,
  };
}

export function isScoreValue(value: unknown): value is ScoreValue {
  return (
    typeof value === "number" &&
    Number.isInteger(value) &&
    value >= SCORE_VALUES[0] &&
    value <= SCORE_VALUES[SCORE_VALUES.length - 1]
  );
}

export function isCalculatorState(value: unknown): value is CalculatorState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const maybeState = value as Partial<Record<DimensionKey, unknown>>;

  return DIMENSIONS.every((dimension) => {
    return isScoreValue(maybeState[dimension.key]);
  });
}
