import {
  formatPrice,
  formatDate,
  normalizeBranchName,
  generateInvoiceNumber,
} from "@/lib/utils";
import { vi } from "vitest";

describe("formatPrice", () => {
  it("formats price in IDR currency format", () => {
    expect(formatPrice(1000000)).toBe("Rp 1.000.000");
    expect(formatPrice(500)).toBe("Rp 500");
    expect(formatPrice(0)).toBe("Rp 0");
    expect(formatPrice(1234567.89)).toBe("Rp 1.234.568"); // Rounds to nearest integer
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

    expect(formatDate(date, "dd MMM yyyy")).toBe("10 Feb 2025");
    expect(formatDate(date, "yyyy-MM-dd")).toBe("2025-02-10");
    expect(formatDate(date, "HH:mm")).toBe("12:00");
  });

  it("handles invalid dates", () => {
    expect(formatDate(null, "dd MMM yyyy")).toBe("-");
    expect(formatDate(undefined, "dd MMM yyyy")).toBe("-");
    expect(formatDate("invalid date", "dd MMM yyyy")).toBe("-");
  });
});

describe("normalizeBranchName", () => {
  it("normalizes branch names correctly", () => {
    expect(normalizeBranchName("Gading Serpong")).toBe("GS");
    expect(normalizeBranchName("Kelapa Dua")).toBe("KD");
    expect(normalizeBranchName("GS")).toBe("GS");
    expect(normalizeBranchName("KD")).toBe("KD");
  });

  it("handles invalid branch names", () => {
    expect(() => normalizeBranchName("Invalid Branch")).toThrow();
    expect(() => normalizeBranchName("")).toThrow();
    expect(() => normalizeBranchName(null)).toThrow();
  });
});

describe("generateInvoiceNumber", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2025-02-10"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("generates invoice number with correct format", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [{ invoice_number: "GS/02/2025/0001" }],
        error: null,
      }),
    };

    const invoiceNumber = await generateInvoiceNumber(
      "Gading Serpong",
      mockSupabase,
    );

    expect(invoiceNumber).toBe("GS/02/2025/0002");
    expect(mockSupabase.from).toHaveBeenCalledWith("invoices");
  });

  it("handles first invoice of the month", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    };

    const invoiceNumber = await generateInvoiceNumber(
      "Kelapa Dua",
      mockSupabase,
    );

    expect(invoiceNumber).toBe("KD/02/2025/0001");
  });

  it("handles database errors", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockRejectedValue(new Error("Database error")),
    };

    await expect(
      generateInvoiceNumber("Gading Serpong", mockSupabase),
    ).rejects.toThrow("Failed to generate invoice number");
  });

  it("pads sequence numbers correctly", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [{ invoice_number: "GS/02/2025/0099" }],
        error: null,
      }),
    };

    const invoiceNumber = await generateInvoiceNumber(
      "Gading Serpong",
      mockSupabase,
    );

    expect(invoiceNumber).toBe("GS/02/2025/0100");
  });
});

// Additional utility specific tests
describe("customFormatters", () => {
  describe("formatPhoneNumber", () => {
    it("formats Indonesian phone numbers correctly", () => {
      expect(formatPhoneNumber("081234567890")).toBe("+62 812-3456-7890");
      expect(formatPhoneNumber("0812345678")).toBe("+62 812-345-678");
    });

    it("handles numbers with country code", () => {
      expect(formatPhoneNumber("+6281234567890")).toBe("+62 812-3456-7890");
      expect(formatPhoneNumber("6281234567890")).toBe("+62 812-3456-7890");
    });

    it("handles invalid phone numbers", () => {
      expect(formatPhoneNumber("invalid")).toBe("invalid");
      expect(formatPhoneNumber("")).toBe("");
      expect(formatPhoneNumber(null)).toBe("");
    });
  });
});

function formatPhoneNumber(phoneNumber: string | null): string {
  if (!phoneNumber) return "";

  // Remove any non-digit characters
  const numbers = phoneNumber.replace(/\D/g, "");

  // Handle empty string after removing non-digits
  if (!numbers) return phoneNumber || "";

  // Remove leading zeros or country code if present
  const cleanNumbers = numbers.replace(/^(0|62|\+62)/, "");

  // If the number is too short, return original
  if (cleanNumbers.length < 9) return phoneNumber;

  // Format the number
  const groups = cleanNumbers.match(/(\d{3})(\d{3,4})(\d{3,4})/);
  if (!groups) return phoneNumber;

  return `+62 ${groups[1]}-${groups[2]}-${groups[3]}`;
}
