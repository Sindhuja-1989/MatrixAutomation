import { Locator, Page, expect } from '@playwright/test';

export class DashboardPage {

    readonly page: Page;

    readonly profileMenuButton: Locator;
    readonly userMenu: Locator;
    readonly operationsMenuItem: Locator;

    readonly purchaseOrdersMenu: Locator;

    constructor(page: Page) {

        this.page = page;

        this.profileMenuButton =
            page.getByRole('button', {
                name: 'User menu'
            });

        this.userMenu =
            page.getByRole('menu', {
                name: 'User menu'
            });

        this.operationsMenuItem =
            this.userMenu.getByRole('menuitem', {
                name: 'Operations',
                exact: true
            });

        this.purchaseOrdersMenu =
            page.getByRole('link', {
                name: 'Purchase Orders',
                exact: true
            });
    }

    async switchToOperations() {

        const currentPath =
            new URL(this.page.url()).pathname;

        if (/\/dashboard\/ops/.test(currentPath)) {
            return;
        }

        await this.profileMenuButton.click();

        await expect(this.userMenu).toBeVisible();

        await this.operationsMenuItem.click();

        await expect(this.page)
            .toHaveURL(/\/dashboard\/ops/);
    }

    async openPurchaseOrders() {

        await this.purchaseOrdersMenu.click();
    }
}