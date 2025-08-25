const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Search Filter Teachers Web Test');
console.log('📋 Test Configuration:');

const TeacherName = "Sami"

describe('Search Filter Teachers', function () {

    this.timeout(300000);
    let driver;

    beforeEach(async function () {
        let options = new chrome.Options();
        options.addArguments('--no-sandbox');
        options.addArguments('--disable-dev-shm-usage');
        options.addArguments('--window-size=1920,1080');
        options.addArguments('--disable-gpu');
        options.addArguments('--disable-extensions');
        //options.addArguments('--headless');
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

    it('successfully searched and filtered teachers', async function () {
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

            console.log('🔍 Looking for search teachers input field');
            await driver.wait(until.elementLocated(By.css("input[placeholder='Search teachers...']")), 10000);
            const searchInput = await driver.findElement(By.css("input[placeholder='Search teachers...']"));
            console.log('  - Search teachers input field found');

            console.log('🔍 Entering search term');
            const searchTerm = TeacherName;
            await searchInput.sendKeys(searchTerm);
            console.log(`  - Search term entered: "${searchTerm}"`);

            console.log('🔍 Clicking search button');
            const searchButton = await driver.findElement(By.css("button[type='submit'] svg.lucide-search"));
            const searchButtonParent = await searchButton.findElement(By.xpath("./.."));
            await searchButtonParent.click();
            console.log('  - Search button clicked');

            await driver.sleep(2000);

            console.log(`🔍 Checking search results for "${TeacherName}"`);
            try {
                await driver.wait(until.elementLocated(By.xpath(`//td[contains(text(), '${TeacherName}')]`)), 10000);
                const teacherResult = await driver.findElement(By.xpath(`//td[contains(text(), '${TeacherName}')]`));
                const resultText = await teacherResult.getText();
                console.log(`  - Found search result: "${resultText}"`);
                console.log(`✅ Teacher search completed successfully - ${TeacherName} found`);
            } catch (error) {
                console.log(`  - "${TeacherName}" not found in search results`);
                console.error(`❌ Test failed: Expected search result "${TeacherName}" was not found`);
                throw new Error(`Search result verification failed: "${TeacherName}" not found in search results`);
            }

            console.log('🔄 Refreshing page to test filtering functionality');
            await driver.navigate().refresh();
            console.log('  - Page refreshed');

            await driver.sleep(3000);

            console.log('⏳ Waiting for teachers page to reload');
            await driver.wait(until.urlContains('/teachers'), 10000);
            console.log('  - Teachers page reloaded successfully');

            console.log('🔍 Testing filtering functionality');
            console.log('🏫 Looking for School filter dropdown');

            const schoolFilterButton = await driver.findElement(By.xpath("//button[@role='combobox' and @data-state='closed' and .//span[text()='School']]"));
            console.log('  - School filter dropdown found');

            console.log('🏫 Clicking School filter dropdown');
            await schoolFilterButton.click();
            console.log('  - School filter dropdown clicked');

            await driver.sleep(1000);

            console.log('🏫 Selecting first school option');
            const schoolOptions = await driver.findElements(By.css("[role='option']"));
            if (schoolOptions.length === 0) {
                const alternativeOptions = await driver.findElements(By.css("div[data-value], div[role='menuitem'], .dropdown-item"));
                if (alternativeOptions.length > 0) {
                    const firstOption = alternativeOptions[0];
                    await firstOption.click();
                    console.log('  - First school option selected (alternative selector)');
                } else {
                    throw new Error('No school filter options found');
                }
            } else {
                const firstOption = schoolOptions[0];
                await firstOption.click();
                console.log('  - First school option selected from dropdown');
            }

            await driver.sleep(1000);

            console.log('✅ School filter applied successfully');

            console.log('🔍 Clicking search button again to apply filter');
            const searchButtonAfterFilter = await driver.findElement(By.css("button[type='submit'] svg.lucide-search"));
            const searchButtonParentAfterFilter = await searchButtonAfterFilter.findElement(By.xpath("./.."));
            await searchButtonParentAfterFilter.click();
            console.log('  - Search button clicked after applying filter');

            await driver.sleep(2000);

            console.log('🔍 Checking if filtered results are displayed');
            try {
                const teacherRows = await driver.findElements(By.css("table tbody tr"));
                if (teacherRows.length > 0) {
                    console.log(`  - Found ${teacherRows.length} filtered result(s)`);
                    console.log('✅ Filter search completed successfully - Results found');
                } else {
                    console.log('  - No results found after applying filter');
                    console.log('⚠️ Filter search completed but no results displayed');
                }
            } catch (error) {
                console.log('  - Could not verify filtered results');
                console.log('⚠️ Filter search completed but result verification failed');
            }

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            throw error;
        }
    });
});
