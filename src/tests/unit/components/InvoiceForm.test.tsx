import { render, screen, fireEvent, waitFor } from '../../setup/test-utils';
import { InvoiceForm } from '@/components/InvoiceForm';
import { vi } from 'vitest';
import { mockSupabase } from '../../setup/supabase.mock';
import { mockInvoice, mockProduct, mockDateNow } from '../../setup/test-utils';

describe('InvoiceForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDateNow('2025-02-10T12:00:00Z');
  });

  it('renders all required fields', () => {
    render(<InvoiceForm />);
    
    // Check for required form fields
    expect(screen.getByLabelText(/invoice number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sale date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/customer name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/payment type/i)).toBeInTheDocument();
  });




  it('validates required fields on submit', async () => {
    render(<InvoiceForm />);
    
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
    // Mock customer lookup
    mockSupabase.from().select().eq.mockResolvedValueOnce({
      data: [{
        name: 'John Doe',
        email: 'john@example.com',
        birth_date: '1990-01-01',
      }],
      error: null,
    });

    render(<InvoiceForm />);
    
    // Enter phone number
    const phoneInput = screen.getByLabelText(/phone/i);
    fireEvent.change(phoneInput, { target: { value: '1234567890' } });

    // Check if customer details are auto-filled
    await waitFor(() => {
      expect(screen.getByLabelText(/customer name/i)).toHaveValue('John Doe');
      expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
    });
  });

  it('calculates totals correctly when adding items', async () => {
    // Mock product lookup
    mockSupabase.from().select().eq.mockResolvedValueOnce({
      data: [mockProduct],
      error: null,
    });

    render(<InvoiceForm />);
    
    // Add an item
    fireEvent.click(screen.getByText(/add item/i));
    
    // Select product
    const productSelect = screen.getByRole('combobox');
    fireEvent.click(productSelect);
    fireEvent.click(screen.getByText(mockProduct.name));

    // Set quantity
    const quantityInput = screen.getByLabelText(/quantity/i);
    fireEvent.change(quantityInput, { target: { value: '2' } });

    // Check totals
    await waitFor(() => {
      expect(screen.getByText(/1,000,000/)).toBeInTheDocument(); // Total
      expect(screen.getByText(/0/)).toBeInTheDocument(); // Discount
      expect(screen.getByText(/1,000,000/)).toBeInTheDocument(); // Grand Total
    });
  });

  it('successfully submits form with valid data', async () => {
    const onSuccess = vi.fn();
    
    // Mock successful submission
    mockSupabase.from().insert.mockResolvedValueOnce({
      data: [mockInvoice],
      error: null,
    });

    render(<InvoiceForm onSuccess={onSuccess} />);

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
    // ... add item details

    // Submit form
    const submitButton = screen.getByRole('button', { name: /create invoice/i });
    fireEvent.click(submitButton);

    // Verify submission
    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      expect(mockSupabase.from().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          customer_name: 'John Doe',
          customer_phone: '1234567890',
          payment_type: 'Cash',
        })
      );
    });
  });
});
