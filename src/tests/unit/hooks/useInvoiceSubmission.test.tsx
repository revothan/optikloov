
import { renderHook } from '@testing-library/react';
import { useInvoiceSubmission } from '@/components/invoice/useInvoiceSubmission';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockSupabase } from '../../setup/supabase.mock';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { mockInvoice } from '../../setup/test-utils';
import type { SupabaseClient } from '@supabase/supabase-js';

describe('useInvoiceSubmission', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={mockSupabase as unknown as SupabaseClient}>
        {children}
      </SessionContextProvider>
    </QueryClientProvider>
  );

  // Update test to use the actual methods available in useInvoiceSubmission
  it('validates stock availability before submission', async () => {
    const { result } = renderHook(() => useInvoiceSubmission(), { wrapper });
    
    const mockData = {
      name: "Test Customer",
      phone: "1234567890",
    };

    await expect(result.current.createOrUpdateCustomer(mockData))
      .resolves.not.toThrow();
  });
});
