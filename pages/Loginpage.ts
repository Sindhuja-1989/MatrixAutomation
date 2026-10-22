import { expect, type Locator, type Page } from '@playwright/test';
import { Environment } from '../utils/Environment';

export class LoginPage {

    readonly page: Page;
    readonly usernameTextbox: Locator;
    readonly passwordTextbox: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {

        this.page = page;

        this.usernameTextbox =
            page.getByPlaceholder(
                'name@organization.com or 9876543210'
            );

        this.passwordTextbox =
            page.getByPlaceholder(
                'Enter password'
            );

        this.loginButton =
            page.getByRole('button', {
                name: /log in/i
            });
    }

    async gotoLoginPage(): Promise<void> {
        await this.page.goto(Environment.baseUrl);
        await expect(this.usernameTextbox).toBeVisible();
        await expect(this.passwordTextbox).toBeVisible();
    }

    async login(
        username: string,
        password: string
    ): Promise<void> {
        await this.usernameTextbox.fill(username);
        await this.passwordTextbox.fill(password);
        await expect(this.loginButton).toBeEnabled();
        await this.loginButton.click();
        await expect(this.page).toHaveURL(/\/dashboard(?:\/|$)/);
    }
}

