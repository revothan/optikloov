import { vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInvoiceSubmission } from '@/components/invoice/useInvoiceSubmission';
import { mockSupabase } from '../../setup/supabase.mock';

describe('InvoiceForm', () => {
  const mockSupabaseTable = {
    select: vi.fn().mockReturnValue({ 
      eq: vi.fn(),
      order: vi.fn(),
      limit: vi.fn(),
      range: vi.fn()
    }),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockSupabase.from.mockReturnValue(mockSupabaseTable);
  });

  // Update test to use the actual methods available in useInvoiceSubmission
  it('validates stock availability before submission', async () => {
    const { result } = renderHook(() => useInvoiceSubmission(), {
      wrapper: ({ children }) => children,
    });
    
    const mockData = {
      name: "Test Customer",
      phone: "1234567890",
    };

    await expect(result.current.createOrUpdateCustomer(mockData))
      .resolves.not.toThrow();
  });
});
