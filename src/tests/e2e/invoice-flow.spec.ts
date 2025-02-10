
import { test, expect } from "@playwright/test";
import { mockDateNow } from "../setup/test-utils";

test.describe("Invoice flow", () => {
  test.beforeEach(async ({ page }) => {
    mockDateNow("2025-02-10T12:00:00Z");
    await page.goto("/login");
  });

  test("complete invoice creation flow", async ({ page }) => {
    // Login
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "testpassword");
    await page.click('button[type="submit"]');

    // Navigate to invoices
    await page.goto("/admin/invoices");

    // Click create new invoice
    await page.click("text=Buat Invoice Baru");

    // Fill customer details
    await page.fill('[name="customer_name"]', "Test Customer");
    await page.fill('[name="customer_phone"]', "081234567890");

    // Add item
    await page.click("text=Add Item");
    await page.click(".product-select >> text=Select product");
    await page.click("text=Test Product");

    // Fill item details
    await page.fill('[name="quantity"]', "1");
    await page.fill('[name="price"]', "100000");

    // Submit form
    await page.click('button[type="submit"]');

    // Verify success
    await expect(page.locator("text=Invoice created successfully")).toBeVisible();
  });

  test("invoice validation", async ({ page }) => {
    await page.goto("/admin/invoices");
    await page.click("text=Buat Invoice Baru");

    // Try to submit without required fields
    await page.click('button[type="submit"]');

    // Verify validation messages
    await expect(page.locator("text=Customer name is required")).toBeVisible();
    await expect(
      page.locator("text=At least one item is required"),
    ).toBeVisible();
  });
});
