
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CustomerList } from '@/components/CustomerList';
import { renderWithProviders } from '../../setup/test-utils';
import { vi } from 'vitest';

describe("CustomerList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters customers by search query", async () => {
    renderWithProviders(<CustomerList />);

    const searchInput = screen.getByPlaceholderText(/search phone number/i);
    fireEvent.change(searchInput, { target: { value: "1234" } });

    await waitFor(() => {
      expect(screen.getByText("Filtered results")).toBeInTheDocument();
    });
  });
});

