import { test, expect } from "@playwright/test";

test.describe("Invoice Creation Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[type="email"]', "test@example.com");
    await page.fill('input[type="password"]', "password");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/admin/invoices");
  });

  test("creates a new invoice", async ({ page }) => {
    // Click create invoice button
    await page.click("text=Buat Invoice Baru");

    // Fill customer details
    await page.fill('input[name="customer_name"]', "John Doe");
    await page.fill('input[name="customer_phone"]', "1234567890");

    // Add product
    await page.click("text=Add Item");
    await page.click('[role="combobox"]');
    await page.click("text=Test Product");

    // Set quantity
    await page.fill('input[name="quantity"]', "2");

    // Submit form
    await page.click("text=Create Invoice");

    // Verify success
    await expect(
      page.locator("text=Invoice created successfully"),
    ).toBeVisible();

    // Verify invoice appears in list
    await expect(page.locator("text=John Doe")).toBeVisible();
  });

  test("prints invoice and generates PDF", async ({ page }) => {
    // Find first invoice
    await page.click('tr:first-child button[aria-label="Actions"]');

    // Click print
    await page.click("text=Print");

    // Verify PDF download
    const download = await Promise.all([
      page.waitForEvent("download"),
      page.click("text=Download PDF"),
    ]);

    expect(download[0].suggestedFilename()).toMatch(/invoice-.*\.pdf$/);
  });
});

// tests/e2e/stock-management.spec.ts
test.describe("Stock Management", () => {
  test("manages product stock levels", async ({ page }) => {
    await page.goto("/admin/products");

    // Add new product
    await page.click("text=Add Product");
    await page.fill('input[name="name"]', "Test Frame");
    await page.fill('input[name="stock_qty"]', "10");
    await page.click("text=Save Product");

    // Verify stock level appears
    await expect(page.locator("text=10")).toBeVisible();

    // Update stock
    await page.click("text=Edit");
    await page.fill('input[name="stock_qty"]', "15");
    await page.click("text=Save Changes");

    // Verify updated stock
    await expect(page.locator("text=15")).toBeVisible();
  });
});

// tests/e2e/sales-report.spec.ts
test.describe("Sales Reporting", () => {
  test("generates sales report", async ({ page }) => {
    await page.goto("/admin/sales");

    // Select date range
    await page.click("text=Select date range");
    await page.click("text=This Month");

    // Wait for report to load
    await expect(page.locator("text=Total Sales")).toBeVisible();

    // Export report
    const download = await Promise.all([
      page.waitForEvent("download"),
      page.click("text=Export Report"),
    ]);

    expect(download[0].suggestedFilename()).toMatch(/sales-report.*\.xlsx$/);
  });
});
