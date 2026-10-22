import { expect, test } from '@playwright/test';
import { CreatePurchaseOrderPage } from '../pages/CreatePurchaseOrderPage';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';
import { PurchaseOrdersPage } from '../pages/PurchaseorderPage';
import { Environment } from '../utils/Environment';

test.describe('Create Purchase Order', () => {
  test('creates a purchase order successfully', async ({ page }) => {
    test.setTimeout(180_000);

    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const purchaseOrdersPage = new PurchaseOrdersPage(page);
    const createPurchaseOrderPage = new CreatePurchaseOrderPage(page);

    await loginPage.gotoLoginPage();
    await loginPage.login(Environment.username, Environment.password);

    await dashboardPage.switchToOperations();
    
    await dashboardPage.openPurchaseOrders();

    await purchaseOrdersPage.verifyPurchaseOrdersPageLoaded();
    await purchaseOrdersPage.clickNewOrder();

    await createPurchaseOrderPage.verifyPageLoaded();
    await createPurchaseOrderPage.verifyDefaultWarehouse();
    await createPurchaseOrderPage.selectFirstSupplier();

    const expectedDeliveryDate = new Date();
    expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);
    const formattedDeliveryDate = [
      expectedDeliveryDate.getFullYear(),
      String(expectedDeliveryDate.getMonth() + 1).padStart(2, '0'),
      String(expectedDeliveryDate.getDate()).padStart(2, '0')
    ].join('-');

    await createPurchaseOrderPage.selectExpectedDeliveryDate(
      formattedDeliveryDate
    );
    await createPurchaseOrderPage.waitForProductsToLoad();
    await createPurchaseOrderPage.selectAllProducts();

    await expect(createPurchaseOrderPage.submitForApprovalButton)
      .toBeEnabled({ timeout: 30_000 });
    await createPurchaseOrderPage.submitForApproval();
    await page.waitForTimeout(5000);

   // await createPurchaseOrderPage.waitForPurchaseOrderCreation();

   await expect(page).toHaveURL(
    /\/dashboard\/ops\/po\/details\?poId=/,
    { timeout: 180000 }
   );

   await expect(
    page.getByRole('button', {
        name: 'Place Order'
    })).toBeVisible();
  });
});
