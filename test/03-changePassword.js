const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Register Web Test');
console.log('📋 Test Configuration:');

const oldPassword = "123123"
const newPassword = "123123"

describe('Change Password', function () {

    this.timeout(300000);
    let driver;

    beforeEach(async function () {
        let options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1920,1080');
        options.addArguments('--disable-gpu');
        options.addArguments('--disable-extensions');
        options.addArguments('--headless');

        console.log('  - Chrome options configured');

        console.log('🌐 Initializing WebDriver');
        try {
            const chromedriverPath = path.join(__dirname, '..', 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe');
            console.log('  - ChromeDriver path:', chromedriverPath);

            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(options)
                .setChromeService(new chrome.ServiceBuilder(chromedriverPath))
                .build();
            console.log('  - WebDriver initialized successfully');
        } catch (error) {
            console.error('  - Failed to initialize WebDriver:', error.message);
            console.error('  - Error details:', error);
            throw error;
        }
    });

    afterEach(async function () {
        if (driver) {
            try {
                console.log('🧹 Closing browser');
                await driver.quit();
                console.log('  - Browser closed');
            } catch (error) {
                console.error('  - Error closing browser:', error.message);
            }
        }
    });

    it('successfully changed password', async function () {
        try {
            console.log('🔗 Navigating to login page');
            await driver.get('http://51.112.130.69');
            console.log('  - Login page loaded');

            console.log('⏳ Waiting for email input field');
            await driver.wait(until.elementLocated(By.css("input[type='email']")), 10000);
            console.log('  - Email field found');

            console.log('🔐 Filling login credentials');
            await driver.findElement(By.css("input[type='email']")).sendKeys(accountManager.email);
            console.log('  - Email entered');
            await driver.findElement(By.css("input[type='password']")).sendKeys(accountManager.password);
            console.log('  - Password entered');

            await driver.sleep(1000);

            console.log('🔘 Clicking login button');
            await driver.findElement(By.css("button[type='submit']")).click();
            console.log('  - Login button clicked');

            console.log('⏳ Waiting for successful login');
            await driver.wait(until.elementLocated(By.css("body")), 10000);
            console.log('  - Login successful');

            await driver.sleep(2000);

            console.log('⏳ Waiting for Settings link to appear');
            await driver.wait(until.elementLocated(By.css("a[href='/settings']")), 10000);
            console.log('  - Settings link found');

            console.log('🔘 Clicking Settings link');
            await driver.findElement(By.css("a[href='/settings']")).click();
            console.log('  - Settings link clicked');

            console.log('⏳ Waiting for settings page to load');
            await driver.wait(until.urlContains('/settings'), 10000);
            console.log('  - Settings page loaded successfully');

            await driver.sleep(2000);

            console.log('⏳ Waiting for Account button to appear');
            await driver.wait(until.elementLocated(By.css("button[role='tab'][aria-controls*='account']")), 10000);
            console.log('  - Account button found');

            console.log('🔘 Clicking Account button');
            await driver.findElement(By.css("button[role='tab'][aria-controls*='account']")).click();
            console.log('  - Account button clicked');

            await driver.sleep(2000);

            console.log('⏳ Waiting for current password input field');
            await driver.wait(until.elementLocated(By.css("input[id='currentPassword'][type='password']")), 10000);
            console.log('  - Current password field found');

            console.log('🔐 Filling current password');
            await driver.findElement(By.css("input[id='currentPassword'][type='password']")).sendKeys(oldPassword);
            console.log('  - Current password entered');

            console.log('⏳ Waiting for new password input field');
            await driver.wait(until.elementLocated(By.css("input[id='newPassword'][type='password']")), 10000);
            console.log('  - New password field found');

            console.log('🔐 Filling new password');
            await driver.findElement(By.css("input[id='newPassword'][type='password']")).sendKeys(newPassword);
            console.log('  - New password entered');

            console.log('⏳ Waiting for confirm password input field');
            await driver.wait(until.elementLocated(By.css("input[id='confirmPassword'][type='password']")), 10000);
            console.log('  - Confirm password field found');

            console.log('🔐 Filling confirm password');
            await driver.findElement(By.css("input[id='confirmPassword'][type='password']")).sendKeys(newPassword);
            console.log('  - Confirm password entered');

            await driver.sleep(1000);

            console.log('⏳ Waiting for Update Password button');
            await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Update Password')]")), 10000);
            console.log('  - Update Password button found');

            console.log('🔘 Clicking Update Password button');
            await driver.findElement(By.xpath("//button[contains(text(), 'Update Password')]")).click();
            console.log('  - Update Password button clicked');

            console.log('⏳ Waiting for password updated notification');
            await driver.wait(until.elementLocated(By.xpath("//*[contains(text(), 'password updated') or contains(text(), 'Password updated') or contains(text(), 'Password Updated')]")), 10000);
            console.log('  - Password updated notification found');

            const notificationElement = await driver.findElement(By.xpath("//*[contains(text(), 'password updated') or contains(text(), 'Password updated') or contains(text(), 'Password Updated')]"));
            const notificationText = await notificationElement.getText();
            console.log('  - Notification text:', notificationText);

            console.log('✅ Password change completed successfully');

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            throw error;
        }
    });
});


