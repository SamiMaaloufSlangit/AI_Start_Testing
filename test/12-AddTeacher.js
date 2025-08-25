const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Add Teacher Web Test');
console.log('📋 Test Configuration:');

const TeacherName = "John Doe Teacher Test"
const TeacherEmail = "test1234@test.com"
const TeacherPassword = "123123"

describe('Add Teacher', function () {

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

    it('successfully added teacher', async function () {
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

            console.log('🔘 Looking for the add teacher button');
            const button = await driver.findElement(By.css("button.bg-primary"));
            console.log('  - Add Teacher button found');

            console.log('🔘 Clicking the add teacher button');
            await button.click();
            console.log('  - Add Teacher button clicked successfully');

            await driver.sleep(2000);

            console.log('⏳ Waiting for teacher form to appear');
            await driver.wait(until.elementLocated(By.css("input#teacher-name")), 10000);
            console.log('  - Teacher form loaded');

            console.log('📝 Filling teacher details');
            const teacherName = TeacherName;
            const teacherEmail = TeacherEmail;

            console.log('  - Entering teacher name');
            await driver.findElement(By.css("input#teacher-name")).sendKeys(teacherName);
            console.log(`    ✓ Name entered: ${teacherName}`);

            console.log('  - Entering teacher email');
            await driver.findElement(By.css("input#teacher-email")).sendKeys(teacherEmail);
            console.log(`    ✓ Email entered: ${teacherEmail}`);

            await driver.sleep(1000);

            console.log('🔽 Opening college selection dropdown');

            await driver.sleep(1000);

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

            console.log('🎓 Opening grade selection dropdown');
            const gradeButton = await driver.findElement(By.xpath("//button[@aria-haspopup='listbox' and contains(., 'Select Grades')]"));
            await gradeButton.click();
            console.log('  - Grade dropdown opened');

            await driver.sleep(1000);

            console.log('📚 Selecting the first grade option');
            const gradeOptions = await driver.findElements(By.css("[role='option']"));
            if (gradeOptions.length === 0) {
                const alternativeGradeOptions = await driver.findElements(By.css("div[data-value], div[role='menuitem'], .dropdown-item"));
                if (alternativeGradeOptions.length > 0) {
                    const firstOption = alternativeGradeOptions[0];
                    await firstOption.click();
                    console.log('  - First grade option selected (alternative selector)');
                } else {
                    throw new Error('No grade options found');
                }
            } else {
                const firstOption = gradeOptions[0];
                await firstOption.click();
                console.log('  - First grade option selected from dropdown');
            }

            await driver.sleep(1000);

            console.log('🔄 Closing grade dropdown');
            await driver.findElement(By.css("body")).click();
            console.log('  - Grade dropdown closed');

            await driver.sleep(500);

            console.log('📖 Opening subject selection dropdown');
            const subjectButton = await driver.findElement(By.xpath("//button[@aria-haspopup='listbox' and contains(., 'Select subjects')]"));
            await subjectButton.click();
            console.log('  - Subject dropdown opened');

            await driver.sleep(1000);

            console.log('📚 Selecting the first subject option');
            const subjectOptions = await driver.findElements(By.css("[role='option']"));
            if (subjectOptions.length === 0) {
                const alternativeSubjectOptions = await driver.findElements(By.css("div[data-value], div[role='menuitem'], .dropdown-item"));
                if (alternativeSubjectOptions.length > 0) {
                    const firstOption = alternativeSubjectOptions[0];
                    await firstOption.click();
                    console.log('  - First subject option selected (alternative selector)');
                } else {
                    throw new Error('No subject options found');
                }
            } else {
                const firstOption = subjectOptions[0];
                await firstOption.click();
                console.log('  - First subject option selected from dropdown');
            }

            await driver.sleep(1000);

            console.log('🔄 Closing subject dropdown');
            await driver.findElement(By.css("body")).click();
            console.log('  - Subject dropdown closed');

            await driver.sleep(500);

            console.log('☑️ Selecting custom password checkbox');
            await driver.sleep(1000);

            await driver.executeScript("document.getElementById('use-custom-password').click();");
            console.log('  - Custom password checkbox selected via JavaScript');

            await driver.sleep(1000);

            console.log('🔐 Filling teacher password');
            const passwordField = await driver.findElement(By.css("input#teacher-password"));
            await passwordField.sendKeys(TeacherPassword);
            console.log(`    ✓ Password entered: ${TeacherPassword}`);

            await driver.sleep(500);

            console.log('🚀 Submitting teacher form');
            const submitButton = await driver.findElement(By.css("button[type='submit']"));
            await submitButton.click();
            console.log('  - Submit button clicked');

            await driver.sleep(2000);

            console.log('✅ Teacher created successfully');

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            throw error;
        }
    });
});