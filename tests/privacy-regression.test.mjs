import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  ".."
);

const binaryExtensions = new Set([
  ".ico",
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".woff",
  ".woff2",
  ".pdf",
]);

const rules = [
  {
    name: "email address",
    re: /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  },
  {
    name: "github noreply identity",
    re: /users\.noreply\.github\.com/i,
  },
  {
    name: "machine-local mailbox",
    re: /@[A-Z0-9.-]+\.local\b/i,
  },
  {
    name: "phone number",
    re: /(?:\+?\d{1,3}[\s.-])?(?:\(?\d{3}\)?[\s.-])\d{3}[\s.-]\d{4}\b/,
  },
  {
    name: "private key material",
    re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  },
  {
    name: "cloud access key id",
    re: /\bAKIA[0-9A-Z]{16}\b/,
  },
  {
    name: "home directory path",
    re: /(?:\/Users\/[A-Za-z0-9._-]+|[A-Za-z]:\\Users\\[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+)/,
  },
  {
    name: "first-person autobiographical statement",
    re: /\bI(?:'ve|\u2019ve| have| had| am| was| work(?:ed)?)\b/,
  },
];

const ignoredPaths = [
  ".env",
  ".env.local",
  "calculator/.env.local",
  "runtime.private.json",
  "calculator/settings.runtime.json",
  "private-data/example.json",
  "calculator/private-data/example.json",
];

function trackedFiles() {
  return execFileSync("git", ["ls-files", "-z"], {
    cwd: repoRoot,
    encoding: "utf8",
  })
    .split("\0")
    .filter(Boolean);
}

function isBinary(relativePath, bytes) {
  const extension = path.extname(relativePath).toLowerCase();
  return binaryExtensions.has(extension) || bytes.includes(0);
}

test("rules detect synthetic private fixtures", () => {
  const fixtures = [
    ["ada@", "example.com"].join(""),
    ["I", " have worked"].join(""),
    ["/home/", "person"].join(""),
  ];

  for (const fixture of fixtures) {
    assert.ok(rules.some((rule) => rule.re.test(fixture)));
  }
});

test("tracked files do not contain owner contact data or autobiographical phrasing", () => {
  const findings = [];

  for (const relativePath of trackedFiles()) {
    const absolutePath = path.join(repoRoot, relativePath);
    const bytes = fs.readFileSync(absolutePath);

    if (isBinary(relativePath, bytes)) {
      continue;
    }

    const lines = bytes.toString("utf8").split(/\r?\n/);

    lines.forEach((line, index) => {
      for (const rule of rules) {
        if (rule.re.test(line)) {
          findings.push(`${relativePath}:${index + 1} ${rule.name}`);
        }
      }
    });
  }

  assert.deepEqual(findings, []);
});

test("private runtime inputs are ignored by git", () => {
  for (const relativePath of ignoredPaths) {
    execFileSync("git", ["check-ignore", "-q", "--", relativePath], {
      cwd: repoRoot,
    });
  }
});
