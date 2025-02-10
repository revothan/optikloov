import { render, screen, fireEvent, waitFor } from "../../../setup/test-utils";
import { CustomerList } from "@/components/CustomerList";
import { vi } from "vitest";

describe("CustomerList", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("filters customers by search query", async () => {
    render(<CustomerList />);

    const searchInput = screen.getByPlaceholderText(/search phone number/i);
    fireEvent.change(searchInput, { target: { value: "1234" } });

    await waitFor(() => {
      expect(screen.getByText("Filtered results")).toBeInTheDocument();
    });
  });
});
