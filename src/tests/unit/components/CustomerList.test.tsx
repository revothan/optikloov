
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CustomerTable from '@/components/CustomerList';
import { renderWithProviders } from '../../setup/test-utils';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe("CustomerList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters customers by search query", async () => {
    renderWithProviders(<CustomerTable />);

    const searchInput = screen.getByPlaceholderText(/search phone number/i);
    fireEvent.change(searchInput, { target: { value: "1234" } });

    await waitFor(() => {
      expect(screen.getByText("Filtered results")).toBeInTheDocument();
    });
  });
});
