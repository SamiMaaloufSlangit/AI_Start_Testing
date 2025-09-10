const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Add Subjects Web Test');
console.log('📋 Test Configuration:');

const SubjectName = "Testing 101"

describe('Add Subjects', function () {

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

    it('successfully added subjects', async function () {
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

            console.log('⏳ Waiting for settings link to appear');
            await driver.wait(until.elementLocated(By.css("a[href='/settings']")), 10000);
            console.log('  - Settings link found');

            console.log('🔘 Clicking Settings link');
            await driver.findElement(By.css("a[href='/settings']")).click();
            console.log('  - Settings link clicked');

            console.log('⏳ Waiting for settings page to load');
            await driver.wait(until.urlContains('/settings'), 10000);
            console.log('  - Settings page loaded successfully');

            await driver.sleep(2000);

            console.log('⏳ Waiting for Subjects tab to appear');
            await driver.wait(until.elementLocated(By.xpath("//button[@role='tab' and contains(text(), 'Subjects')]")), 10000);
            console.log('  - Subjects tab found');

            console.log('🔘 Clicking Subjects tab');
            await driver.findElement(By.xpath("//button[@role='tab' and contains(text(), 'Subjects')]")).click();
            console.log('  - Subjects tab clicked successfully');

            await driver.sleep(2000);

            console.log('⏳ Waiting for subject input field to appear');
            await driver.wait(until.elementLocated(By.id('subject')), 10000);
            console.log('  - Subject input field found');

            console.log('📝 Filling subject name field');
            const subjectInput = await driver.findElement(By.id('subject'));
            await subjectInput.clear();
            await subjectInput.sendKeys(SubjectName);
            console.log(`  - Subject name entered: ${SubjectName}`);

            await driver.sleep(1000);

            console.log('🔘 Clicking Add subject button');
            await driver.findElement(By.xpath("//button[@type='submit' and contains(., 'Add subject')]")).click();
            console.log('  - Add subject button clicked successfully');

            console.log('⏳ Waiting for success notification');
            await driver.wait(until.elementLocated(By.css("div.text-sm.font-semibold")), 10000);
            console.log('  - Success notification found');

            const notification = await driver.findElement(By.css("div.text-sm.font-semibold"));
            const notificationText = await notification.getText();
            console.log(`  - Notification text: "${notificationText}"`);

            await driver.sleep(2000);

            console.log('✅ Test completed successfully - Subject added with notification');

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            throw error;
        }
    });
});