import { renderHook, act } from "@testing-library/react";
import { useInvoiceSubmission } from "@/hooks/useInvoiceSubmission";
import { vi } from "vitest";
import { mockSupabase } from "../../setup/supabase.mock";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";

// Mock data
const mockFormData = {
  invoice_number: "INV-001",
  sale_date: "2025-02-10",
  customer_name: "John Doe",
  customer_phone: "1234567890",
  payment_type: "Cash",
  branch: "Gading Serpong",
  items: [
    {
      product_id: "prod-1",
      quantity: 2,
      price: 500000,
      discount: 0,
      lens_stock_id: null,
    },
  ],
};

const mockTotals = {
  totalAmount: 1000000,
  discountAmount: 0,
  grandTotal: 1000000,
  downPayment: 500000,
  remainingBalance: 500000,
};

describe("useInvoiceSubmission", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={mockSupabase}>
        {children}
      </SessionContextProvider>
    </QueryClientProvider>
  );

  it("validates stock availability before submission", async () => {
    // Mock stock check query
    mockSupabase.from().select.mockResolvedValueOnce({
      data: [{ id: "prod-1", stock_qty: 5, track_inventory: true }],
      error: null,
    });

    const { result } = renderHook(() => useInvoiceSubmission(), { wrapper });

    await act(async () => {
      await result.current.checkStockAvailability(
        mockFormData.items,
        mockFormData.branch,
      );
    });

    expect(mockSupabase.from).toHaveBeenCalledWith("products");
    expect(mockSupabase.from().select).toHaveBeenCalled();
  });

  it("throws error when stock is insufficient", async () => {
    // Mock insufficient stock
    mockSupabase.from().select.mockResolvedValueOnce({
      data: [{ id: "prod-1", stock_qty: 1, track_inventory: true }],
      error: null,
    });

    const { result } = renderHook(() => useInvoiceSubmission(), { wrapper });

    await expect(
      act(async () => {
        await result.current.checkStockAvailability(
          mockFormData.items,
          mockFormData.branch,
        );
      }),
    ).rejects.toThrow("Insufficient stock");
  });

  it("updates product stock after successful submission", async () => {
    // Mock successful stock updates
    mockSupabase.from().select.mockResolvedValueOnce({
      data: [{ id: "prod-1", stock_qty: 5, track_inventory: true }],
      error: null,
    });
    mockSupabase.from().update.mockResolvedValueOnce({
      data: [{ id: "prod-1", stock_qty: 3 }],
      error: null,
    });

    const { result } = renderHook(() => useInvoiceSubmission(), { wrapper });

    await act(async () => {
      await result.current.updateProductStock(
        mockFormData.items,
        mockFormData.branch,
      );
    });

    expect(mockSupabase.from().update).toHaveBeenCalledWith(
      expect.objectContaining({
        stock_qty: 3,
      }),
    );
  });

  it("successfully submits invoice with all related records", async () => {
    const onSuccess = vi.fn();

    // Mock all required queries
    mockSupabase.from().select.mockResolvedValueOnce({
      data: [{ id: "prod-1", stock_qty: 5, track_inventory: true }],
      error: null,
    });
    mockSupabase.from().insert.mockResolvedValueOnce({
      data: [{ id: "inv-1", ...mockFormData }],
      error: null,
    });

    const { result } = renderHook(() => useInvoiceSubmission(onSuccess), {
      wrapper,
    });

    await act(async () => {
      await result.current.submitInvoice(mockFormData, mockTotals);
    });

    // Verify invoice creation
    expect(mockSupabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({
        invoice_number: mockFormData.invoice_number,
        customer_name: mockFormData.customer_name,
        total_amount: mockTotals.totalAmount,
      }),
    );

    // Verify stock update
    expect(mockSupabase.from().update).toHaveBeenCalled();

    // Verify payment record creation
    expect(mockSupabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: mockTotals.downPayment,
        payment_type: mockFormData.payment_type,
      }),
    );

    // Verify success callback
    expect(onSuccess).toHaveBeenCalled();
  });

  it("handles submission errors appropriately", async () => {
    // Mock error during submission
    mockSupabase
      .from()
      .insert.mockRejectedValueOnce(new Error("Database error"));

    const { result } = renderHook(() => useInvoiceSubmission(), { wrapper });

    await act(async () => {
      const success = await result.current.submitInvoice(
        mockFormData,
        mockTotals,
      );
      expect(success).toBe(false);
    });
  });

  it("updates lens stock when lens items are present", async () => {
    const mockLensFormData = {
      ...mockFormData,
      items: [
        {
          ...mockFormData.items[0],
          lens_stock_id: "lens-1",
        },
      ],
    };

    // Mock lens stock queries
    mockSupabase.from().select.mockResolvedValueOnce({
      data: [{ id: "lens-1", quantity: 10 }],
      error: null,
    });

    const { result } = renderHook(() => useInvoiceSubmission(), { wrapper });

    await act(async () => {
      await result.current.updateLensStock(
        mockLensFormData.items,
        "inv-1",
        mockFormData.branch,
      );
    });

    // Verify lens stock update
    expect(mockSupabase.from().update).toHaveBeenCalledWith(
      expect.objectContaining({
        quantity: 8, // 10 - 2 (quantity from form)
      }),
    );

    // Verify stock movement record
    expect(mockSupabase.from().insert).toHaveBeenCalledWith(
      expect.objectContaining({
        lens_stock_id: "lens-1",
        movement_type: "sale",
        quantity: -2,
      }),
    );
  });
});
