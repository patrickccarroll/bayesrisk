import type { DimensionKey, ScoreValue } from "@/lib/bayesrisk";

type GuideScore = 0 | ScoreValue;

export type ScoreMeaning = {
  score: GuideScore;
  meaning: string;
};

export type DimensionGuide = {
  key: DimensionKey;
  dimension: string;
  notes: string;
  anchors: readonly ScoreMeaning[];
};

export const DIMENSION_GUIDE: readonly DimensionGuide[] = [
  {
    key: "exploitability",
    dimension: "Exploitability",
    notes: "Higher scores indicate exploitation is easier and more repeatable.",
    anchors: [
      { score: 0, meaning: "No known exploit path" },
      { score: 1, meaning: "Theoretical only" },
      { score: 2, meaning: "Requires unusual conditions or deep knowledge" },
      { score: 3, meaning: "Repeatable by authenticated user" },
      { score: 4, meaning: "Easy to exploit with basic technical skill" },
      { score: 5, meaning: "Trivially exploitable or automatable" },
    ],
  },
  {
    key: "requiredAccess",
    dimension: "Required Access",
    notes: "Higher scores indicate less attacker access is needed.",
    anchors: [
      { score: 0, meaning: "Internal engineering/admin-only access" },
      { score: 1, meaning: "Support/admin role only" },
      { score: 2, meaning: "Privileged customer user" },
      { score: 3, meaning: "Any authenticated user" },
      { score: 4, meaning: "Self-registered/free trial user" },
      { score: 5, meaning: "Anonymous internet user" },
    ],
  },
  {
    key: "reachability",
    dimension: "Reachability",
    notes: "Higher scores indicate broader and more direct production reachability.",
    anchors: [
      {
        score: 0,
        meaning:
          "Not present in deployed runtime path; dead code, test-only code, disabled feature, unreachable branch",
      },
      {
        score: 1,
        meaning:
          "Only reachable through unusual configuration, legacy feature, rare edge case, or manually enabled feature flag",
      },
      {
        score: 2,
        meaning:
          "Reachable through uncommon workflow, non-default setting, low-usage feature, or unusual data state",
      },
      {
        score: 3,
        meaning:
          "Reachable through normal product workflow, but not a core or high-frequency path",
      },
      {
        score: 4,
        meaning:
          "Reachable through common/core product workflow used regularly by customers",
      },
      {
        score: 5,
        meaning:
          "Automatically or routinely reached by system behavior, background jobs, public APIs, login/session flows, imports, search, report generation, or other high-frequency paths",
      },
    ],
  },
  {
    key: "blastRadius",
    dimension: "Blast Radius",
    notes: "Higher scores indicate broader user, tenant, or platform impact.",
    anchors: [
      { score: 0, meaning: "No meaningful impact" },
      { score: 1, meaning: "Single user" },
      { score: 2, meaning: "Multiple users in same tenant" },
      { score: 3, meaning: "Entire tenant" },
      { score: 4, meaning: "Multiple tenants possible" },
      { score: 5, meaning: "Platform-wide or systemic cross-tenant impact" },
    ],
  },
  {
    key: "dataSensitivity",
    dimension: "Data Sensitivity",
    notes: "Higher scores indicate more sensitive or regulated data exposure risk.",
    anchors: [
      { score: 0, meaning: "No data exposure" },
      { score: 1, meaning: "Public/non-sensitive data" },
      { score: 2, meaning: "Internal metadata" },
      { score: 3, meaning: "Customer business data" },
      {
        score: 4,
        meaning: "Confidential customer data, security logs, private files",
      },
      {
        score: 5,
        meaning: "Secrets, credentials, regulated data, authentication material",
      },
    ],
  },
  {
    key: "integrityImpact",
    dimension: "Integrity Impact",
    notes: "Higher scores indicate greater unauthorized modification potential.",
    anchors: [
      {
        score: 0,
        meaning:
          "No ability to modify data, state, configuration, permissions, workflows, or system behavior",
      },
      {
        score: 1,
        meaning:
          "Very limited modification of low-value personal/user-controlled fields with little or no downstream effect",
      },
      {
        score: 2,
        meaning:
          "Unauthorized modification of low-risk records, preferences, labels, comments, metadata, or non-critical workflow state",
      },
      {
        score: 3,
        meaning:
          "Unauthorized modification of meaningful business data, user-generated content, records, reports, or workflow outcomes within the attacker's own tenant/context",
      },
      {
        score: 4,
        meaning:
          "Unauthorized modification of sensitive business data, security-relevant settings, permissions, audit-relevant records, or another user's data within a tenant",
      },
      {
        score: 5,
        meaning:
          "Unauthorized modification across tenants, privilege/role manipulation, system configuration changes, tampering with audit/security records, or changes that compromise platform trust",
      },
    ],
  },
  {
    key: "availabilityImpact",
    dimension: "Availability Impact",
    notes:
      "Higher scores indicate broader and more severe service disruption potential.",
    anchors: [
      { score: 0, meaning: "No realistic availability impact" },
      {
        score: 1,
        meaning:
          "Minor inconvenience or temporary disruption to a single user session, request, or non-critical action",
      },
      {
        score: 2,
        meaning:
          "Degradation of a limited feature, low-value workflow, or small number of users; easy recovery or self-correcting",
      },
      {
        score: 3,
        meaning:
          "Meaningful disruption to a business workflow, tenant feature, background job, queue, report, import/export, or service dependency",
      },
      {
        score: 4,
        meaning:
          "Significant outage or degradation for an entire tenant, major product area, shared service, or operational process",
      },
      {
        score: 5,
        meaning:
          "Platform-wide outage, cross-tenant service degradation, resource exhaustion, persistent denial of service, or disruption requiring emergency operational response",
      },
    ],
  },
  {
    key: "detectabilityGap",
    dimension: "Detectability Gap",
    notes: "Higher scores indicate a larger monitoring and alerting blind spot.",
    anchors: [
      {
        score: 1,
        meaning: "Exploitation is likely detected quickly (strong logs + alerts)",
      },
      {
        score: 2,
        meaning: "Mostly detectable, but may require manual triage",
      },
      {
        score: 3,
        meaning: "Detectable with effort; correlation/forensics often needed",
      },
      {
        score: 4,
        meaning: "Hard to detect due to limited telemetry or weak alerting",
      },
      {
        score: 5,
        meaning:
          "Likely to go unnoticed for a long time (major detection blind spot)",
      },
    ],
  },
  {
    key: "compensatingControls",
    dimension: "Compensating Controls",
    notes:
      "Higher scores indicate stronger controls that reduce practical exploitability.",
    anchors: [
      { score: 0, meaning: "No meaningful compensating controls" },
      { score: 1, meaning: "Partial logging or limited exposure" },
      {
        score: 2,
        meaning: "Role checks, feature flags, or rate limits reduce risk",
      },
      {
        score: 3,
        meaning:
          "Strong access controls or segmentation reduce practical exploitability",
      },
      {
        score: 4,
        meaning: "Multiple independent controls would likely block exploitation",
      },
      {
        score: 5,
        meaning: "Exploit is largely impractical due to strong controls",
      },
    ],
  },
  {
    key: "businessDependency",
    dimension: "Business Dependency",
    notes:
      "Higher scores indicate stronger business reliance on the affected capability.",
    anchors: [
      {
        score: 0,
        meaning:
          "Non-production, test-only, deprecated, unused, or no business dependency",
      },
      {
        score: 1,
        meaning: "Low-use convenience feature with little business dependency",
      },
      {
        score: 2,
        meaning:
          "Supporting feature used by some customers or internal teams, but not central to product delivery",
      },
      {
        score: 3,
        meaning:
          "Regularly used product capability or operational workflow that supports normal customer use",
      },
      {
        score: 4,
        meaning:
          "Core product capability, high-use workflow, or important operational dependency",
      },
      {
        score: 5,
        meaning:
          "Essential business function where loss, compromise, or distrust would materially affect the company's ability to deliver the product or operate",
      },
    ],
  },
] as const;

export function getScoreMeaning(
  dimensionKey: DimensionKey,
  score: ScoreValue
): string | null {
  const dimension = DIMENSION_GUIDE.find((entry) => entry.key === dimensionKey);

  if (!dimension) {
    return null;
  }

  const match = dimension.anchors.find((anchor) => anchor.score === score);
  return match?.meaning ?? null;
}
