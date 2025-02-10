describe("CustomerList", () => {
  it("filters customers by search query", async () => {
    render(<CustomerList />);

    const searchInput = screen.getByPlaceholderText(/search phone number/i);
    fireEvent.change(searchInput, { target: { value: "1234" } });

    await waitFor(() => {
      expect(screen.getByText("Filtered results")).toBeInTheDocument();
    });
  });
});
