const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');
const fs = require('fs');

console.log('🚀 Starting Bulk Add Teachers Web Test');
console.log('📋 Test Configuration: Teachers');

describe('Bulk Add Teachers', function () {

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

    it('successfully bulk add teachers', async function () {
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

            console.log('⏳ Waiting for Settings link to appear');
            await driver.wait(until.elementLocated(By.css("a[href='/settings']")), 10000);
            console.log('  - Settings link found');

            console.log('🔘 Clicking Settings link');
            await driver.findElement(By.css("a[href='/settings']")).click();
            console.log('  - Settings link clicked');

            console.log('⏳ Waiting for settings page to load');
            await driver.wait(until.urlContains('/settings'), 10000);
            console.log('  - Settings page loaded successfully');

            await driver.sleep(2000);

            console.log('👥 Looking for Users tab button');
            await driver.wait(until.elementLocated(By.css("button[role='tab'][aria-controls*='users']")), 10000);
            const usersTabButton = await driver.findElement(By.css("button[role='tab'][aria-controls*='users']"));
            console.log('  - Users tab button found');

            console.log('👥 Clicking Users tab');
            await usersTabButton.click();
            console.log('  - Users tab clicked');

            await driver.sleep(1000);

            console.log('👥 Looking for Students combobox button');
            await driver.wait(until.elementLocated(By.xpath("//button[@role='combobox']//span[text()='Students']")), 10000);
            const studentsCombobox = await driver.findElement(By.xpath("//button[@role='combobox']//span[text()='Students']/ancestor::button"));
            console.log('  - Students combobox button found');

            console.log('👥 Clicking Students combobox');
            await studentsCombobox.click();
            console.log('  - Students combobox clicked');

            await driver.sleep(1000);

            console.log('📋 Looking for last option in Students dropdown');
            await driver.wait(until.elementLocated(By.css("div[role='option']:last-child")), 10000);
            const lastStudentOption = await driver.findElement(By.css("div[role='option']:last-child"));
            console.log('  - Last student option found');

            console.log('📋 Selecting last student option');
            await lastStudentOption.click();
            console.log('  - Last student option selected');

            await driver.sleep(1000);

            console.log('🏫 Looking for Schools combobox button');
            await driver.wait(until.elementLocated(By.xpath("//button[@role='combobox']//span[contains(@class, 'text-muted-foreground') and text()='Schools']")), 10000);
            const allSchoolsComboboxes = await driver.findElements(By.xpath("//button[@role='combobox']//span[contains(@class, 'text-muted-foreground') and text()='Schools']/ancestor::button"));
            console.log(`  - Found ${allSchoolsComboboxes.length} Schools combobox buttons`);


            const schoolsCombobox = allSchoolsComboboxes[allSchoolsComboboxes.length - 1];
            console.log('  - Selected the last Schools combobox button');

            console.log('🏫 Clicking Schools combobox');
            await schoolsCombobox.click();
            console.log('  - Schools combobox clicked');

            await driver.sleep(1000);

            console.log('📋 Looking for first school option');
            await driver.wait(until.elementLocated(By.css("div[role='option']:first-child")), 10000);
            const firstSchoolOption = await driver.findElement(By.css("div[role='option']:first-child"));
            console.log('  - First school option found');

            console.log('📋 Selecting first school option');
            await firstSchoolOption.click();
            console.log('  - First school option selected');

            await driver.sleep(1000);

            console.log('📁 Looking for CSV file input');
            await driver.wait(until.elementLocated(By.css("input[type='file']#csvFile")), 10000);
            const csvFileInput = await driver.findElement(By.css("input[type='file']#csvFile"));
            console.log('  - CSV file input found');

            console.log('📁 Looking for teachers.csv file');
            const teachersFilePath = path.join(__dirname, '..', 'teachers.csv');

            const teachersExists = fs.existsSync(teachersFilePath);

            let csvFilePath;
            if (teachersExists) {
                csvFilePath = teachersFilePath;
                console.log('  - Found teachers.csv');
            } else {
                throw new Error('teachers.csv file not found. Please add teachers.csv to the project root for bulk adding teachers.');
            }

            console.log('📁 Uploading teachers CSV file');
            await csvFileInput.sendKeys(csvFilePath);
            console.log('  - Teachers CSV file uploaded:', csvFilePath);

            await driver.sleep(2000);

            console.log('🔼 Looking for Import Teachers button');
            await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'bg-primary') and (contains(., 'Import Teachers') or contains(., 'Import Students'))]")), 10000);
            const importButton = await driver.findElement(By.xpath("//button[contains(@class, 'bg-primary') and (contains(., 'Import Teachers') or contains(., 'Import Students'))]"));
            console.log('  - Import button found');

            console.log('🔼 Clicking Import button for teachers');
            await importButton.click();
            console.log('  - Import button clicked for teachers');

            console.log('⏳ Waiting for "Teachers imported" or "Users imported" notification');
            await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'text-sm') and contains(@class, 'font-semibold') and (text()='Teachers imported' or text()='Users imported')]")), 15000);
            const notification = await driver.findElement(By.xpath("//div[contains(@class, 'text-sm') and contains(@class, 'font-semibold') and (text()='Teachers imported' or text()='Users imported')]"));
            console.log('  - Teachers import notification confirmed');

            await driver.sleep(2000);

            console.log('✅ Bulk Add Teachers test completed successfully');

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            throw error;
        }
    });
});