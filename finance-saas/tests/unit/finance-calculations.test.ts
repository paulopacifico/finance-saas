import { describe, expect, it } from "vitest";

import {
  convertCurrency,
  netBalanceCad,
  roundCad,
  sumCad,
} from "../../lib/finance/calculations";

describe("finance calculations", () => {
  it("rounds CAD values to 2 decimals", () => {
    expect(roundCad(12.345)).toBe(12.35);
    expect(roundCad("12.344")).toBe(12.34);
  });

  it("sums monetary values accurately in CAD", () => {
    expect(sumCad([10.1, "20.2", 30.33])).toBe(60.63);
  });

  it("computes net balance from income and expenses", () => {
    expect(netBalanceCad([1000, 250.75], [100, 40.25, 10])).toBe(1100.5);
  });

  it("converts CAD to another currency with configurable decimals", () => {
    expect(convertCurrency(100, 0.7344)).toBe(73.44);
    expect(convertCurrency("99.99", "1.2", 3)).toBe(119.988);
  });

  it("throws for invalid monetary values", () => {
    expect(() => sumCad([10, Number.NaN])).toThrow("Invalid monetary value");
  });
});
