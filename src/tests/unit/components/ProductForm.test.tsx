
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ProductForm } from '@/components/ProductForm';
import { renderWithProviders } from '../../setup/test-utils';

describe("ProductForm", () => {
  it("handles image uploads correctly", async () => {
    renderWithProviders(<ProductForm />);

    const fileInput = screen.getByLabelText(/upload image/i);
    const file = new File(["(⌐□_□)"], "test.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });
  });
});

