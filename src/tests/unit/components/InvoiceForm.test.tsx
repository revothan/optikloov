import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { InvoiceForm } from '@/components/InvoiceForm';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { mockSupabase } from '../../setup/supabase.mock';
import { mockInvoice, mockProduct, mockDateNow, renderWithProviders } from '../../setup/test-utils';

describe('InvoiceForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDateNow('2025-02-10T12:00:00Z');

    // Update mock implementation
    vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      range: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
    }));
  });

  it('renders all required fields', () => {
    renderWithProviders(<InvoiceForm />);
    
    // Check for required form fields
    expect(screen.getByLabelText(/invoice number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sale date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/payment type/i)).toBeInTheDocument();
  });

  it('validates required fields on submit', async () => {
    renderWithProviders(<InvoiceForm />);
    
    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /create invoice/i });
    fireEvent.click(submitButton);

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/customer name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/payment type is required/i)).toBeInTheDocument();
    });
  });

  it('auto-fills customer details when phone number is entered', async () => {
    vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: [{
          name: 'John Doe',
          email: 'john@example.com',
          birth_date: '1990-01-01',
        }],
        error: null,
      }),
    }));

    renderWithProviders(<InvoiceForm />);
    
    // Enter phone number
    const phoneInput = screen.getByLabelText(/phone/i);
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    // Check if customer details are auto-filled
    await waitFor(() => {
      expect(screen.getByLabelText(/customer name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    });
  });

  it('successfully submits form with valid data', async () => {
    const onSuccess = vi.fn();
    
    vi.spyOn(mockSupabase, 'from').mockImplementation(() => ({
      insert: vi.fn().mockResolvedValue({
        data: [mockInvoice],
        error: null,
      }),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockResolvedValue({
        data: null,
        error: null,
      }),
    }));

    renderWithProviders(<InvoiceForm onSuccess={onSuccess} />);

    // Fill form
    fireEvent.change(screen.getByLabelText(/customer name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/phone/i), {
      target: { value: '1234567890' }
    });
    
    // Select payment type
    const paymentSelect = screen.getByLabelText(/payment type/i);
    fireEvent.change(paymentSelect, { target: { value: 'Cash' } });

    // Add item
    fireEvent.click(screen.getByText(/add item/i));

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create invoice/i });
    fireEvent.click(submitButton);

    // Verify submission
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });
});
