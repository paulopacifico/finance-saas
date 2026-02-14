import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (relativePath: string) =>
  readFileSync(join(process.cwd(), relativePath), "utf8");

describe("data access guardrails", () => {
  it("scopes critical Prisma reads by userId", () => {
    const actions = read("app/actions/finance.ts");
    const dataLayer = read("lib/data/finance.ts");

    expect(actions).toMatch(/prisma\.account\.findFirst\(\{\s*where:\s*\{[^}]*userId/);
    expect(actions).toMatch(/prisma\.category\.findFirst\(\{\s*where:\s*\{[^}]*userId/);
    expect(dataLayer).toMatch(/prisma\.transaction\.findMany\(\{\s*where:\s*\{[^}]*userId/);
  });

  it("uses tenant-scoped where clause for category updates", () => {
    const actions = read("app/actions/finance.ts");

    expect(actions).toMatch(/prisma\.category\.updateMany\(\{\s*where:\s*\{[^}]*userId/);
  });
});
