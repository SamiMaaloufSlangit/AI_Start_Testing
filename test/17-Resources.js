const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Resources Web Test');
console.log('📋 Test Configuration:');

const ResourceName = "Khan Academy"

describe('Resources', function () {

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

    it('successfully added resources', async function () {
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

            console.log('⏳ Waiting for Resources link to appear');
            await driver.wait(until.elementLocated(By.css("a[href='/resources']")), 10000);
            console.log('  - Resources link found');

            console.log('🔘 Clicking Resources link');
            await driver.findElement(By.css("a[href='/resources']")).click();
            console.log('  - Resources link clicked');

            console.log('⏳ Waiting for resources page to load');
            await driver.wait(until.urlContains('/resources'), 10000);
            console.log('  - Resources page loaded successfully');

            await driver.sleep(2000);

            console.log('🔍 Looking for Khan Academy heading');
            await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Khan Academy')]")), 10000);
            const khanAcademyHeading = await driver.findElement(By.xpath("//h3[contains(text(), 'Khan Academy')]"));
            console.log('  - Khan Academy heading found');

            const headingText = await khanAcademyHeading.getText();
            console.log(`  - Heading text: "${headingText}"`);

            if (headingText === 'Khan Academy') {
                console.log('✅ Khan Academy heading verification successful');
            } else {
                throw new Error(`Expected "Khan Academy" but found "${headingText}"`);
            }

            console.log('🔍 Using search functionality');
            const searchInput = await driver.findElement(By.css("input[placeholder='Search resources...']"));
            await searchInput.sendKeys(ResourceName);
            console.log(`  - Entered search term: "${ResourceName}"`);

            console.log('🔍 Clicking search submit button');
            const searchButton = await driver.findElement(By.css("button[type='submit']"));
            await searchButton.click();
            console.log('  - Search button clicked');

            await driver.sleep(2000);

            console.log('🔍 Verifying Khan Academy appears in search results');
            await driver.wait(until.elementLocated(By.xpath("//h3[contains(text(), 'Khan Academy')]")), 10000);
            const searchResultHeading = await driver.findElement(By.xpath("//h3[contains(text(), 'Khan Academy')]"));
            console.log('  - Khan Academy heading found in search results');

            const searchHeadingText = await searchResultHeading.getText();
            console.log(`  - Search result heading text: "${searchHeadingText}"`);

            if (searchHeadingText === 'Khan Academy') {
                console.log('✅ Khan Academy found in search results - search functionality verified');
            } else {
                throw new Error(`Expected "Khan Academy" in search results but found "${searchHeadingText}"`);
            }

            console.log('✅ Search completed successfully');

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            throw error;
        }
    });
});