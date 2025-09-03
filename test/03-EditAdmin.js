const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Edit Admin Web Test');
console.log('📋 Test Configuration: Admin');

const newAdminName = "John Doe Test Edited"

describe('Edit Admin', function () {

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

    it('successfully edited admin', async function () {
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

            console.log('⏳ Waiting for admin table/list to appear');
            await driver.wait(until.elementLocated(By.css("button[aria-haspopup='menu']")), 10000);
            console.log('  - Admin list with ellipsis buttons found');

            console.log('🔍 Finding ellipsis buttons in admin rows');
            const ellipsisButtons = await driver.findElements(By.css("tr button[aria-haspopup='menu'], [data-testid*='admin'] button[aria-haspopup='menu'], .admin-row button[aria-haspopup='menu']"));

            if (ellipsisButtons.length === 0) {
                console.log('  - No admin-specific ellipsis found, trying all ellipsis buttons');
                const allEllipsisButtons = await driver.findElements(By.css("button[aria-haspopup='menu']"));
                console.log(`  - Found ${allEllipsisButtons.length} total ellipsis menu buttons`);

                if (allEllipsisButtons.length < 2) {
                    throw new Error('Need at least 2 ellipsis buttons to select the correct one');
                }

                console.log('🔘 Clicking the second ellipsis menu button (skipping first)');
                await allEllipsisButtons[1].click();
                console.log('  - Second ellipsis menu button clicked successfully');
            } else {
                console.log(`  - Found ${ellipsisButtons.length} admin-specific ellipsis menu buttons`);
                console.log('🔘 Clicking the first admin ellipsis menu button');
                await ellipsisButtons[0].click();
                console.log('  - First admin ellipsis menu button clicked successfully');
            }

            await driver.sleep(1000);

            console.log('⏳ Waiting for Edit admin menu item to appear');
            await driver.wait(until.elementLocated(By.xpath("//div[@role='menuitem' and contains(text(), 'Edit admin')]")), 10000);
            console.log('  - Edit admin menu item found');

            console.log('🔘 Clicking Edit admin menu item');
            await driver.findElement(By.xpath("//div[@role='menuitem' and contains(text(), 'Edit admin')]")).click();
            console.log('  - Edit admin menu item clicked successfully');

            await driver.sleep(2000);

            console.log('⏳ Waiting for admin name input field to appear');
            await driver.wait(until.elementLocated(By.id('admin-name')), 10000);
            console.log('  - Admin name input field found');

            console.log('📝 Clearing the admin name field');
            const nameInput = await driver.findElement(By.id('admin-name'));
            await nameInput.clear();
            console.log('  - Admin name field cleared');

            console.log('📝 Entering new admin name');
            await nameInput.sendKeys(newAdminName);
            console.log(`  - New admin name entered: ${newAdminName}`);

            await driver.sleep(1000);

            console.log('🔘 Clicking Update admin button');
            await driver.findElement(By.xpath("//button[@type='submit' and contains(., 'Update admin')]")).click();
            console.log('  - Update admin button clicked successfully');

            console.log('⏳ Waiting for success notification');
            await driver.wait(until.elementLocated(By.css("div.text-sm.font-semibold")), 10000);
            console.log('  - Success notification found');

            const notification = await driver.findElement(By.css("div.text-sm.font-semibold"));
            const notificationText = await notification.getText();
            console.log(`  - Notification text: "${notificationText}"`);

            await driver.sleep(2000);

            console.log('✅ Test completed successfully - Admin updated with notification');

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            throw error;
        }
    });
});

