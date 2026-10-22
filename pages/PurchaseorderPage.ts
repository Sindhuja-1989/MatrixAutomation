import { expect, type Locator, type Page } from '@playwright/test';

export class PurchaseOrdersPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly searchPurchaseOrderTextbox: Locator;
  readonly supplierDropdown: Locator;
  readonly statusDropdown: Locator;
  readonly newOrderButton: Locator;
  readonly poTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', {
      name: 'Purchase Orders',
      exact: true
    });
    this.searchPurchaseOrderTextbox = page.getByLabel(
      'Search purchase orders'
    );
    this.supplierDropdown = page.getByLabel('Select supplier');
    this.statusDropdown = page.getByLabel('Select status');
    this.newOrderButton = page.getByRole('button', {
      name: 'New Order',
      exact: true
    });
    this.poTable = page.getByRole('table');
  }

  async verifyPurchaseOrdersPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/dashboard\/ops\/po(?:\?.*)?$/);
    await expect(this.page.getByText('Loading your dashboard...'))
      .toBeHidden({ timeout: 30_000 });
    await expect(this.page.getByText('Loading...', { exact: true }))
      .toBeHidden({ timeout: 60_000 });
    await expect(this.heading).toBeVisible();
    await expect(this.searchPurchaseOrderTextbox).toBeVisible();
  }

  async searchPurchaseOrder(poNumber: string): Promise<void> {
    await this.searchPurchaseOrderTextbox.fill(poNumber);
  }

  async selectSupplier(supplierName: string): Promise<void> {
    await this.supplierDropdown.click();
    await this.page.getByText(supplierName, { exact: true }).click();
  }

  async selectStatus(status: string): Promise<void> {
    await this.statusDropdown.click();
    await this.page.getByText(status, { exact: true }).click();
  }

  async clickNewOrder(): Promise<void> {
    await expect(this.newOrderButton).toBeEnabled();
    await Promise.all([
      this.page.waitForURL(/\/dashboard\/ops\/po\/new$/, { timeout: 30_000 }),
      this.newOrderButton.click()
    ]);
  }

  async openPurchaseOrder(poNumber: string): Promise<void> {
    await this.page.getByRole('link', {
      name: poNumber,
      exact: true
    }).click();
  }

  async verifyPurchaseOrdersGridVisible(): Promise<void> {
    await expect(this.poTable).toBeVisible();
  }

  async waitForPurchaseOrderCreation() {

    await expect(
        this.page.getByText(
            'Creating purchase order...'
        )
    ).toBeHidden({
        timeout: 180000
    });
}
}