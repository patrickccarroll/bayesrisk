"use client";

import dynamic from "next/dynamic";

const BayesRiskCalculator = dynamic(
  () => import("@/components/bayesrisk-calculator"),
  { ssr: false }
);

export default function ClientOnlyCalculator() {
  return <BayesRiskCalculator />;
}
