const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting Create Course Test');
console.log('📋 Test Configuration:');

const title = "Testing Course"
const description = "This is a test course"


describe('Create Course', function () {

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

    it('successfully created a course', async function () {
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

            console.log('🔍 Looking for "Create Course" button');
            console.log('  - About to wait for Create Course button...');
            await driver.wait(until.elementLocated(By.css("button.inline-flex.items-center.justify-center.whitespace-nowrap.rounded-md.text-sm.font-medium.ring-offset-background.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.h-10.px-4.py-2.self-start.bg-primary.hover\\:bg-primary\\/90.text-primary-foreground")), 10000);
            console.log('  - "Create Course" button found');

            console.log('🔘 Clicking "Create Course" button');
            const createCourseButton = await driver.findElement(By.css("button.inline-flex.items-center.justify-center.whitespace-nowrap.rounded-md.text-sm.font-medium.ring-offset-background.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.h-10.px-4.py-2.self-start.bg-primary.hover\\:bg-primary\\/90.text-primary-foreground"));

            const createButtonText = await createCourseButton.getText();
            const createButtonEnabled = await createCourseButton.isEnabled();
            const createButtonDisplayed = await createCourseButton.isDisplayed();
            console.log(`  - Button properties: text="${createButtonText}", enabled=${createButtonEnabled}, displayed=${createButtonDisplayed}`);

            await createCourseButton.click();
            console.log('  - "Create Course" button clicked');

            await driver.sleep(2000);
            const createButtonUrl = await driver.getCurrentUrl();
            console.log(`  - Current URL after clicking: ${createButtonUrl}`);

            await driver.sleep(2000);

            console.log('🔍 Looking for course title input field');
            await driver.wait(until.elementLocated(By.id("title")), 10000);
            console.log('  - Course title input field found');

            console.log('⌨️ Filling course title');
            const titleInput = await driver.findElement(By.id("title"));
            await titleInput.clear();
            await titleInput.sendKeys(title);
            console.log(`  - Course title entered: ${title}`);

            await driver.sleep(1000);

            console.log('🔍 Looking for course description textarea');
            await driver.wait(until.elementLocated(By.id("description")), 10000);
            console.log('  - Course description textarea found');

            console.log('⌨️ Filling course description');
            const descriptionTextarea = await driver.findElement(By.id("description"));
            await descriptionTextarea.clear();
            await descriptionTextarea.sendKeys(description);
            console.log(`  - Course description entered: ${description}`);

            await driver.sleep(1000);

            console.log('🔍 Looking for Course Grade dropdown button');
            await driver.wait(until.elementLocated(By.id("grade")), 10000);
            console.log('  - Course Grade dropdown button found');

            console.log('🔘 Clicking Course Grade dropdown button');
            const gradeButton = await driver.findElement(By.id("grade"));
            await gradeButton.click();
            console.log('  - Course Grade dropdown button clicked');

            await driver.sleep(1000);

            console.log('🔍 Looking for dropdown options');
            await driver.wait(until.elementLocated(By.css("div[role='option']")), 10000);
            console.log('  - Dropdown options found');

            console.log('🎯 Selecting first grade option');
            const options = await driver.findElements(By.css("div[role='option']"));
            const selectedOption = options[0];
            const optionText = await selectedOption.getText();
            console.log(`  - Selecting option: "${optionText}"`);
            await selectedOption.click();
            console.log(`  - Option "${optionText}" selected successfully`);

            await driver.sleep(1000);

            console.log('🔍 Looking for Teachers dropdown button');
            await driver.wait(until.elementLocated(By.css("button[aria-haspopup='listbox'][data-state='closed']")), 10000);
            console.log('  - Teachers dropdown button found');

            console.log('🔘 Clicking Teachers dropdown button');
            const teachersButton = await driver.findElement(By.css("button[aria-haspopup='listbox'][data-state='closed']"));
            await teachersButton.click();
            console.log('  - Teachers dropdown button clicked');

            await driver.sleep(1000);

            console.log('🔍 Looking for Teachers dropdown options');
            await driver.wait(until.elementLocated(By.css("div[role='option']")), 10000);
            console.log('  - Teachers dropdown options found');

            console.log('🎯 Selecting first teacher option');
            const teacherOptions = await driver.findElements(By.css("div[role='option']"));
            const selectedTeacherOption = teacherOptions[0];
            const teacherOptionText = await selectedTeacherOption.getText();
            console.log(`  - Selecting teacher option: "${teacherOptionText}"`);
            await selectedTeacherOption.click();
            console.log(`  - Teacher option "${teacherOptionText}" selected successfully`);

            await driver.sleep(1000);

            console.log('🔘 Closing dropdown by pressing Escape key');
            await driver.actions().sendKeys(Key.ESCAPE).perform();
            console.log('  - Dropdown closed successfully via Escape key');

            await driver.sleep(1000);

            console.log('📁 Handling file upload directly');
            try {
                const fileInput = await driver.findElement(By.css("input[type='file']"));
                console.log('  - File input element found');

                const path = require('path');
                const testImagePath = "C:\\Users\\samim\\Desktop\\Github Projects\\AISTARTSEL\\test-image.jpg"
                console.log(`  - Uploading file: ${testImagePath}`);

                await fileInput.sendKeys(testImagePath);
                console.log('  - File uploaded successfully');
            } catch (error) {
                console.log('  - Could not find file input element, trying alternative approach');
                const fileInputs = await driver.findElements(By.css("input[type='file']"));
                if (fileInputs.length > 0) {
                    const fileInput = fileInputs[0];
                    const path = require('path');
                    const testImagePath = path.join(__dirname, '..', 'test-image.jpg');
                    console.log(`  - Uploading file using alternative method: ${testImagePath}`);
                    await fileInput.sendKeys(testImagePath);
                    console.log('  - File uploaded successfully');
                } else {
                    console.log('  - No file input elements found');
                }
            }

            await driver.sleep(2000);

            console.log('🔘 File upload completed, continuing with form submission');

            await driver.sleep(1000);

            console.log('🔍 Looking for Create Course submit button');

            await driver.wait(until.elementLocated(By.css("button[type='submit']")), 10000);
            await driver.sleep(1000);

            let submitButton;
            try {
                submitButton = await driver.findElement(By.css("button.inline-flex.items-center.justify-center.whitespace-nowrap.rounded-md.text-sm.font-medium.ring-offset-background.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.h-10.px-4.py-2.bg-primary.hover\\:bg-primary\\/90.text-primary-foreground[type='submit']"));
                console.log('  - Create Course submit button found by exact CSS classes');
            } catch (error) {
                try {
                    submitButton = await driver.findElement(By.css("button.bg-primary.text-primary-foreground[type='submit']"));
                    console.log('  - Create Course submit button found by simplified CSS classes');
                } catch (simplifiedError) {
                    try {
                        submitButton = await driver.findElement(By.xpath("//button[contains(text(), 'Create Course')]"));
                        console.log('  - Create Course submit button found by text content');
                    } catch (textError) {
                        submitButton = await driver.findElement(By.css("button[type='submit']"));
                        console.log('  - Create Course submit button found by type attribute');
                    }
                }
            }

            console.log('🔘 Clicking Create Course submit button');

            const submitButtonText = await submitButton.getText();
            const submitButtonEnabled = await submitButton.isEnabled();
            const submitButtonDisplayed = await submitButton.isDisplayed();
            console.log(`  - Submit button properties: text="${submitButtonText}", enabled=${submitButtonEnabled}, displayed=${submitButtonDisplayed}`);

            if (!submitButtonText.includes('Create Course')) {
                console.log(`  - WARNING: Button text "${submitButtonText}" doesn't contain "Create Course"`);
            }

            await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", submitButton);
            await driver.sleep(1000);
            await submitButton.click();
            console.log('  - Create Course submit button clicked successfully');

            await driver.sleep(3000);

            const currentUrl = await driver.getCurrentUrl();
            console.log(`  - Current URL after submission: ${currentUrl}`);

            console.log('🔍 Looking for success notification');
            let courseCreated = false;

            try {
                await driver.wait(until.elementLocated(By.css("div.text-sm.opacity-90")), 10000);
                console.log('  - Success notification found');

                const notification = await driver.findElement(By.css("div.text-sm.opacity-90"));
                const notificationText = await notification.getText();
                console.log(`  - Notification text: "${notificationText}"`);

                if (notificationText.includes('Course created')) {
                    console.log('✅ Course creation notification verified successfully');
                    courseCreated = true;
                } else if (notificationText.toLowerCase().includes('error') || notificationText.toLowerCase().includes('failed')) {
                    console.log(`❌ Course creation failed with error: "${notificationText}"`);
                    throw new Error(`Course creation failed: ${notificationText}`);
                } else {
                    console.log(`⚠️ Unexpected notification text: "${notificationText}"`);
                }
            } catch (error) {
                if (error.message.includes('Course creation failed')) {
                    throw error;
                }

                console.log('  - No success notification found, checking for alternative selectors');
                try {
                    const altNotification = await driver.findElement(By.xpath("//div[contains(text(), 'Course created')]"));
                    const altNotificationText = await altNotification.getText();
                    console.log(`  - Alternative notification found: "${altNotificationText}"`);
                    console.log('✅ Course creation notification verified successfully');
                    courseCreated = true;
                } catch (altError) {
                    try {
                        const errorSelectors = [
                            "//div[contains(text(), 'error')]",
                            "//div[contains(text(), 'Error')]",
                            "//div[contains(text(), 'failed')]",
                            "//div[contains(text(), 'Failed')]",
                            "//div[contains(text(), 'invalid')]",
                            "//div[contains(text(), 'Invalid')]",
                            ".error",
                            ".alert-error",
                            "[role='alert']"
                        ];

                        for (const selector of errorSelectors) {
                            try {
                                const errorElement = selector.startsWith('.') || selector.startsWith('[')
                                    ? await driver.findElement(By.css(selector))
                                    : await driver.findElement(By.xpath(selector));
                                const errorText = await errorElement.getText();
                                if (errorText.trim()) {
                                    console.log(`❌ Course creation failed with error: "${errorText}"`);
                                    throw new Error(`Course creation failed: ${errorText}`);
                                }
                            } catch (selectorError) {
                            }
                        }
                    } catch (errorCheckError) {
                        if (errorCheckError.message.includes('Course creation failed')) {
                            throw errorCheckError;
                        }
                    }

                    console.log('⚠️ No success notification found - course creation status unclear');
                    throw new Error('Course creation failed: No success message found after course submission');
                }
            }

            if (!courseCreated) {
                console.log('❌ Course creation was not confirmed - stopping test');
                throw new Error('Course creation failed: Success confirmation not received');
            }

            console.log('🔄 Refreshing page after notification check');
            await driver.navigate().refresh();
            console.log('  - Page refreshed successfully');

            await driver.sleep(2000);

            console.log('⏳ Waiting for page to reload completely');
            await driver.wait(until.elementLocated(By.css("body")), 10000);
            console.log('  - Page reloaded successfully');

            await driver.sleep(2000);

            console.log('🗑️ Looking for delete button of the first course (Testing Course)');
            try {
                await driver.wait(until.elementsLocated(By.css("button")), 10000);
                console.log('  - Course cards loaded');

                const courseCards = await driver.findElements(By.css("div[class*='course'], div[class*='card'], div[class*='grid']"));

                if (courseCards.length > 0) {
                    console.log(`  - Found ${courseCards.length} course card(s)`);

                    const firstCourseCard = courseCards[0];

                    const deleteButtons = await firstCourseCard.findElements(By.css("button.inline-flex.items-center.justify-center.whitespace-nowrap.rounded-md.text-sm.font-medium.ring-offset-background.transition-colors.focus-visible\\:outline-none.focus-visible\\:ring-2.focus-visible\\:ring-ring.focus-visible\\:ring-offset-2.disabled\\:pointer-events-none.disabled\\:opacity-50.border.border-input.hover\\:bg-accent.hover\\:text-accent-foreground.h-8.w-8.bg-background\\/80.backdrop-blur-sm"));

                    if (deleteButtons.length > 0) {
                        console.log('  - Delete button found in first course card');

                        const firstDeleteButton = deleteButtons[0];

                        await driver.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", firstDeleteButton);
                        await driver.sleep(1000);

                        console.log('🔘 Clicking the delete button for Testing Course');
                        await firstDeleteButton.click();
                        console.log('  - Delete button clicked successfully');

                        await driver.sleep(2000);

                        console.log('🔍 Looking for confirmation delete button');
                        try {
                            await driver.wait(until.elementLocated(By.css("button.bg-destructive")), 10000);
                            console.log('  - Confirmation delete button found');

                            const confirmDeleteButton = await driver.findElement(By.css("button.bg-destructive"));

                            console.log('🔘 Clicking confirmation delete button');
                            await confirmDeleteButton.click();
                            console.log('  - Confirmation delete button clicked successfully');

                            await driver.sleep(2000);

                            console.log('🔍 Looking for delete success notification');
                            try {
                                await driver.wait(until.elementLocated(By.css("div.grid.gap-1")), 10000);
                                console.log('  - Delete success notification found');

                                const notification = await driver.findElement(By.css("div.grid.gap-1"));
                                const notificationText = await notification.getText();
                                console.log(`  - Notification text: "${notificationText}"`);

                                if (notificationText.includes('Course deleted') || notificationText.includes('deleted successfully')) {
                                    console.log('✅ Course deletion notification verified successfully');
                                } else {
                                    console.log(`⚠️ Unexpected notification text: "${notificationText}"`);
                                }
                            } catch (notificationError) {
                                console.log('  - No delete notification found, checking for alternative selectors');
                                try {
                                    const altNotification = await driver.findElement(By.xpath("//div[contains(text(), 'Course deleted') or contains(text(), 'deleted successfully')]"));
                                    const altNotificationText = await altNotification.getText();
                                    console.log(`  - Alternative notification found: "${altNotificationText}"`);
                                    console.log('✅ Course deletion notification verified successfully');
                                } catch (altError) {
                                    console.log('⚠️ No delete success notification found');
                                }
                            }

                            console.log('✅ Course deletion confirmed and completed');

                        } catch (error) {
                            console.log(`⚠️ Could not find or click confirmation delete button: ${error.message}`);
                        }

                    } else {
                        console.log('⚠️ No delete button found in first course card');
                    }

                } else {
                    console.log('⚠️ No course cards found on the page');
                }

            } catch (error) {
                console.log(`⚠️ Could not find or click delete button: ${error.message}`);
            }

            console.log('✅ Create Course test completed successfully');


        } catch (error) {
            console.error('❌ Test failed:', error.message);
            console.error('  - Error details:', error);
            throw error;
        }
    });
});
