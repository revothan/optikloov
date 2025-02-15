import { formatCurrency } from "@/lib/format-utils";
import { describe, it, expect, vi } from 'vitest';

describe("formatCurrency", () => {
  it("formats a number as currency with default values", () => {
    expect(formatCurrency(1234.56)).toBe("Rp1.234");
  });

  it("formats a number as currency with custom currency and locale", () => {
    expect(formatCurrency(1234.56, "USD", "en-US")).toBe("$1,235");
  });

  it("handles zero values correctly", () => {
    expect(formatCurrency(0)).toBe("Rp0");
  });

  it("handles negative values correctly", () => {
    expect(formatCurrency(-1234.56)).toBe("-Rp1.235");
  });

  it("handles large numbers correctly", () => {
    expect(formatCurrency(1234567.89)).toBe("Rp1.234.568");
  });

  it("handles numbers with many decimal places by rounding", () => {
    expect(formatCurrency(1234.56789)).toBe("Rp1.235");
  });

  it("handles numbers close to zero correctly", () => {
    expect(formatCurrency(0.001)).toBe("Rp0");
  });

  it("handles NaN values by returning an empty string", () => {
    expect(formatCurrency(NaN)).toBe("Rp0");
  });

  it("handles Infinity values by returning an empty string", () => {
    expect(formatCurrency(Infinity)).toBe("Rp∞");
  });
});
