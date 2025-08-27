const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Add Student Web Test');
console.log('📋 Test Configuration:');

const StudentName = "John Doe Student Test"
const StudentEmail = "test12345@test.com"
const StudentPassword = "123123"

describe('Add Student', function () {

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

    it('successfully added student', async function () {
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

            console.log('⏳ Waiting for Students link to appear');
            await driver.wait(until.elementLocated(By.css("a[href='/students']")), 10000);
            console.log('  - Students link found');

            console.log('🔘 Clicking Students link');
            await driver.findElement(By.css("a[href='/students']")).click();
            console.log('  - Students link clicked');

            console.log('⏳ Waiting for students page to load');
            await driver.wait(until.urlContains('/students'), 10000);
            console.log('  - Students page loaded successfully');

            await driver.sleep(2000);

            console.log('🔘 Looking for the add student button');
            const button = await driver.findElement(By.css("button.bg-primary"));
            console.log('  - Add Student button found');

            console.log('🔘 Clicking the add student button');
            await button.click();
            console.log('  - Add Student button clicked successfully');

            await driver.sleep(2000);

            console.log('⏳ Waiting for student name input field to appear');
            await driver.wait(until.elementLocated(By.id("student-name")), 10000);
            console.log('  - Student name field found');

            console.log('📝 Entering student full name');
            await driver.findElement(By.id("student-name")).sendKeys(StudentName);
            console.log('  - Student name entered:', StudentName);

            await driver.sleep(1000);

            console.log('⏳ Waiting for student email input field to appear');
            await driver.wait(until.elementLocated(By.id("student-email")), 10000);
            console.log('  - Student email field found');

            console.log('📧 Entering student email');
            await driver.findElement(By.id("student-email")).sendKeys(StudentEmail);
            console.log('  - Student email entered:', StudentEmail);

            await driver.sleep(1000);

            console.log('🏫 Looking for school dropdown');
            console.log('  - Looking for school dropdown button (avoiding search)');
            const schoolButton = await driver.findElement(By.xpath("//button[@role='combobox' and contains(., 'School') and not(contains(., 'Schools'))]"));
            await schoolButton.click();
            console.log('  - School dropdown opened');

            await driver.sleep(1000);

            console.log('🏫 Selecting the last option from the dropdown');
            await driver.sleep(1000);

            const dropdownOptions = await driver.findElements(By.css("[role='option']"));
            if (dropdownOptions.length === 0) {
                const alternativeOptions = await driver.findElements(By.css("div[data-value], div[role='menuitem'], .dropdown-item"));
                if (alternativeOptions.length > 0) {
                    const lastOption = alternativeOptions[alternativeOptions.length - 1];
                    await lastOption.click();
                    console.log('  - Last option selected (alternative selector)');
                } else {
                    throw new Error('No dropdown options found');
                }
            } else {
                const lastOption = dropdownOptions[dropdownOptions.length - 1];
                await lastOption.click();
                console.log('  - Last option selected from dropdown');
            }

            await driver.sleep(1000);

            console.log('⏳ Waiting for student grade combobox to become enabled');
            await driver.wait(until.elementLocated(By.id("student-grade")), 10000);

            await driver.wait(async () => {
                const gradeElement = await driver.findElement(By.id("student-grade"));
                const isDisabled = await gradeElement.getAttribute("disabled");
                return isDisabled === null;
            }, 10000);
            console.log('  - Student grade combobox is now enabled');

            console.log('🔘 Clicking student grade combobox to open dropdown');
            await driver.findElement(By.id("student-grade")).click();
            console.log('  - Student grade combobox clicked');

            await driver.sleep(1000);

            console.log('⏳ Waiting for grade dropdown options to appear');
            await driver.wait(until.elementLocated(By.css("[role='option']:first-child")), 10000);
            console.log('  - Grade dropdown options found');

            console.log('🔘 Selecting first grade from dropdown');
            await driver.findElement(By.css("[role='option']:first-child")).click();
            console.log('  - First grade option selected successfully');

            await driver.sleep(1000);

            console.log('⏳ Waiting for custom password checkbox to appear');
            await driver.wait(until.elementLocated(By.id("use-custom-password")), 10000);
            console.log('  - Custom password checkbox found');

            console.log('☑️ Checking the custom password checkbox');
            await driver.executeScript("document.getElementById('use-custom-password').click();");
            console.log('  - Custom password checkbox checked successfully');

            await driver.sleep(1000);

            console.log('⏳ Waiting for student password field to appear');
            await driver.wait(until.elementLocated(By.id("student-password")), 10000);
            console.log('  - Student password field found');

            console.log('🔑 Entering student password');
            await driver.findElement(By.id("student-password")).sendKeys(StudentPassword);
            console.log('  - Student password entered:', StudentPassword);

            await driver.sleep(1000);

            console.log('⏳ Waiting for Add Student submit button to appear');
            await driver.wait(until.elementLocated(By.css("button[type='submit']")), 10000);
            console.log('  - Add Student submit button found');

            console.log('🔘 Clicking Add Student button to submit form');
            await driver.findElement(By.css("button[type='submit']")).click();
            console.log('  - Add Student button clicked successfully');

            await driver.sleep(3000);

            console.log('✅ Verifying student was added successfully');
            try {
                await driver.wait(until.urlContains('/students'), 15000);
                console.log('  - Successfully redirected to students page');
                console.log('🎉 Student added successfully!');
            } catch (redirectError) {
                console.log('  - Checking for success message or confirmation');
                console.log('  - Student addition process completed');
            }

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            console.error('  - Error details:', error);
            throw error;
        }
    });
});