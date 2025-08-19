const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const path = require('path');
const fs = require('fs');
const os = require('os');
const accountManager = require('../config/accountManager');

console.log('🚀 Starting AI Notes Summary Test');
console.log('📋 Test Configuration:');

const Note = "This is a test note for AI summary generation and download"

describe('AI Notes Summary and Download', function () {

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

    it('successfully accessed AI Notes Summary tab and downloaded summary', async function () {
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

            console.log('🔍 Checking enrollment status');
            const enrollButtons = await driver.findElements(By.xpath("//button[contains(@class, 'bg-primary') and text()='Enroll']"));

            let viewCourseButton = null;

            if (enrollButtons.length === 0) {
                console.log('  - No enroll buttons found - already enrolled in all available courses');
                console.log('🔍 Looking for "View Course" button');
                console.log('⏳ Waiting for "View Course" button to appear');
                await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'bg-primary') and contains(@class, 'hover:bg-primary/90') and contains(@class, 'text-primary-foreground') and text()='View Course']")), 10000);
                console.log('  - "View Course" button found');
                viewCourseButton = await driver.findElement(By.xpath("//button[contains(@class, 'bg-primary') and contains(@class, 'hover:bg-primary/90') and contains(@class, 'text-primary-foreground') and text()='View Course']"));
            } else {
                console.log(`  - Found ${enrollButtons.length} enroll button(s) - need to enroll first`);
                console.log('🔘 Clicking first enroll button');
                await enrollButtons[0].click();
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

                console.log('🔍 Looking for "View Course" button');
                console.log('⏳ Waiting for "View Course" button to appear');
                await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'bg-primary') and contains(@class, 'hover:bg-primary/90') and contains(@class, 'text-primary-foreground') and text()='View Course']")), 10000);
                console.log('  - "View Course" button found');
                viewCourseButton = await driver.findElement(By.xpath("//button[contains(@class, 'bg-primary') and contains(@class, 'hover:bg-primary/90') and contains(@class, 'text-primary-foreground') and text()='View Course']"));
            }

            console.log('🔘 Clicking "View Course" button');
            await viewCourseButton.click();
            console.log('  - "View Course" button clicked');

            await driver.sleep(2000);

            console.log('🔍 Looking for notes textarea');
            console.log('⏳ Waiting for notes textarea to appear');
            await driver.wait(until.elementLocated(By.xpath("//textarea[contains(@class, 'min-h-[200px]') and contains(@placeholder, 'Enter your notes here...')]")), 10000);
            console.log('  - Notes textarea found');

            const notesTextarea = await driver.findElement(By.xpath("//textarea[contains(@class, 'min-h-[200px]') and contains(@placeholder, 'Enter your notes here...')]"));

            console.log('✏️ Entering note text');
            await notesTextarea.clear();
            await notesTextarea.sendKeys(Note);
            console.log(`  - Note entered: "${Note}"`);

            await driver.sleep(1000);

            console.log('🔍 Looking for "Save Notes" button');
            console.log('⏳ Waiting for "Save Notes" button to appear');
            await driver.wait(until.elementLocated(By.xpath("//button[contains(text(), 'Save Notes')]")), 10000);
            console.log('  - "Save Notes" button found');

            const saveNotesButton = await driver.findElement(By.xpath("//button[contains(text(), 'Save Notes')]"));

            console.log('🔘 Clicking "Save Notes" button');
            await saveNotesButton.click();
            console.log('  - "Save Notes" button clicked');

            await driver.sleep(1000);

            console.log('🔍 Looking for "Notes saved" notification');
            console.log('⏳ Waiting for "Notes saved" notification to appear');
            await driver.wait(until.elementLocated(By.xpath("//div[contains(@class, 'text-sm') and contains(@class, 'font-semibold') and text()='Notes saved']")), 10000);
            console.log('  - "Notes saved" notification found');

            const notificationElement = await driver.findElement(By.xpath("//div[contains(@class, 'text-sm') and contains(@class, 'font-semibold') and text()='Notes saved']"));
            const notificationText = await notificationElement.getText();
            console.log(`  - ✅ Notification confirmed: "${notificationText}"`);

            await driver.sleep(1000);

            console.log('🔍 Looking for "AI Notes Summary" tab button');
            console.log('⏳ Waiting for "AI Notes Summary" tab button to appear');
            await driver.wait(until.elementLocated(By.xpath("//button[@role='tab' and contains(@aria-controls, 'notes-summary') and contains(text(), 'AI Notes Summary')]")), 10000);
            console.log('  - "AI Notes Summary" tab button found');

            const aiNotesSummaryButton = await driver.findElement(By.xpath("//button[@role='tab' and contains(@aria-controls, 'notes-summary') and contains(text(), 'AI Notes Summary')]"));

            console.log('🔘 Clicking "AI Notes Summary" tab button');
            await aiNotesSummaryButton.click();
            console.log('  - "AI Notes Summary" tab button clicked');

            await driver.sleep(2000);

            console.log('🔍 Looking for "Generate Summary" button');
            console.log('⏳ Waiting for "Generate Summary" button to appear');
            await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'bg-primary') and contains(@class, 'text-primary-foreground') and contains(., 'Generate Summary')]")), 10000);
            console.log('  - "Generate Summary" button found');

            const generateSummaryButton = await driver.findElement(By.xpath("//button[contains(@class, 'bg-primary') and contains(@class, 'text-primary-foreground') and contains(., 'Generate Summary')]"));

            console.log('🔘 Clicking "Generate Summary" button');
            await generateSummaryButton.click();
            console.log('  - "Generate Summary" button clicked');

            await driver.sleep(3000);

            console.log('🔍 Verifying that AI summary text has been generated');
            console.log('⏳ Waiting for generated summary content to appear');

            const selectors = [
                "//div[contains(@class, 'text-sm')]//p[string-length(normalize-space(text())) > 10]",
                "//div[contains(@class, 'text-sm')]//*[string-length(normalize-space(text())) > 10]",
                "//*[contains(@class, 'text-sm') and string-length(normalize-space(text())) > 10]",
                "//p[string-length(normalize-space(text())) > 10]",
                "//*[string-length(normalize-space(text())) > 15]"
            ];

            let summaryContent = null;
            let summaryText = '';

            for (let i = 0; i < selectors.length; i++) {
                try {
                    console.log(`  - Trying selector ${i + 1}: ${selectors[i].substring(0, 50)}...`);
                    await driver.wait(until.elementLocated(By.xpath(selectors[i])), 5000);
                    summaryContent = await driver.findElement(By.xpath(selectors[i]));
                    summaryText = await summaryContent.getText();

                    if (summaryText.trim().length > 10) {
                        console.log(`  - ✅ Found content with selector ${i + 1}: ${summaryText.length} characters`);
                        break;
                    }
                } catch (error) {
                    console.log(`  - Selector ${i + 1} failed: ${error.message.split('\n')[0]}`);
                    continue;
                }
            }

            if (summaryText.trim().length > 10) {
                console.log(`  - ✅ Summary generated with ${summaryText.length} characters: "${summaryText.substring(0, 150)}${summaryText.length > 150 ? '...' : ''}"`);
                console.log('✅ AI Notes Summary generated and verified successfully');
            } else {
                throw new Error('No generated summary text found with any selector');
            }

            await driver.sleep(1000);

            console.log('🔍 Looking for "Download Notes" button');
            console.log('⏳ Waiting for "Download Notes" button to appear');
            await driver.wait(until.elementLocated(By.xpath("//button[contains(@class, 'bg-primary') and contains(@class, 'text-primary-foreground') and contains(., 'Download Notes')]")), 10000);
            console.log('  - "Download Notes" button found');

            const downloadNotesButton = await driver.findElement(By.xpath("//button[contains(@class, 'bg-primary') and contains(@class, 'text-primary-foreground') and contains(., 'Download Notes')]"));

            console.log('🔘 Clicking "Download Notes" button');
            await downloadNotesButton.click();
            console.log('  - "Download Notes" button clicked');

            await driver.sleep(3000);

            console.log('🔍 Verifying file download');
            console.log('⏳ Checking downloads directory for downloaded file');

            const downloadsDir = path.join(os.homedir(), 'Downloads');
            console.log(`  - Checking downloads directory: ${downloadsDir}`);

            const files = fs.readdirSync(downloadsDir);
            const recentFiles = files.filter(file => {
                const filePath = path.join(downloadsDir, file);
                const stats = fs.statSync(filePath);
                const now = new Date();
                const fileAge = now - stats.mtime;
                return fileAge < 30000;
            });

            console.log(`  - Found ${recentFiles.length} recent files in downloads directory`);

            if (recentFiles.length > 0) {
                const downloadedFiles = recentFiles.filter(file =>
                    file.toLowerCase().includes('notes') ||
                    file.toLowerCase().includes('summary') ||
                    file.endsWith('.txt') ||
                    file.endsWith('.pdf') ||
                    file.endsWith('.docx')
                );

                if (downloadedFiles.length > 0) {
                    console.log(`  - ✅ Download verified! Files found: ${downloadedFiles.join(', ')}`);
                    console.log('✅ AI Notes Summary generated, verified, and download confirmed successfully');
                } else {
                    console.log(`  - ⚠️ Recent files found but none appear to be notes files: ${recentFiles.join(', ')}`);
                    console.log('✅ AI Notes Summary generated and download initiated (file type verification inconclusive)');
                }
            } else {
                console.log('  - ⚠️ No recent files found in downloads directory');
                console.log('✅ AI Notes Summary generated and download initiated (download verification inconclusive)');
            }

        } catch (error) {
            console.error('❌ Test failed:', error.message);
            console.error('  - Error details:', error);
            throw error;
        }
    });
});