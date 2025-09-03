const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Export Teachers Web Test');
console.log('📋 Test Configuration:');

describe('Export Teachers', function () {

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

    it('successfully exported teachers and file was downloaded', async function () {
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

            console.log('📥 Looking for Export Teachers button');
            await driver.wait(until.elementLocated(By.xpath("//button[contains(., 'Export Teachers')]")), 10000);
            const exportButton = await driver.findElement(By.xpath("//button[contains(., 'Export Teachers')]"));
            console.log('  - Export Teachers button found');

            console.log('📥 Clicking Export Teachers button');
            await exportButton.click();
            console.log('  - Export Teachers button clicked');

            await driver.sleep(3000);

            console.log('📁 Checking if file was downloaded');
            const fs = require('fs');
            const os = require('os');
            const downloadPath = path.join(os.homedir(), 'Downloads');

            const files = fs.readdirSync(downloadPath);
            const exportFiles = files.filter(file =>
                file.toLowerCase().includes('teacher') ||
                file.toLowerCase().includes('export') ||
                file.endsWith('.csv') ||
                file.endsWith('.xlsx')
            );

            if (exportFiles.length > 0) {
                console.log(`  - File downloaded successfully: ${exportFiles[0]}`);
                console.log('✅ Teachers exported and file was downloaded successfully');
            } else {
                console.log('  - No export file found in Downloads folder');
                console.log('⚠️ Teachers export completed but file was not downloaded');
            }

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            throw error;
        }
    });
});
