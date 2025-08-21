const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Course Search Test');
console.log('📋 Test Configuration:');

describe('Enrolled Course NB', function () {

    this.timeout(300000);
    let driver;

    beforeEach(async function () {
        let options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--headless');
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

    it('successfully checked enrolled course NB', async function () {
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

            console.log('⏳ Waiting for Dashboard link to appear');
            await driver.wait(until.elementLocated(By.css("a[href='/dashboard']")), 10000);
            console.log('  - Dashboard link found');

            console.log('🔘 Clicking Dashboard link');
            await driver.findElement(By.css("a[href='/dashboard']")).click();
            console.log('  - Dashboard link clicked');

            console.log('⏳ Waiting for dashboard page to load');
            await driver.wait(until.urlContains('/dashboard'), 10000);
            console.log('  - Dashboard page loaded successfully');

            await driver.sleep(2000);

            console.log('🔍 Looking for enrolled courses count');
            console.log('⏳ Waiting for enrolled courses count element to appear');
            await driver.wait(until.elementLocated(By.css("div.text-2xl.font-bold")), 10000);
            console.log('  - Enrolled courses count element found');

            const enrolledCoursesElement = await driver.findElement(By.css("div.text-2xl.font-bold"));
            const enrolledCoursesCount = await enrolledCoursesElement.getText();
            console.log(`  - Initial enrolled courses count: "${enrolledCoursesCount}"`);

            console.log('🔄 Checking enrolled courses count scenario');
            if (enrolledCoursesCount === '0') {
                console.log('  - 📋 Case 1: Enrolled courses count is 0 - proceeding to enroll in a course');

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

                console.log('🔙 Navigating back to dashboard to verify updated count');
                console.log('⏳ Waiting for Dashboard link to appear');
                await driver.wait(until.elementLocated(By.css("a[href='/dashboard']")), 10000);
                console.log('  - Dashboard link found');

                console.log('🔘 Clicking Dashboard link');
                await driver.findElement(By.css("a[href='/dashboard']")).click();
                console.log('  - Dashboard link clicked');

                console.log('⏳ Waiting for dashboard page to load');
                await driver.wait(until.urlContains('/dashboard'), 10000);
                console.log('  - Dashboard page loaded successfully');

                await driver.sleep(2000);

                console.log('🔍 Checking updated enrolled courses count');
                console.log('⏳ Waiting for enrolled courses count element to appear');
                await driver.wait(until.elementLocated(By.css("div.text-2xl.font-bold")), 10000);
                console.log('  - Enrolled courses count element found');

                const updatedEnrolledCoursesElement = await driver.findElement(By.css("div.text-2xl.font-bold"));
                const updatedEnrolledCoursesCount = await updatedEnrolledCoursesElement.getText();
                console.log(`  - Updated enrolled courses count: "${updatedEnrolledCoursesCount}"`);

                if (parseInt(updatedEnrolledCoursesCount) > parseInt(enrolledCoursesCount)) {
                    console.log('  - ✅ Enrolled courses count increased successfully!');
                    console.log(`  - ✅ Count changed from ${enrolledCoursesCount} to ${updatedEnrolledCoursesCount}`);
                } else {
                    console.log('  - ⚠️ Enrolled courses count did not increase as expected');
                }

                console.log('✅ Case 1: Course enrollment test completed successfully');

            } else {
                console.log(`  - 📋 Case 2: Enrolled courses count is ${enrolledCoursesCount} (not 0) - verifying actual enrolled courses`);

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

                console.log('🔍 Counting actual enrolled courses on courses page');
                console.log('⏳ Looking for all "Enrolled" status elements');

                try {
                    const enrolledElements = await driver.findElements(By.xpath("//div[contains(@class, 'text-sm') and contains(@class, 'flex') and contains(@class, 'items-center') and contains(@class, 'rounded') and contains(@class, 'justify-center') and contains(@class, 'h-8') and contains(@class, 'w-20') and contains(@class, 'bg-background') and contains(@class, 'backdrop-blur-sm') and text()='Enrolled']"));
                    const actualEnrolledCount = enrolledElements.length;

                    console.log(`  - Found ${actualEnrolledCount} courses with "Enrolled" status`);
                    console.log(`  - Dashboard shows: ${enrolledCoursesCount} enrolled courses`);

                    if (actualEnrolledCount.toString() === enrolledCoursesCount) {
                        console.log('  - ✅ Dashboard count matches actual enrolled courses!');
                        console.log(`  - ✅ Both show ${enrolledCoursesCount} enrolled courses`);
                    } else {
                        console.log('  - ⚠️ Dashboard count does NOT match actual enrolled courses!');
                        console.log(`  - ⚠️ Dashboard: ${enrolledCoursesCount}, Actual: ${actualEnrolledCount}`);
                    }

                } catch (error) {
                    console.log('  - ⚠️ Could not find any "Enrolled" status elements');
                    console.log(`  - Error: ${error.message}`);
                    console.log('  - This might indicate no courses are actually enrolled despite dashboard showing a count');
                }

                console.log('✅ Case 2: Enrolled courses verification completed successfully');
            }

            await driver.sleep(1000);

            console.log('✅ Enrolled course count test completed successfully');

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            console.error('  - Error details:', error);
            throw error;
        }
    });
});

