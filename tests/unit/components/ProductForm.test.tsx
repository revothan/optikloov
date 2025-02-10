describe("ProductForm", () => {
  it("handles image uploads correctly", async () => {
    render(<ProductForm />);

    const fileInput = screen.getByLabelText(/upload image/i);
    const file = new File(["(⌐□_□)"], "test.png", { type: "image/png" });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByAltText("Preview")).toBeInTheDocument();
    });
  });
});
