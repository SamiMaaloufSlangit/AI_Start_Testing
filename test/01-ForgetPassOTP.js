const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Register Web Test');
console.log('📋 Test Configuration:');

describe('OTP Verification', function () {

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

    it('successfully tested otp verification', async function () {
        try {
            console.log('🔗 Navigating to login page');
            await driver.get('http://51.112.130.69');
            console.log('  - Login page loaded');

            console.log('⏳ Waiting for forgot password link');
            await driver.wait(until.elementLocated(By.css("a[href='/forgot-password']")), 10000);
            console.log('  - Forgot password link found');

            console.log('🔘 Clicking forgot password link');
            await driver.findElement(By.css("a[href='/forgot-password']")).click();
            console.log('  - Forgot password link clicked');

            console.log('⏳ Waiting for forgot password page to load');
            await driver.wait(until.urlContains('/forgot-password'), 10000);
            console.log('  - Forgot password page loaded successfully');

            console.log('⏳ Waiting for email input field');
            await driver.wait(until.elementLocated(By.id('email')), 10000);
            console.log('  - Email input field found');

            console.log('📝 Entering email address');
            await driver.findElement(By.id('email')).sendKeys('test@test.com');
            console.log('  - Email entered successfully');

            console.log('⏳ Waiting for Send OTP button');
            await driver.wait(until.elementLocated(By.css("button[type='submit']")), 10000);
            console.log('  - Send OTP button found');

            console.log('🔘 Clicking Send OTP button');
            await driver.findElement(By.css("button[type='submit']")).click();
            console.log('  - Send OTP button clicked');

            console.log('⏳ Waiting for error popup to appear');
            await driver.wait(until.elementLocated(By.css("div.text-sm.font-semibold")), 10000);
            console.log('  - Error popup found');

            console.log('✅ Test completed successfully');
        } catch (error) {
            console.error('❌ Test failed:', error.message);
            throw error;
        }
    });
});