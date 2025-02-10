import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { mockSupabase } from "./supabase.mock";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={mockSupabase}>
        {children}
      </SessionContextProvider>
    </QueryClientProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">,
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from "@testing-library/react";
export { customRender as render };

// Common test data
export const mockInvoice = {
  id: "123",
  invoice_number: "INV-001",
  customer_name: "John Doe",
  total_amount: 1000000,
  // ... other fields
};

export const mockProduct = {
  id: "456",
  name: "Test Frame",
  brand: "Test Brand",
  category: "Frame",
  store_price: 500000,
  // ... other fields
};

// Common test utilities
export const mockDateNow = (isoDate: string) => {
  const now = new Date(isoDate).getTime();
  vi.spyOn(Date, "now").mockImplementation(() => now);
};

export const waitForSupabaseQuery = async () => {
  await new Promise((resolve) => setTimeout(resolve, 0));
};
