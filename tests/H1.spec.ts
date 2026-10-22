import { test, expect } from '@playwright/test';

import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { CreatePurchaseOrderPage } from '../pages/CreatePurchaseOrderPage';

import { Environment } from '../utils/Environment';

test.describe('Purchase Order Creation', () => {

    test('Create Purchase Order Successfully', async ({ page }) => {

        const loginPage = new LoginPage(page);
        const dashboardPage = new DashboardPage(page);
        const createPOPage = new CreatePurchaseOrderPage(page);

        // Login
        await loginPage.gotoLoginPage();

        await loginPage.login(
            Environment.username,
            Environment.password
        );

        // Switch to Operations
        await dashboardPage.switchToOperations();

        // Open Purchase Orders
        await dashboardPage.openPurchaseOrders();

        // Verify Create Purchase Order Page
        await createPOPage.verifyPageLoaded();

        // Verify Default Warehouse
        await createPOPage.verifyDefaultWarehouse();

        // Select First Available Supplier
        await createPOPage.selectFirstSupplier();

        // Create Dynamic Future Date (+7 days)
        const futureDate = new Date();

        futureDate.setDate(
            futureDate.getDate() + 7
        );

        const expectedDeliveryDate =
            futureDate
                .toISOString()
                .split('T')[0];

        // Select Delivery Date
        await createPOPage.selectExpectedDeliveryDate(
            expectedDeliveryDate
        );

        // Wait for Products Grid
        await createPOPage.waitForProductsToLoad();

        // Select All Products
        await createPOPage.selectAllProducts();

        // Submit Purchase Order
        await createPOPage.submitForApproval();

        // Success Validation
        await expect(page)
            .not.toHaveURL(
                /\/dashboard\/ops\/po\/new/
            );
    });

});