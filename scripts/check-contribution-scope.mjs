#!/usr/bin/env node

import { execSync } from "node:child_process";

const strictMode =
  process.env.CONTRIBUTION_SCOPE_STRICT === "1" || process.argv.includes("--strict");

const allowedExactFiles = new Set([
  "lib/resources.ts",
  "README.md",
  "CONTRIBUTING.md",
  "AGENTS.md",
  "ARCHITECTURE.md",
  ".github/pull_request_template.md",
]);

const allowedPrefixes = [
  "specs/001-open-source-devia-observatory/",
  "specs/002-watch-source-ingestion/",
];

const protectedPrefixes = [
  "app/",
  "components/",
  "core/",
  "content/",
  "lib/modules.ts",
  "package.json",
  "package-lock.json",
  ".github/workflows/",
  "scripts/",
];

function run(command) {
  return execSync(command, { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
}

function changedFilesFromGit() {
  const explicitFiles = process.argv.slice(2).filter((arg) => arg !== "--strict");
  if (explicitFiles.length > 0) {
    return explicitFiles;
  }

  const baseRef = process.env.GITHUB_BASE_REF;
  if (baseRef) {
    try {
      return run(`git diff --name-only origin/${baseRef}...HEAD`).split("\n").filter(Boolean);
    } catch {
      return run("git diff --name-only HEAD~1...HEAD").split("\n").filter(Boolean);
    }
  }

  const staged = run("git diff --name-only --cached");
  if (staged) return staged.split("\n").filter(Boolean);

  const workingTree = run("git diff --name-only HEAD");
  return workingTree ? workingTree.split("\n").filter(Boolean) : [];
}

function isAllowed(file) {
  return allowedExactFiles.has(file) || allowedPrefixes.some((prefix) => file.startsWith(prefix));
}

function isProtected(file) {
  return protectedPrefixes.some((prefix) => file === prefix || file.startsWith(prefix));
}

const changedFiles = changedFilesFromGit();
const isResourceContribution = changedFiles.includes("lib/resources.ts");

if (!isResourceContribution) {
  console.log("No lib/resources.ts change detected; contribution scope guard skipped.");
  process.exit(0);
}

const disallowedFiles = changedFiles.filter((file) => !isAllowed(file) && isProtected(file));

if (disallowedFiles.length === 0) {
  console.log("Contribution scope guard passed.");
  process.exit(0);
}

const summary =
  "This PR edits lib/resources.ts, so it is treated as a watch/resource contribution. " +
  "Resource contribution PRs should avoid editing UI, architecture, content dossiers, scripts or package files.";

if (process.env.GITHUB_ACTIONS === "true") {
  console.log(
    `::warning title=Contribution scope::${summary} Disallowed files: ${disallowedFiles.join(", ")}`,
  );
}

console.warn(strictMode ? "Contribution scope guard failed." : "Contribution scope warning.");
console.warn("");
console.warn(summary);
console.warn("");
console.warn("Disallowed files:");
for (const file of disallowedFiles) {
  console.warn(`- ${file}`);
}
console.warn("");
console.warn("Allowed files for a resource contribution:");
for (const file of allowedExactFiles) {
  console.warn(`- ${file}`);
}
for (const prefix of allowedPrefixes) {
  console.warn(`- ${prefix}**`);
}
console.warn("");
console.warn("If this is intentionally an architecture/UI PR, split the resource changes into a separate PR.");

process.exit(strictMode ? 1 : 0);
