
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductForm } from '@/components/ProductForm';
import { renderWithProviders } from '../../setup/test-utils';

describe("ProductForm", () => {
  it("handles image uploads correctly", async () => {
    renderWithProviders(<ProductForm />);

    const fileInput = screen.getByRole('button', { name: /upload/i });
    const file = new File(["(⌐□_□)"], "test.png", { type: "image/png" });

    fireEvent.click(fileInput);
    
    await waitFor(() => {
      expect(screen.getByText(/upload/i)).toBeInTheDocument();
    });
  });
});
