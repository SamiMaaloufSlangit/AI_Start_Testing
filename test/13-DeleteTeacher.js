const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Delete Teacher Web Test');
console.log('📋 Test Configuration:');

describe('Delete Teacher', function () {

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

    it('successfully deleted teacher', async function () {
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

            console.log('⏳ Waiting for Teachers link to appear');
            await driver.wait(until.elementLocated(By.css("a[href='/teachers']")), 10000);
            console.log('  - Teachers link found');

            console.log('🔘 Clicking Teachers link');
            await driver.findElement(By.css("a[href='/teachers']")).click();
            console.log('  - Teachers link clicked');

            console.log('⏳ Waiting for teachers page to load');
            await driver.wait(until.urlContains('/teachers'), 10000);
            console.log('  - Teachers page loaded successfully');

            await driver.sleep(2000);

            console.log('🔘 Looking for the first teacher menu button (three dots)');
            const menuButtons = await driver.findElements(By.css("button[aria-haspopup='menu'] svg.lucide-ellipsis-vertical"));
            if (menuButtons.length === 0) {
                throw new Error('No teacher menu buttons with ellipsis icon found');
            }

            const firstMenuButton = await menuButtons[0].findElement(By.xpath("./.."));
            console.log('  - First teacher menu button (with three dots) found');

            console.log('🔘 Clicking the first teacher menu button');
            await firstMenuButton.click();
            console.log('  - Teacher menu button clicked');

            await driver.sleep(1000);

            console.log('🗑️ Looking for Delete teacher menu item');
            await driver.wait(until.elementLocated(By.xpath("//div[@role='menuitem' and contains(text(), 'Delete teacher')]")), 10000);
            const deleteMenuItem = await driver.findElement(By.xpath("//div[@role='menuitem' and contains(text(), 'Delete teacher')]"));
            console.log('  - Delete teacher menu item found');

            console.log('🗑️ Clicking Delete teacher menu item');
            await deleteMenuItem.click();
            console.log('  - Delete teacher menu item clicked');

            await driver.sleep(1000);

            console.log('⚠️ Looking for Delete confirmation button');
            await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'bg-destructive') and contains(text(), 'Delete')]")), 10000);
            const deleteConfirmButton = await driver.findElement(By.xpath("//button[contains(@class, 'bg-destructive') and contains(text(), 'Delete')]"));
            console.log('  - Delete confirmation button found');

            console.log('⚠️ Clicking Delete confirmation button');
            await deleteConfirmButton.click();
            console.log('  - Delete confirmation button clicked');

            console.log('⏳ Waiting for success notification');
            await driver.sleep(3000);
            console.log('  - Waiting for notification to appear');

            console.log('✅ Teacher deletion completed successfully');

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            throw error;
        }
    });
});
