const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Register Web Test');
console.log('📋 Test Configuration:');

const adminName = "John Doe Test"
const adminEmail = "test123@test.com"
const adminPassword = "123123"

describe('Admin Navigation', function () {

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
        options.addArguments('--disable-save-password-bubble');
        options.addArguments('--disable-password-manager-reauthentication');
        options.addArguments('--disable-password-generation');
        options.addArguments('--disable-autofill');
        options.addArguments('--disable-web-security');
        options.addArguments('--disable-features=VizDisplayCompositor,TranslateUI,BlinkGenPropertyTrees');
        options.setUserPreferences({
            'credentials_enable_service': false,
            'profile.password_manager_enabled': false,
            'profile.default_content_setting_values.notifications': 2,
            'profile.default_content_settings.popups': 0,
            'profile.managed_default_content_settings.popups': 0
        });

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

    it('successfully added admin', async function () {
        try {
            console.log('🔗 Navigating to login page');
            await driver.get('https://learn.aistart.school/');
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

            console.log('⏳ Waiting for Admins link to appear');
            await driver.wait(until.elementLocated(By.css("a[href='/admins']")), 10000);
            console.log('  - Admins link found');

            console.log('🔘 Clicking Admins link');
            await driver.findElement(By.css("a[href='/admins']")).click();
            console.log('  - Admins link clicked');

            console.log('⏳ Waiting for admins page to load');
            await driver.wait(until.urlContains('/admins'), 10000);
            console.log('  - Admins page loaded successfully');

            await driver.sleep(2000);

            console.log('🔘 Looking for the add admin button');
            const button = await driver.findElement(By.css("button.bg-primary"));
            console.log('  - Add Admin button found');

            console.log('🔘 Clicking the add admin button');
            await button.click();
            console.log('  - Add Admin button clicked successfully');

            await driver.sleep(2000);

            console.log('📝 Filling the Full Name field');
            const nameInput = await driver.findElement(By.id("admin-name"));
            await nameInput.clear();
            await nameInput.sendKeys(adminName);
            console.log('  - Full Name field filled with: ' + adminName);

            console.log('📝 Filling the Email field');
            const emailInput = await driver.findElement(By.id("admin-email"));
            await emailInput.clear();
            await emailInput.sendKeys(adminEmail);
            console.log('  - Email field filled with: ' + adminEmail);

            console.log('☑️ Clicking the custom password checkbox');
            const passwordCheckbox = await driver.findElement(By.id("use-custom-password"));
            await passwordCheckbox.click();
            console.log('  - Custom password checkbox clicked successfully');

            console.log('📝 Filling the Password field');
            const passwordInput = await driver.findElement(By.id("admin-password"));
            await passwordInput.clear();
            await passwordInput.sendKeys(adminPassword);
            console.log('  - Password field filled with: ' + adminPassword);

            console.log('🔘 Clicking the submit button');
            const submitButton = await driver.findElement(By.css("button[type='submit']"));
            await submitButton.click();
            console.log('  - Submit button clicked successfully');

            await driver.sleep(2000);

            console.log('🔍 Checking for success notification');
            try {
                await driver.wait(until.elementLocated(By.css("div.text-sm.font-semibold")), 10000);
                console.log('  - Success notification container found');

                const adminAddedTitle = await driver.findElement(By.css("div.text-sm.font-semibold"));
                const titleText = await adminAddedTitle.getText();
                console.log('  - Notification title: "' + titleText + '"');

                if (titleText === 'Admin added') {
                    console.log('  ✅ Success notification title verified correctly');
                } else {
                    console.log('  ❌ Success notification title does not match expected: "Admin added"');
                }

                await driver.sleep(2000);

                console.log('✅ Test completed successfully');
            } catch (error) {
                console.log('  ❌ Success notification not found: ' + error.message);
                throw error;
            }
        } catch (error) {
            console.error('❌ Test failed:', error.message);
            throw error;
        }
    });
});

