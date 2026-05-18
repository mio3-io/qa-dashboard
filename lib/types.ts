export type Status = "passed" | "failed" | "skipped" | "undefined";

export interface Step {
  keyword: string;        // "Given" | "When" | "Then" | "And" | "But"
  text: string;
  status: Status;
  duration: number;
  screenshot: string | null;
}

export type Color = "violet" | "emerald" | "rose" | "amber" | "cyan" | "sky";

export interface Scenario {
  name: string;
  status: Status;
  duration: number;
  tags: string[];
  failureMessage: string | null;
  screenshot: string | null;
  steps: Step[];
}

export interface Feature {
  name: string;
  slug: string;
  tests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  tags: string[];
  scenarios: Scenario[];
}

export interface TagBucket {
  tag: string;
  passed: number;
  failed: number;
  skipped: number;
}

export interface ScreenshotEntry {
  scenario: string;
  feature: string;
  path: string;
  tags: string[];
}

export interface RunSummary {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
  passRate: number;
}

export interface Suite {
  id: string;
  name: string;
  repo: string;
  runId: string;
  commit: string;
  commitShort: string;
  branch: string;
  runUrl: string;
  timestamp: string;
  summary: RunSummary;
  features: Feature[];
  tags: TagBucket[];
  screenshots: ScreenshotEntry[];
}

export interface AggregateRun {
  generatedAt: string;
  aggregate: RunSummary;
  suites: Suite[];
}

export interface HistoryFeature {
  name: string;
  status: Status;
  tests: number;
  passed: number;
  failed: number;
  skipped: number;
  duration: number;
}

export interface HistoryEntry {
  timestamp: string;
  aggregate: RunSummary;
  suites: {
    id: string;
    name: string;
    summary: RunSummary;
    commit: string;
    branch: string;
    features?: HistoryFeature[];
  }[];
}

export interface SuiteSource {
  id: string;
  name: string;
  color: Color;
  repo: string;
  workflow: string;
  branch: string;
}
