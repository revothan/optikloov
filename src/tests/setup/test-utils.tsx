
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { mockSupabase } from "./supabase.mock";
import { vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";

// Create a mock date for testing
export const mockDateNow = (mockDate: string) => {
  const date = new Date(mockDate).getTime();
  vi.spyOn(Date, "now").mockImplementation(() => date);
};

// Create a mock product with UUID format
export const mockProduct = {
  id: "123e4567-e89b-12d3-a456-426614174000",
  name: "Test Product",
  price: 500000,
  stock_qty: 10,
};

// Create a mock invoice
export const mockInvoice = {
  id: "123e4567-e89b-12d3-a456-426614174001",
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

type WrapperProps = {
  children: React.ReactNode;
};

const Wrapper = ({ children }: WrapperProps) => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={mockSupabase as unknown as SupabaseClient}>
      {children}
    </SessionContextProvider>
  </QueryClientProvider>
);

export function renderWithProviders(ui: React.ReactElement) {
  return render(ui, { wrapper: Wrapper });
}

export { screen, fireEvent, waitFor };
