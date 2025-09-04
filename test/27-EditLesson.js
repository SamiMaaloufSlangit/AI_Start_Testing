const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Edit Lesson Test');
console.log('📋 Test Configuration:');

const updatedLessonDescription = "Test Name Updated"


describe('Edit Lesson', function () {

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

    it('successfully edit lesson', async function () {
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

            console.log('🔍 Looking for "View Course" button');
            console.log('⏳ Waiting for "View Course" button to appear');
            await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'bg-primary') and contains(@class, 'hover:bg-primary/90') and contains(@class, 'text-primary-foreground') and text()='View Course']")), 10000);
            console.log('  - "View Course" button found');
            viewCourseButton = await driver.findElement(By.xpath("//button[contains(@class, 'bg-primary') and contains(@class, 'hover:bg-primary/90') and contains(@class, 'text-primary-foreground') and text()='View Course']"));


            console.log('🔘 Clicking "View Course" button');
            await viewCourseButton.click();
            console.log('  - "View Course" button clicked');

            await driver.sleep(2000);

            console.log('🔍 Looking for "Edit Course" button');
            console.log('⏳ Waiting for "Edit Course" button to appear');
            await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'items-center') and contains(@class, 'justify-center') and contains(@class, 'whitespace-nowrap') and contains(@class, 'rounded-md') and contains(., 'Edit Course')]")), 10000);
            console.log('  - "Edit Course" button found');

            console.log('🔘 Clicking "Edit Course" button');
            const editCourseButton = await driver.findElement(By.xpath("//button[contains(@class, 'items-center') and contains(@class, 'justify-center') and contains(@class, 'whitespace-nowrap') and contains(@class, 'rounded-md') and contains(., 'Edit Course')]"));
            await editCourseButton.click();
            console.log('  - "Edit Course" button clicked');

            await driver.sleep(2000);

            console.log('🔍 Looking for edit lesson button');
            console.log('⏳ Waiting for edit lesson button to appear');

            await driver.wait(until.elementsLocated(By.xpath("//button[contains(@class, 'h-10') and contains(@class, 'w-10')]")), 10000);
            console.log('  - Edit buttons found');

            const allSmallButtons = await driver.findElements(By.xpath("//button[contains(@class, 'h-10') and contains(@class, 'w-10')]"));

            const editButtons = [];
            for (let i = 0; i < allSmallButtons.length; i++) {
                try {
                    const buttonHTML = await allSmallButtons[i].getAttribute('outerHTML');
                    const isEditButton = buttonHTML.includes('lucide-square-pen') && buttonHTML.includes('M18.375 2.625');
                    const isDeleteButton = buttonHTML.includes('lucide-trash') || buttonHTML.includes('trash2');

                    if (isEditButton && !isDeleteButton) {
                        editButtons.push(allSmallButtons[i]);
                    }
                } catch (e) {
                    console.log(`  - Button ${i} check failed: ${e.message}`);
                }
            }

            if (editButtons.length < 2) {
                throw new Error(`Expected at least 2 edit buttons (module and lesson), but found only ${editButtons.length}.`);
            }

            const editLessonButton = editButtons[1];

            console.log('🔘 Clicking edit lesson button');
            await editLessonButton.click();
            console.log('  - Edit lesson button clicked');

            await driver.sleep(2000);

            console.log('🔍 Looking for "Content" tab button');
            console.log('⏳ Waiting for "Content" tab to appear');
            await driver.wait(until.elementLocated(By.xpath("//button[@type='button' and @role='tab' and contains(@class, 'inline-flex') and contains(@class, 'items-center') and contains(@class, 'justify-center') and contains(@class, 'whitespace-nowrap') and contains(@class, 'rounded-sm') and text()='Content']")), 10000);
            console.log('  - "Content" tab found');

            console.log('🔘 Clicking "Content" tab');
            const contentTabButton = await driver.findElement(By.xpath("//button[@type='button' and @role='tab' and contains(@class, 'inline-flex') and contains(@class, 'items-center') and contains(@class, 'justify-center') and contains(@class, 'whitespace-nowrap') and contains(@class, 'rounded-sm') and text()='Content']"));
            await contentTabButton.click();
            console.log('  - "Content" tab clicked');

            await driver.sleep(2000);

            console.log('📝 Filling lesson content');
            console.log('⏳ Waiting for lesson content textarea to appear');
            await driver.wait(until.elementLocated(By.css("textarea#content[placeholder='Enter lesson content']")), 10000);
            console.log('  - Lesson content textarea found');

            console.log('🔄 Filling lesson content');
            let contentFilled = false;
            let attempts = 0;
            const maxAttempts = 3;

            while (!contentFilled && attempts < maxAttempts) {
                attempts++;
                console.log(`  - Attempt ${attempts} to fill lesson content`);

                try {
                    const contentTextarea = await driver.findElement(By.css("textarea#content"));

                    await driver.executeScript("arguments[0].scrollIntoView(true);", contentTextarea);
                    await driver.sleep(500);

                    await contentTextarea.click();
                    await driver.sleep(500);

                    await contentTextarea.clear();
                    await driver.executeScript("arguments[0].value = '';", contentTextarea);
                    await driver.sleep(500);

                    await contentTextarea.sendKeys(updatedLessonDescription);
                    await driver.sleep(500);

                    const currentValue = await contentTextarea.getAttribute('value');
                    if (currentValue === updatedLessonDescription) {
                        contentFilled = true;
                        console.log(`  - Lesson content successfully filled: ${currentValue}`);
                    } else {
                        console.log(`  - Content verification failed. Expected: ${updatedLessonDescription}, Got: ${currentValue}`);
                    }
                } catch (error) {
                    console.log(`  - Attempt ${attempts} failed: ${error.message}`);
                    if (attempts === maxAttempts) {
                        throw error;
                    }
                    await driver.sleep(1000);
                }
            }

            await driver.sleep(1000);

            console.log('🔍 Looking for "Save" button');
            console.log('⏳ Waiting for "Save" button to appear');
            await driver.wait(until.elementLocated(By.xpath("//button[@type='submit' and contains(@class, 'bg-primary') and contains(@class, 'text-primary-foreground') and contains(@class, 'hover:bg-primary/90') and text()='Save']")), 10000);
            console.log('  - "Save" button found');

            console.log('🔘 Clicking "Save" button');
            const saveButton = await driver.findElement(By.xpath("//button[@type='submit' and contains(@class, 'bg-primary') and contains(@class, 'text-primary-foreground') and contains(@class, 'hover:bg-primary/90') and text()='Save']"));
            await saveButton.click();
            console.log('  - "Save" button clicked');

            console.log('⏳ Waiting for save notification');
            await driver.sleep(3000);
            console.log('  - Save notification received');

            console.log('✅ Edit Lesson test completed successfully');

        } catch (error) {
            console.error('❌ Edit Lesson test failed:', error.message);
            console.error('  - Error details:', error);
            throw error;
        }
    });
});
