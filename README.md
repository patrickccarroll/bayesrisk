# BayesRisk

**BayesRisk** is an application security remediation priority calculator designed to help teams prioritize code-level security findings using application context, not just scanner severity, CVSS scores, or generic exploit probability.

BayesRisk uses the **Bayes AppSec Priority Index**, a context-aware scoring methodology for determining which application security findings should be remediated first.

> Evidence-based AppSec remediation priority.

---

## Why BayesRisk Exists

I have recreated a similar scoring approach across numerous companies I have worked for and have yet to document the approach for re-use. I've also searched for a scoring methodology specifically tailored to SaaS AppSec teams and haven't found anything useful. Hence, this repo.

Application security teams often receive findings from static analysis, dynamic analysis, penetration tests, code reviews, dependency scanners, threat modeling, and manual security research.

Those findings are usually labeled with severities such as:

- Critical
- High
- Medium
- Low
- Informational

The problem is that those labels often do not fully answer the most important remediation question:

> Which finding should engineering fix first?

A vulnerability may look severe in isolation but have limited real-world impact because it is not reachable, requires privileged access, affects no sensitive data, or is already mitigated by strong compensating controls.

Another finding may look moderate on paper but could expose multi-tenant data, compromise authorization boundaries, or affect a critical business workflow.

BayesRisk exists to close that gap.

---

## What BayesRisk Measures

BayesRisk is focused on **application security remediation priority**.

It is designed for findings primarily in application code, including issues such as:

- Broken access control
- IDOR
- Injection flaws
- Insecure file handling
- Sensitive data exposure
- Authentication and authorization weaknesses
- Unsafe business logic
- Tenant isolation failures
- Insecure API behavior
- Application-layer privilege escalation
- Code paths that create confidentiality, integrity, or availability risk

BayesRisk is not intended to replace every vulnerability scoring system. Instead, it provides an AppSec-specific scoring method for deciding how urgently a finding should be fixed in the context of a real application.

---

## Bayes AppSec Priority Index

The **Bayes AppSec Priority Index** is the scoring model used by BayesRisk.

The index evaluates a finding across multiple dimensions that are relevant to application security remediation decisions.

Current scoring dimensions:

| Dimension | Purpose |
|---|---|
| Exploitability | How practical or difficult it is to exploit the issue |
| Required Access | Whether exploitation requires no access, normal user access, elevated access, or internal access |
| Reachability | Whether the vulnerable code path can actually be reached in the deployed application |
| Blast Radius | How broadly the impact could spread across users, tenants, systems, or workflows |
| Data Sensitivity | The sensitivity of the data that could be accessed, modified, disclosed, or destroyed |
| Integrity Impact | The degree to which the issue could allow unauthorized data or system modification |
| Availability Impact | The degree to which the issue could disrupt service availability |
| Detectability Gap | How difficult the issue would be to detect through logging, monitoring, alerting, or review |
| Compensating Controls | Whether other controls reduce the practical likelihood or impact of exploitation |
| Business Dependency | The degree to which the business depends on the affected component or workflow during normal operations, regardless of the specific vulnerability impact. |

---

## Detailed Scoring Explanations (Provided Rubric)

The following rubric captures score meanings provided for selected dimensions.

Note: most rows below use a **0-5** rubric as provided. `Detectability Gap` uses a **1-5** rubric to match the current calculator model.
In the web calculator, the same explanations are available at `/scoring-guide`.

| Dimension | Score | Meaning |
|---|---:|---|
| Exploitability | 0 | No known exploit path |
| Exploitability | 1 | Theoretical only |
| Exploitability | 2 | Requires unusual conditions or deep knowledge |
| Exploitability | 3 | Repeatable by authenticated user |
| Exploitability | 4 | Easy to exploit with basic technical skill |
| Exploitability | 5 | Trivially exploitable or automatable |
| Required Access | 0 | Internal engineering/admin-only access |
| Required Access | 1 | Support/admin role only |
| Required Access | 2 | Privileged customer user |
| Required Access | 3 | Any authenticated user |
| Required Access | 4 | Self-registered/free trial user |
| Required Access | 5 | Anonymous internet user |
| Reachability | 0 | Not present in deployed runtime path; dead code, test-only code, disabled feature, unreachable branch |
| Reachability | 1 | Only reachable through unusual configuration, legacy feature, rare edge case, or manually enabled feature flag |
| Reachability | 2 | Reachable through uncommon workflow, non-default setting, low-usage feature, or unusual data state |
| Reachability | 3 | Reachable through normal product workflow, but not a core or high-frequency path |
| Reachability | 4 | Reachable through common/core product workflow used regularly by customers |
| Reachability | 5 | Automatically or routinely reached by system behavior, background jobs, public APIs, login/session flows, imports, search, report generation, or other high-frequency paths |
| Blast Radius | 0 | No meaningful impact |
| Blast Radius | 1 | Single user |
| Blast Radius | 2 | Multiple users in same tenant |
| Blast Radius | 3 | Entire tenant |
| Blast Radius | 4 | Multiple tenants possible |
| Blast Radius | 5 | Platform-wide or systemic cross-tenant impact |
| Data Sensitivity | 0 | No data exposure |
| Data Sensitivity | 1 | Public/non-sensitive data |
| Data Sensitivity | 2 | Internal metadata |
| Data Sensitivity | 3 | Customer business data |
| Data Sensitivity | 4 | Confidential customer data, security logs, private files |
| Data Sensitivity | 5 | Secrets, credentials, regulated data, authentication material |
| Integrity Impact | 0 | No ability to modify data, state, configuration, permissions, workflows, or system behavior |
| Integrity Impact | 1 | Very limited modification of low-value personal/user-controlled fields with little or no downstream effect |
| Integrity Impact | 2 | Unauthorized modification of low-risk records, preferences, labels, comments, metadata, or non-critical workflow state |
| Integrity Impact | 3 | Unauthorized modification of meaningful business data, user-generated content, records, reports, or workflow outcomes within the attacker’s own tenant/context |
| Integrity Impact | 4 | Unauthorized modification of sensitive business data, security-relevant settings, permissions, audit-relevant records, or another user’s data within a tenant |
| Integrity Impact | 5 | Unauthorized modification across tenants, privilege/role manipulation, system configuration changes, tampering with audit/security records, or changes that compromise platform trust |
| Availability Impact | 0 | No realistic availability impact |
| Availability Impact | 1 | Minor inconvenience or temporary disruption to a single user session, request, or non-critical action |
| Availability Impact | 2 | Degradation of a limited feature, low-value workflow, or small number of users; easy recovery or self-correcting |
| Availability Impact | 3 | Meaningful disruption to a business workflow, tenant feature, background job, queue, report, import/export, or service dependency |
| Availability Impact | 4 | Significant outage or degradation for an entire tenant, major product area, shared service, or operational process |
| Availability Impact | 5 | Platform-wide outage, cross-tenant service degradation, resource exhaustion, persistent denial of service, or disruption requiring emergency operational response |
| Detectability Gap | 1 | Exploitation is likely detected quickly (strong logs + alerts) |
| Detectability Gap | 2 | Mostly detectable, but may require manual triage |
| Detectability Gap | 3 | Detectable with effort; correlation/forensics often needed |
| Detectability Gap | 4 | Hard to detect due to limited telemetry or weak alerting |
| Detectability Gap | 5 | Likely to go unnoticed for a long time (major detection blind spot) |
| Compensating Controls | 0 | No meaningful compensating controls |
| Compensating Controls | 1 | Partial logging or limited exposure |
| Compensating Controls | 2 | Role checks, feature flags, or rate limits reduce risk |
| Compensating Controls | 3 | Strong access controls or segmentation reduce practical exploitability |
| Compensating Controls | 4 | Multiple independent controls would likely block exploitation |
| Compensating Controls | 5 | Exploit is largely impractical due to strong controls |
| Business Dependency | 0 | Non-production, test-only, deprecated, unused, or no business dependency |
| Business Dependency | 1 | Low-use convenience feature with little business dependency |
| Business Dependency | 2 | Supporting feature used by some customers or internal teams, but not central to product delivery |
| Business Dependency | 3 | Regularly used product capability or operational workflow that supports normal customer use |
| Business Dependency | 4 | Core product capability, high-use workflow, or important operational dependency |
| Business Dependency | 5 | Essential business function where loss, compromise, or distrust would materially affect the company’s ability to deliver the product or operate |

---

## Current Scoring Formula

The current experimental model uses a weighted calculation.

```text
Raw Score =
  (Exploitability * 0.20) +
  (Required Access * 0.10) +
  (Reachability * 0.15) +
  (Blast Radius * 0.15) +
  (Data Sensitivity * 0.15) +
  (Integrity Impact * 0.10) +
  (Availability Impact * 0.05) +
  (Detectability Gap * 0.05) +
  (Compensating Controls * 0.10) +
  (Business Dependency * 0.15)
```

Each dimension is scored on a scale of **1 to 5**.

Because the current weights total **1.20**, the maximum raw score is:

```text
5 * 1.20 = 6.00
```

The normalized score converts the raw score to a 0–10 scale:

```text
Normalized Score = (Raw Score / 6.00) * 10
```

The normalized score is then mapped to a final severity or priority level.

---

## Score Ranges

The current recommended score bands are:

| Normalized Score | Priority | Meaning |
|---:|---|---|
| 0.0 – 3.9 | Low | Limited practical risk or low remediation urgency |
| 4.0 – 6.9 | Medium | Meaningful risk that should be planned and remediated |
| 7.0 – 8.9 | High | Significant application risk requiring prioritized remediation |
| 9.0 – 10.0 | Critical | Severe business or security risk requiring urgent remediation |

These bands should be calibrated over time based on real findings, engineering capacity, incident history, and organizational risk tolerance.

---

## How BayesRisk Differs from CVSS

CVSS is useful for describing the technical severity of a vulnerability in a standardized way.

It works well for many infrastructure, platform, library, and product vulnerabilities where the vulnerability can be described generically across many environments.

However, CVSS is often less useful for prioritizing custom application security findings because it does not fully capture application-specific context.

For example, CVSS may not adequately answer:

- Is the vulnerable code path actually reachable?
- Is the issue exposed in production?
- Does exploitation require a normal user account, privileged access, or internal access?
- Does the issue affect one user, one tenant, all tenants, or a critical shared service?
- What type of data is actually exposed?
- Are there compensating controls that materially reduce practical risk?
- Is the affected workflow business-critical?
- Would exploitation be detected quickly or remain invisible?

BayesRisk improves on this for AppSec use cases by making application context part of the score.

### CVSS vs. BayesRisk

| Area | CVSS | BayesRisk |
|---|---|---|
| Primary purpose | Technical vulnerability severity | Application remediation priority |
| Best suited for | Generic vulnerabilities, components, products, infrastructure | Application code findings |
| Context awareness | Limited | Core part of the model |
| Reachability | Not deeply modeled for custom code paths | Explicit scoring dimension |
| Business dependency | Limited | Explicit scoring dimension |
| Tenant or blast radius context | Indirect | Explicit scoring dimension |
| Compensating controls | Limited | Explicit scoring dimension |
| Output | Severity score | Remediation priority score |

BayesRisk is not intended to argue that CVSS is wrong. Instead, it treats CVSS as one useful input while recognizing that AppSec remediation decisions need more context.

---

## How BayesRisk Differs from EPSS

EPSS estimates the probability that a vulnerability will be exploited in the wild.

That is useful when deciding which known vulnerabilities are more likely to be exploited broadly, especially for published CVEs.

However, EPSS is less useful for many custom application security findings because those findings may not have a CVE, may not be publicly known, and may only exist in one organization’s application.

EPSS may help answer:

> How likely is this known vulnerability to be exploited in the wild?

BayesRisk is designed to answer:

> Given this specific finding in this specific application, how urgently should we fix it?

### EPSS vs. BayesRisk

| Area | EPSS | BayesRisk |
|---|---|---|
| Primary purpose | Exploitation probability prediction | Remediation prioritization |
| Best suited for | Publicly known vulnerabilities, usually CVEs | AppSec findings |
| Requires public exploit trend data | Yes | No |
| Works for internal code findings | Usually not directly | Yes |
| Considers business context | No | Yes |
| Considers application reachability | No | Yes |
| Considers data sensitivity | No | Yes |
| Output | Probability of exploitation | Context-aware priority score |

BayesRisk does not replace EPSS. EPSS can still be useful when a finding relates to a known CVE or third-party component. BayesRisk is intended to handle the additional context needed for custom application remediation decisions.

---

## Example Findings

### Example 1: Finding with Limited Practical Impact

A SAST scanner identifies a potentially unsafe function, but the code path is not reachable from production routes, does not process sensitive data, and would require privileged internal access to trigger.

This may score low or medium in BayesRisk, even if the scanner initially labels it high.

Reasoning:

- Low reachability
- High required access
- Limited blast radius
- Limited data sensitivity
- Existing compensating controls

BayesRisk helps avoid over-prioritizing findings that are technically valid but not **practically** urgent.

---

### Example 2: Multi-Tenant Data Exposure

A broken access control issue allows an authenticated user from one tenant to access records belonging to another tenant.

This would likely score high or critical.

Reasoning:

- Exploitable by a normal authenticated user
- Reachable in production
- High blast radius
- High data sensitivity
- High integrity and confidentiality impact
- Significant business impact
- Potentially difficult to detect without strong tenant-aware monitoring

BayesRisk helps elevate findings that create real business and customer risk, even if a generic scoring model does not fully capture the application context.

---

## Intended Use

BayesRisk can be used by:

- Application security teams
- Security engineers
- Product security teams
- Engineering managers
- Security champions
- Developers triaging security findings
- Organizations building internal vulnerability management workflows

Common use cases:

- Prioritizing AppSec scanner findings
- Normalizing penetration test results
- Ranking manual code review findings
- Supporting remediation SLAs
- Explaining remediation priority to engineering teams
- Comparing findings across applications or services
- Distinguishing theoretical severity from practical risk

---

## What BayesRisk Is Not

BayesRisk is not:

- A replacement for CVSS
- A replacement for EPSS
- A replacement for threat modeling
- A guarantee that a finding will or will not be exploited
- A substitute for human security judgment

---

## Project Philosophy

BayesRisk is based on the following assumptions:
  - Application security teams have more findings than resources to remediate.
  - SaaS providers have shared context not considered in traditional scoring methods.
  - Application security prioritization should be evidence-based.

A finding should not be prioritized only because a scanner, or penetration test report labeled as a high.

Priority should be adjusted based on additional evidence, including:

- Where the issue exists
- Whether the code path is reachable
- Who can exploit it
- What data is affected
- What business process is affected
- How broad the impact could be
- Whether existing controls reduce risk
- Whether exploitation would likely be detected

This is the reasoning behind the name **BayesRisk**.

The name references Thomas Bayes and Bayesian reasoning: as more evidence becomes available, the assessment should become more accurate.

---

## Status

BayesRisk and the Bayes AppSec Priority Index are currently experimental.

The scoring dimensions, weights, and severity bands should be tested against real-world findings and adjusted over time.

Planned improvements may include:

- More formal scoring rubrics for each dimension
- Example scoring guidance
- Calibration against historical AppSec findings
- Support for custom organizational weighting
- Exportable scoring worksheets
- JSON schema support
- CLI or web-based calculator

---

## GitHub Pages Deployment

This repository is configured for GitHub Pages project-site hosting at:

`https://<user>.github.io/bayesrisk/`

Deployment behavior:

- The Next.js app in `calculator/` builds as a static export (`out/`).
- The workflow in `.github/workflows/deploy-pages.yml` deploys on pushes to `main`.
- `calculator/next.config.mjs` sets a CI-only `basePath` from `GITHUB_REPOSITORY`, so links/assets resolve under `/bayesrisk/` on Pages.
- Local development remains unchanged (`npm run dev` in `calculator/` uses root-path URLs).

To enable Pages deployment:

1. Push this repository to GitHub.
2. In repository settings, open **Pages** and set source to **GitHub Actions**.
3. Push to `main` (or run the workflow manually via **Actions** -> **Deploy BayesRisk to GitHub Pages**).

---

## Contributing

Contributions are welcome once the initial methodology is published.

Useful contribution areas include:

- Scoring rubric improvements suggestions
- Example findings
- Weight calibration suggestions
