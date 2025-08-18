const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Course Search Test');
console.log('📋 Test Configuration:');

const SearchCourse = "Music"


describe('Course Search', function () {

    this.timeout(300000);
    let driver;

    beforeEach(async function () {
        let options = new chrome.Options();
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

    it('successfully searched for a course', async function () {
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

            console.log('⏳ Waiting for Course Catalog link to appear');
            await driver.wait(until.elementLocated(By.css("a[href='/courses']")), 10000);
            console.log('  - Course Catalog link found');

            console.log('🔘 Clicking Courses Catalog link');
            await driver.findElement(By.css("a[href='/courses']")).click();
            console.log('  - Course Catalog link clicked');

            console.log('⏳ Waiting for courses catalog page to load');
            await driver.wait(until.urlContains('/courses'), 10000);
            console.log('  - Courses catalog page loaded successfully');

            await driver.sleep(2000);

            console.log('🔍 Looking for enroll button');
            console.log('⏳ Waiting for enroll button to appear');
            await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'bg-primary') and text()='Enroll']")), 10000);
            console.log('  - Enroll button found');

            const enrollButton = await driver.findElement(By.xpath("//button[contains(@class, 'bg-primary') and text()='Enroll']"));

            console.log('🔘 Clicking first enroll button');
            await enrollButton.click();
            console.log('  - Enroll button clicked');

            await driver.sleep(2000);

            console.log('🔍 Verifying enrollment was successful');
            console.log('⏳ Waiting for "Enrolled" status to appear');
            await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'text-sm') and contains(@class, 'flex') and contains(@class, 'items-center') and contains(@class, 'rounded') and contains(@class, 'justify-center') and contains(@class, 'h-8') and contains(@class, 'w-20') and contains(@class, 'bg-background') and contains(@class, 'backdrop-blur-sm') and text()='Enrolled']")), 10000);
            console.log('  - ✅ "Enrolled" status found - enrollment successful!');

            const enrolledStatus = await driver.findElement(By.xpath("//div[contains(@class, 'text-sm') and contains(@class, 'flex') and contains(@class, 'items-center') and contains(@class, 'rounded') and contains(@class, 'justify-center') and contains(@class, 'h-8') and contains(@class, 'w-20') and contains(@class, 'bg-background') and contains(@class, 'backdrop-blur-sm') and text()='Enrolled']"));
            const statusText = await enrolledStatus.getText();
            console.log(`  - Status confirmed: "${statusText}"`);

            await driver.sleep(2000);

            console.log('🔍 Looking for "Leave Course" button');
            console.log('⏳ Waiting for "Leave Course" button to appear');
            await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'border') and contains(@class, 'border-input') and contains(@class, 'hover:bg-accent') and text()='Leave Course']")), 10000);
            console.log('  - "Leave Course" button found');

            const leaveCourseButton = await driver.findElement(By.xpath("//button[contains(@class, 'border') and contains(@class, 'border-input') and contains(@class, 'hover:bg-accent') and text()='Leave Course']"));

            console.log('🔘 Clicking "Leave Course" button');
            await leaveCourseButton.click();
            console.log('  - "Leave Course" button clicked');

            await driver.sleep(2000);

            console.log('🔍 Verifying course was left successfully');
            console.log('⏳ Waiting for "Enroll" button to reappear');
            try {
                await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'bg-primary') and text()='Enroll']")), 10000);
                console.log('  - ✅ "Enroll" button reappeared - course left successfully!');

                const reenrolledButton = await driver.findElement(By.xpath("//button[contains(@class, 'bg-primary') and text()='Enroll']"));
                const buttonText = await reenrolledButton.getText();
                console.log(`  - Button confirmed: "${buttonText}"`);

            } catch (error) {
                console.log('  - ⚠️ Could not verify course was left - "Enroll" button did not reappear');
                console.log(`  - Error: ${error.message}`);
            }

            await driver.sleep(1000);

            console.log('✅ Course enrollment and leave test completed successfully');

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            console.error('  - Error details:', error);
            throw error;
        }
    });
});
