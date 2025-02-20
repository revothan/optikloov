
import { formatPrice } from "@/lib/utils";
import { describe, it, expect } from 'vitest';

describe("formatPrice", () => {
  it("formats a number as currency with default values", () => {
    expect(formatPrice(1234.56)).toBe("Rp1.234");
  });

  it("handles zero values correctly", () => {
    expect(formatPrice(0)).toBe("Rp0");
  });

  it("handles negative values correctly", () => {
    expect(formatPrice(-1234.56)).toBe("-Rp1.235");
  });

  it("handles large numbers correctly", () => {
    expect(formatPrice(1234567.89)).toBe("Rp1.234.568");
  });

  it("handles numbers with many decimal places by rounding", () => {
    expect(formatPrice(1234.56789)).toBe("Rp1.235");
  });

  it("handles numbers close to zero correctly", () => {
    expect(formatPrice(0.001)).toBe("Rp0");
  });

  it("handles NaN values by returning zero", () => {
    expect(formatPrice(NaN)).toBe("Rp0");
  });

  it("handles Infinity values appropriately", () => {
    expect(formatPrice(Infinity)).toBe("Rp∞");
  });
});
