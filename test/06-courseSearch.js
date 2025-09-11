const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Course Search Test');
console.log('📋 Test Configuration:');

const SearchCourse = "Python"


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

    it('successfully searched for a course', async function () {
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

            console.log('🔍 Looking for search input field');
            await driver.wait(until.elementLocated(By.css("input[placeholder*='Search']")), 10000);
            console.log('  - Search input field found');

            console.log('🔘 Clicking on search input field');
            const searchInput = await driver.findElement(By.css("input[placeholder*='Search']"));
            await searchInput.click();
            console.log('  - Search input field clicked');

            console.log('⌨️ Typing search term:', SearchCourse);
            await searchInput.clear();
            await searchInput.sendKeys(SearchCourse);
            console.log('  - Search term entered');

            await driver.sleep(1000);

            console.log('🔘 Clicking search button');
            await driver.findElement(By.css("button[type='submit']")).click();
            console.log('  - Search button clicked');

            await driver.sleep(3000);

            console.log('🔍 Checking for courses with "Python" in the title');
            await driver.wait(until.elementLocated(By.css("h3")), 10000);
            const courseTitles = await driver.findElements(By.css("h3"));

            let pythonCourseFound = false;
            for (const title of courseTitles) {
                const titleText = await title.getText();
                console.log('  - Found course title:', titleText);
                if (titleText.toLowerCase().includes('python')) {
                    pythonCourseFound = true;
                    console.log('  ✅ Found course with "Python" in title:', titleText);
                    break;
                }
            }

            if (!pythonCourseFound) {
                throw new Error('No course with "Python" in the title was found');
            }

            console.log('✅ Course search test completed successfully');
            console.log('  - Search term used:', SearchCourse);


        } catch (error) {
            console.error('❌ Test failed:', error.message);
            console.error('  - Error details:', error);
            throw error;
        }
    });
});

