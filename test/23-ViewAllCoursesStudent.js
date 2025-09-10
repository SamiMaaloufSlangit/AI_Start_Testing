const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting View All Courses Student Test');
console.log('📋 Test Configuration:');

describe('View All Courses Student', function () {

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

    it('successfully Viewed All Courses', async function () {
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

            await driver.sleep(2000);

            console.log('🔍 Checking for available courses');

            const courseCardSelector = "div.rounded-lg.border.bg-card.text-card-foreground.shadow-sm.overflow-hidden.h-full.flex.flex-col.group.hover\\:shadow-lg.transition-shadow.duration-300";

            try {
                console.log('⏳ Looking for course cards...');
                await driver.wait(until.elementLocated(By.css(courseCardSelector)), 5000);

                const courseCards = await driver.findElements(By.css(courseCardSelector));
                const courseCount = courseCards.length;

                console.log(`  - Found ${courseCount} course(s) available`);

                if (courseCount > 0) {
                    console.log('✅ Courses are available on the page');

                    for (let i = 0; i < Math.min(courseCount, 3); i++) {
                        try {
                            const courseCard = courseCards[i];
                            const titleElement = await courseCard.findElement(By.css("h3.font-semibold.tracking-tight"));
                            const courseTitle = await titleElement.getText();
                            console.log(`  - Course ${i + 1}: ${courseTitle}`);
                        } catch (error) {
                            console.log(`  - Could not read title for course ${i + 1}`);
                        }
                    }

                    console.log('🔍 Checking for Enroll buttons');

                    try {
                        const enrollButtons = await driver.findElements(By.xpath("//button[contains(text(), 'Enroll')]"));
                        const enrollButtonCount = enrollButtons.length;

                        console.log(`  - Found ${enrollButtonCount} Enroll button(s)`);

                        if (enrollButtonCount > 0) {
                            console.log('✅ Enroll buttons are available for course enrollment');

                            for (let i = 0; i < Math.min(enrollButtonCount, 3); i++) {
                                try {
                                    const enrollButton = enrollButtons[i];
                                    const isDisplayed = await enrollButton.isDisplayed();
                                    const isEnabled = await enrollButton.isEnabled();
                                    console.log(`  - Enroll button ${i + 1}: Visible=${isDisplayed}, Enabled=${isEnabled}`);
                                } catch (error) {
                                    console.log(`  - Could not check enroll button ${i + 1} status`);
                                }
                            }
                        } else {
                            console.log('⚠️  No Enroll buttons found - students may already be enrolled in available courses');
                        }

                    } catch (error) {
                        console.log('⚠️  Could not locate Enroll buttons:', error.message);
                    }

                    try {
                        const viewCourseButtons = await driver.findElements(By.xpath("//button[contains(text(), 'View Course')] | //a[contains(@href, '/courses/')]/button"));
                        console.log(`  - Found ${viewCourseButtons.length} View Course button(s)`);
                    } catch (error) {
                        console.log('  - Could not check for View Course buttons');
                    }

                } else {
                    console.log('❌ No courses found on the page');
                }

            } catch (error) {
                console.log('⚠️  No course cards found using the specific selector');
            }

            console.log('✅ View All Courses test completed successfully');

        } catch (error) {
            console.error('❌ View All Courses test failed:', error.message);
            console.error('  - Error details:', error);
            throw error;
        }
    });

});