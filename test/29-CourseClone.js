const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Course Clone Test');
console.log('📋 Test Configuration:');

describe('Course Clone', function () {

    this.timeout(300000);
    let driver;

    beforeEach(async function () {
        let options = new chrome.Options();
        options.addArguments('--headless');
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1920,1080');
        options.addArguments('--disable-gpu');
        options.addArguments('--disable-extensions');
        options.addArguments('--disable-save-password-bubble');
        options.addArguments('--disable-password-manager-reauthentication');
        options.addArguments('--disable-password-generation');
        options.addArguments('--disable-autofill');
        options.addArguments('--disable-web-security');
        options.addArguments('--disable-features=VizDisplayCompositor,TranslateUI,BlinkGenPropertyTrees');
        options.addArguments('--disable-infobars');
        options.addArguments('--disable-popup-blocking');
        options.addArguments('--disable-prompt-on-repost');
        options.addArguments('--disable-background-timer-throttling');
        options.addArguments('--disable-renderer-backgrounding');
        options.addArguments('--disable-backgrounding-occluded-windows');
        options.addArguments('--disable-client-side-phishing-detection');
        options.addArguments('--disable-sync');
        options.addArguments('--disable-default-apps');
        options.addArguments('--no-default-browser-check');
        options.addArguments('--no-first-run');
        options.addArguments('--disable-component-update');
        options.setUserPreferences({
            'credentials_enable_service': false,
            'profile.password_manager_enabled': false,
            'profile.default_content_setting_values.notifications': 1,
            'profile.default_content_settings.popups': 0,
            'profile.managed_default_content_settings.popups': 0,
            'profile.password_manager_leak_detection': false,
            'profile.password_manager_auto_signin': false,
            'autofill.profile_enabled': false,
            'autofill.credit_card_enabled': false,
            'profile.default_content_setting_values.geolocation': 2,
            'profile.default_content_setting_values.media_stream': 2,
            'safebrowsing.enabled': false,
            'safebrowsing.disable_download_protection': true,
            'profile.content_settings.exceptions.clipboard': {},
            'profile.default_content_setting_values.clipboard': 1
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

    it('successfully clone course', async function () {
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

            console.log('⏳ Waiting for Course Catalog link to appear');
            await driver.wait(until.elementLocated(By.css("a[href='/courses']")), 10000);
            console.log('  - Course Catalog link found');

            console.log('🔘 Clicking Courses Catalog link');
            await driver.findElement(By.css("a[href='/courses']")).click();
            console.log('  - Course Catalog link clicked');

            console.log('⏳ Waiting for courses catalog page to load');
            await driver.wait(until.urlContains('/courses'), 10000);
            console.log('  - Courses catalog page loaded successfully');

            await driver.sleep(3000);

            console.log('🔍 Looking for copy button');

            // Find the first copy button by checking all buttons for lucide-copy class
            let copyButton = null;
            let attempts = 0;
            const maxAttempts = 5;

            while (!copyButton && attempts < maxAttempts) {
                attempts++;

                try {
                    const allButtons = await driver.findElements(By.xpath("//button"));

                    for (let i = 0; i < allButtons.length; i++) {
                        try {
                            const buttonHTML = await allButtons[i].getAttribute('outerHTML');

                            if (buttonHTML.includes('lucide-copy')) {
                                copyButton = allButtons[i];
                                break;
                            }
                        } catch (e) {
                            continue;
                        }
                    }

                    if (!copyButton) {
                        await driver.sleep(2000);
                    }
                } catch (e) {
                    await driver.sleep(2000);
                }
            }

            if (!copyButton) {
                throw new Error('Could not find copy button after 5 attempts');
            }

            console.log('🔘 Clicking copy button');
            await copyButton.click();
            console.log('  - Copy button clicked');

            await driver.sleep(2000);

            console.log('🔍 Looking for Clone confirmation button');
            console.log('⏳ Waiting for Clone button to appear');

            // Find the Clone button (destructive red button)
            await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'bg-destructive') and contains(@class, 'text-destructive-foreground') and text()='Clone']")), 10000);
            console.log('  - Clone button found');

            const cloneButton = await driver.findElement(By.xpath("//button[contains(@class, 'bg-destructive') and contains(@class, 'text-destructive-foreground') and text()='Clone']"));

            console.log('🔘 Clicking Clone button');
            await cloneButton.click();
            console.log('  - Clone button clicked');

            await driver.sleep(3000);

            console.log('⏳ Waiting for clone completion');
            await driver.sleep(2000);

            console.log('✅ Course Clone test completed successfully');

        } catch (error) {
            console.error('❌ Course Clone test failed:', error.message);
            console.error('  - Error details:', error);
            throw error;
        }
    });
});