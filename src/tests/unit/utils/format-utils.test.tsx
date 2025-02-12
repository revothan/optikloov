
import { formatPrice } from '@/lib/utils';
import { format } from 'date-fns';
import { normalizeBranchName } from '@/lib/branch-utils';
import { generateInvoiceNumber } from '@/lib/invoice-utils';
import { mockSupabase } from '../../setup/supabase.mock';
import { vi, describe, it, expect } from 'vitest';

describe("formatPrice", () => {
  it("formats price in IDR currency format", () => {
    expect(formatPrice(1000000)).toBe("Rp 1.000.000");
    expect(formatPrice(500)).toBe("Rp 500");
    expect(formatPrice(0)).toBe("Rp 0");
  });

  it("handles null or undefined values", () => {
    expect(formatPrice(null)).toBe("Rp 0");
    expect(formatPrice(undefined)).toBe("Rp 0");
  });

  it("handles negative values", () => {
    expect(formatPrice(-1000)).toBe("-Rp 1.000");
  });
});

describe("formatDate", () => {
  it("formats dates in the specified format", () => {
    const date = new Date("2025-02-10T12:00:00Z");
    expect(format(date, "dd MMM yyyy")).toBe("10 Feb 2025");
    expect(format(date, "yyyy-MM-dd")).toBe("2025-02-10");
  });

  it("handles invalid dates", () => {
    const formatWithFallback = (date: any, formatStr: string) => {
      try {
        if (!date) return "-";
        const parsed = new Date(date);
        if (isNaN(parsed.getTime())) return "-";
        return format(parsed, formatStr);
      } catch {
        return "-";
      }
    };

    expect(formatWithFallback(null, "dd MMM yyyy")).toBe("-");
    expect(formatWithFallback(undefined, "dd MMM yyyy")).toBe("-");
    expect(formatWithFallback("invalid date", "dd MMM yyyy")).toBe("-");
  });
});

describe("normalizeBranchName", () => {
  it("normalizes branch names correctly", () => {
    expect(normalizeBranchName("gadingserpongbranch")).toBe("Gading Serpong");
    expect(normalizeBranchName("kelapaduabranch")).toBe("Kelapa Dua");
    expect(normalizeBranchName("Gading Serpong")).toBe("Gading Serpong");
  });
});

describe("generateInvoiceNumber", () => {
  const setupMockSupabase = (mockData: any[] = []) => ({
    ...mockSupabase,
    from: () => ({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: mockData, error: null })
          })
        })
      })
    })
  });

  it("generates invoice number with correct format", async () => {
    const mockSupabase = setupMockSupabase([{ invoice_number: "GS2502001" }]);
    const result = await generateInvoiceNumber("Gading Serpong", mockSupabase);
    expect(result).toBe("GS2502002");
  });

  it("handles first invoice of the month", async () => {
    const mockSupabase = setupMockSupabase([]);
    const result = await generateInvoiceNumber("Kelapa Dua", mockSupabase);
    expect(result).toBe("KD2502001");
  });

  it("handles database errors", async () => {
    const errorMock = setupMockSupabase();
    errorMock.from = () => ({
      select: () => Promise.reject(new Error("Database error")),
    });
    
    await expect(generateInvoiceNumber("Gading Serpong", errorMock))
      .rejects.toThrow();
  });

  it("pads sequence numbers correctly", async () => {
    const mockSupabase = setupMockSupabase([{ invoice_number: "GS2502099" }]);
    const result = await generateInvoiceNumber("Gading Serpong", mockSupabase);
    expect(result).toBe("GS2502100");
  });
});
