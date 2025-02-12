
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

  it('validates stock availability before submission', async () => {
    const { result } = renderHook(() => useInvoiceSubmission(), { wrapper });
    
    const mockItems = [{
      product_id: 'prod-1',
      quantity: 2,
      price: 100000,
      discount: 0,
    }];

    await expect(result.current.checkStockAvailability(mockItems, 'Gading Serpong'))
      .resolves.not.toThrow();
  });
});
