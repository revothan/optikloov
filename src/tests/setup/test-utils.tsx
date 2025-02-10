import React from "react";
import { render } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

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
      <SessionContextProvider supabaseClient={supabase}>
        {ui}
      </SessionContextProvider>
    </QueryClientProvider>,
  );
}

// src/tests/setup/jest.setup.ts
import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock Supabase
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        subscription: { unsubscribe: vi.fn() },
      })),
    },
    storage: {
      from: vi.fn(),
    },
    from: vi.fn(),
  },
}));

// Mock PDF generation
vi.mock("@react-pdf/renderer", () => ({
  Document: vi.fn(),
  Page: vi.fn(),
  Text: vi.fn(),
  View: vi.fn(),
  StyleSheet: {
    create: vi.fn(),
  },
  pdf: vi.fn(),
}));
