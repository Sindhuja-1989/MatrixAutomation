import { Locator, Page, expect } from '@playwright/test';

export class CreatePurchaseOrderPage {

  readonly page: Page;

  readonly pageTitle: Locator;

  readonly warehouseField: Locator;

  readonly supplierDropdown: Locator;

  readonly supplierOptions: Locator;

  readonly calendarButton: Locator;
  readonly fetchSuggestionsButton: Locator;
  readonly selectAllProductsButton: Locator;
  readonly productGrid: Locator;
  readonly productSelectionButtons: Locator;

  readonly submitForApprovalButton: Locator;

  readonly saveDraftButton: Locator;
  waitForPurchaseOrderCreation: any;

  constructor(page: Page) {

    this.page = page;

    this.pageTitle =
      page.getByText(
        'Create Purchase Order',
        { exact: true }
      );

    this.warehouseField =
      page.getByText(
        'Matrix Warehouse-01'
      );

    this.supplierDropdown =
      page.getByRole('button', {
        name: /Select supplier/i
      });

    this.supplierOptions =
      page.getByRole('option');

    this.calendarButton =
      page.getByRole('button', {
        name: /Open calendar Expected Delivery/i
      });

    this.fetchSuggestionsButton =
      page.getByRole('button', {
        name: 'Fetch PO suggestions'
      });

    this.selectAllProductsButton =
      page.getByRole('button', {
        name: 'Select all products',
        exact: true
      });

    this.productGrid = page.getByRole('grid', {
      name: 'Data table'
    });
    this.productSelectionButtons = this.productGrid.getByRole('button', {
      name: /^Select .+/
    });

    this.submitForApprovalButton =
      page.getByRole('button', {
        name: /Submit for approval/i
      });

    this.saveDraftButton =
      page.getByRole('button', {
        name: /Save draft/i
      });
  }

  async verifyPageLoaded() {

    await expect(this.pageTitle)
      .toBeVisible();
  }

  async verifyDefaultWarehouse() {

    await expect(this.warehouseField)
      .toBeVisible();
  }

  async selectFirstSupplier() {

    await this.supplierDropdown.click();

    await expect(
      this.supplierOptions.first()
    ).toBeVisible();

    const supplierCount =
      await this.supplierOptions.count();

    expect(supplierCount)
      .toBeGreaterThan(0);

    await this.supplierOptions.first().click();
  }

  async selectExpectedDeliveryDate(
    date: string
  ) {

    const [year, month, day] =
      date.split('-').map(Number);

    const calendarLabel =
      new Intl.DateTimeFormat(
        'en-US',
        {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        }
      ).format(
        new Date(
          year,
          month - 1,
          day
        )
      );

    await this.calendarButton.click();
    await this.page.getByRole('grid', {
      name: 'Data table'
    }).click();
  }

  async waitForProductsToLoad(): Promise<void> {
    await this.fetchSuggestionsButton.click();
    await expect(this.page.getByText('Fetching PO suggestions...'))
      .toBeHidden({ timeout: 60_000 });
    await expect(this.productGrid).toBeVisible();
    await expect(this.productGrid.getByText('No items found.'))
      .toBeHidden({ timeout: 60_000 });
    await expect.poll(
      () => this.productGrid.getByRole('row').count(),
      { timeout: 60_000 }
    ).toBeGreaterThan(1);
  }

  async selectAllProducts(): Promise<void> {
    await expect(this.selectAllProductsButton).toBeVisible();
    await this.selectAllProductsButton.click();
    await expect(this.productSelectionButtons.first())
      .toHaveAttribute('aria-pressed', 'true');
    await expect(this.submitForApprovalButton).toBeEnabled();
  }

  async submitForApproval(): Promise<void> {
    await expect(this.submitForApprovalButton).toBeEnabled();
    await this.submitForApprovalButton.click();
  }
}