
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { mockSupabase } from "./supabase.mock";
import { vi } from "vitest";

// Create a mock date for testing
export const mockDateNow = (mockDate: string) => {
  const date = new Date(mockDate).getTime();
  vi.spyOn(Date, "now").mockImplementation(() => date);
};

// Create a mock product
export const mockProduct = {
  id: "prod-1",
  name: "Test Product",
  price: 500000,
  stock_qty: 10,
};

// Create a mock invoice
export const mockInvoice = {
  id: "inv-1",
  invoice_number: "INV/GS/202502/001",
  customer_name: "John Doe",
  total_amount: 1000000,
};

// Create a wrapper for rendering components with providers
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithProviders(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={mockSupabase}>
        {ui}
      </SessionContextProvider>
    </QueryClientProvider>
  );
}

