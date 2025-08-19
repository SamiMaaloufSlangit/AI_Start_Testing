const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const accountManager = require('./config/accountManager');

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.static('public'));
app.use('/reports', express.static('Testreports'));

const testScripts = {
    'login': { name: 'Login Test', script: '00-login', file: 'LoginReport.html' },
    'otp-verification': { name: 'OTP Verification Test', script: '01-ForgetPassOTP', file: 'OTPVerificationReport.html' },
    'add-admin': { name: 'Add Admin Test', script: '02-addAdmin', file: 'AddAdminReport.html' },
    'change-password': { name: 'Change Password Test', script: '03-changePassword', file: 'ChangePasswordReport.html' },
    'course-search': { name: 'Course Search Test', script: '04-courseSearch', file: 'CourseSearchReport.html' },
    'create-delete-course': { name: 'Create and Delete Course Test', script: '05-createDeleteCourse', file: 'CreateDeleteCourseReport.html' },
    'course-enroll-leave': { name: 'Course Enroll and Leave Test', script: '06-courseEnrollLeave', file: 'CourseEnrollLeaveReport.html' },
    'add-notes': { name: 'Add Notes Test', script: '07-EenrollAddNotes', file: 'AddDeleteNotesReport.html' },
    'ai-notes-summary-download': { name: 'AI Notes Summary & Download Test', script: '08-aiNotesSummaryDownload', file: 'AiNotesSummaryDownloadReport.html' },
    'chat-course': { name: 'Chat Course Test', script: '09-ChatCourse', file: 'ChatCourseReport.html' },
    'mark-complete': { name: 'Mark Complete Test', script: '10-markComplete', file: 'MarkCompleteReport.html' }
};

let currentTestRun = null;
let testLogs = new Map();
let liveLogBuffer = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/tests', (req, res) => {
    res.json(testScripts);
});

app.get('/api/accounts', (req, res) => {
    res.json({
        available: ['teacher', 'admin', 'student'],
        current: accountManager.currentAccount || 'teacher'
    });
});

app.post('/api/run-tests', async (req, res) => {
    const { selectedTests, selectedAccount } = req.body;

    if (!selectedTests || selectedTests.length === 0) {
        return res.status(400).json({ error: 'No tests selected' });
    }

    // Validate and set the selected account
    const validAccounts = ['teacher', 'admin', 'student'];
    const accountToUse = selectedAccount && validAccounts.includes(selectedAccount) ? selectedAccount : 'teacher';

    try {
        accountManager.setAccount(accountToUse);
        console.log(`Account set to: ${accountToUse}`);
        console.log(`Using credentials for: ${accountManager.getCurrentAccount().email}`);
    } catch (error) {
        return res.status(400).json({ error: `Invalid account type: ${accountToUse}` });
    }

    if (currentTestRun) {
        return res.status(409).json({ error: 'Tests are already running' });
    }

    currentTestRun = {
        tests: selectedTests,
        results: [],
        currentIndex: 0,
        startTime: new Date(),
        currentTestProgress: 0,
        selectedAccount: accountToUse
    };

    testLogs.clear();
    liveLogBuffer = [];

    selectedTests.forEach(testKey => {
        testLogs.set(testKey, []);
        addLogEntry(testKey, `🔄 Test ${testScripts[testKey]?.name} queued for execution using ${accountToUse} account...`);
    });

    // Add initial account setup log
    addLogEntry('system', `🔐 Account configured: ${accountToUse} (${accountManager.getCurrentAccount().email})`, 'info');

    res.json({ message: 'Tests started', runId: Date.now() });

    for (let i = 0; i < selectedTests.length; i++) {
        const testKey = selectedTests[i];
        const test = testScripts[testKey];

        if (!test) continue;

        if (currentTestRun) {
            currentTestRun.currentIndex = i;
            currentTestRun.currentTestProgress = 0;
        }

        try {
            addLogEntry(testKey, `🚀 Starting test execution: ${test.name}`, 'info');
            addLogEntry(testKey, `📋 Test script: ${test.script}`, 'info');
            addLogEntry(testKey, `📊 Progress: ${i + 1}/${selectedTests.length} tests`, 'info');

            const result = await runTest(test.script, testKey);

            const status = result.success ? 'passed' : 'failed';
            const durationText = `${Math.round(result.duration / 1000)}s`;

            if (result.success) {
                addLogEntry(testKey, `✅ Test completed successfully in ${durationText}`, 'success');
                addLogEntry(testKey, `📊 Test report generated: ${test.file}`, 'success');
                addLogEntry(testKey, `🎯 All assertions passed - test execution complete`, 'success');
            } else {
                addLogEntry(testKey, `❌ Test failed after ${durationText}`, 'error');
                if (result.errorOutput) {
                    addLogEntry(testKey, `💥 Error details: ${result.errorOutput.slice(0, 500)}...`, 'error');
                }
                addLogEntry(testKey, `📊 Error report generated: ${test.file}`, 'error');
            }

            if (currentTestRun && currentTestRun.results) {
                currentTestRun.results.push({
                    test: testKey,
                    name: test.name,
                    status: status,
                    duration: result.duration,
                    reportFile: test.file,
                    output: result.output,
                    error: result.success ? null : result.errorOutput,
                    exitCode: result.exitCode,
                    logs: testLogs.get(testKey) || []
                });
            }
        } catch (error) {
            addLogEntry(testKey, `💥 Test execution error: ${error.message}`, 'error');
            if (currentTestRun && currentTestRun.results) {
                currentTestRun.results.push({
                    test: testKey,
                    name: test.name,
                    status: 'error',
                    error: error.message,
                    reportFile: test.file,
                    logs: testLogs.get(testKey) || []
                });
            }
        }
    }

    if (currentTestRun) {
        currentTestRun.endTime = new Date();
    }
    setTimeout(() => { currentTestRun = null; }, 60000);
});

let lastCompletedTestRun = null;

app.get('/api/status', (req, res) => {
    if (!currentTestRun) {
        if (lastCompletedTestRun) {
            return res.json({
                running: false,
                results: lastCompletedTestRun.results,
                startTime: lastCompletedTestRun.startTime,
                endTime: lastCompletedTestRun.endTime,
                completed: true,
                logs: lastCompletedTestRun.logs || [],
                currentTestProgress: 100
            });
        }
        return res.json({ running: false });
    }

    const allTestsCompleted = currentTestRun.endTime &&
        currentTestRun.results.length === currentTestRun.tests.length;

    if (allTestsCompleted) {
        const completedResults = {
            running: false,
            results: currentTestRun.results,
            startTime: currentTestRun.startTime,
            endTime: currentTestRun.endTime,
            completed: true,
            logs: liveLogBuffer,
            currentTestProgress: 100
        };

        lastCompletedTestRun = {
            results: currentTestRun.results,
            startTime: currentTestRun.startTime,
            endTime: currentTestRun.endTime,
            logs: [...liveLogBuffer]
        };

        setTimeout(() => {
            currentTestRun = null;
        }, 5000);

        return res.json(completedResults);
    }

    res.json({
        running: true,
        currentIndex: currentTestRun.currentIndex,
        totalTests: currentTestRun.tests.length,
        tests: currentTestRun.tests,
        results: currentTestRun.results,
        startTime: currentTestRun.startTime,
        endTime: currentTestRun.endTime,
        currentTestProgress: currentTestRun.currentTestProgress || 0,
        logs: liveLogBuffer.slice(-50)
    });
});

function runTest(scriptName, testKey) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        console.log(`Starting test: ${scriptName}`);

        // Run the test file with Mocha
        const child = spawn('npx', ['mocha', `test/${scriptName}.js`], {
            stdio: ['pipe', 'pipe', 'pipe'],
            shell: true,
            detached: false,
            env: {
                ...process.env,
                NODE_ENV: 'test',
                SELECTED_ACCOUNT: currentTestRun ? currentTestRun.selectedAccount : 'teacher'
            }
        });

        let output = '';
        let errorOutput = '';
        let isResolved = false;
        let progressInterval;

        const cleanup = () => {
            if (progressInterval) {
                clearInterval(progressInterval);
                progressInterval = null;
            }
        };

        let progress = 0;
        progressInterval = setInterval(() => {
            if (currentTestRun && !isResolved) {
                progress = Math.min(progress + Math.random() * 15, 95);
                currentTestRun.currentTestProgress = progress;
            }
        }, 2000);

        child.stdout.on('data', (data) => {
            const chunk = data.toString();
            output += chunk;

            const lines = chunk.trim().split('\n');
            lines.forEach(line => {
                if (line.trim()) {
                    if (line.includes('✓') || line.includes('✔')) {
                        addLogEntry(testKey, `✅ ${line.trim()}`, 'success');
                    } else if (line.includes('✗') || line.includes('✖') || line.includes('Error')) {
                        addLogEntry(testKey, `❌ ${line.trim()}`, 'error');
                    } else if (line.includes('Chrome') || line.includes('Driver')) {
                        addLogEntry(testKey, `🔧 ${line.trim()}`, 'info');
                    } else {
                        addLogEntry(testKey, `📋 ${line.trim()}`, 'info');
                    }
                }
            });

            console.log(`[${scriptName}] STDOUT:`, chunk.trim());
        });

        child.stderr.on('data', (data) => {
            const chunk = data.toString();
            errorOutput += chunk;

            const lines = chunk.trim().split('\n');
            lines.forEach(line => {
                if (line.trim() && !line.includes('DeprecationWarning')) {
                    addLogEntry(testKey, `⚠️ ${line.trim()}`, 'warning');
                }
            });

            console.log(`[${scriptName}] STDERR:`, chunk.trim());
        });

        child.on('close', (code, signal) => {
            if (isResolved) return;
            isResolved = true;
            cleanup();

            if (currentTestRun) {
                currentTestRun.currentTestProgress = 100;
            }

            const duration = Date.now() - startTime;
            console.log(`Test ${scriptName} completed with code ${code}, signal ${signal} after ${duration}ms`);

            const testKey = Object.keys(testScripts).find(key => testScripts[key].script === scriptName);
            if (testKey) {
                if (code === 0) {
                    addLogEntry(testKey, `🏁 Test execution finished with exit code 0`, 'success');
                    addLogEntry(testKey, `⏱️ Total execution time: ${Math.round(duration / 1000)}s`, 'info');
                } else {
                    addLogEntry(testKey, `🏁 Test execution finished with exit code ${code}`, 'error');
                    addLogEntry(testKey, `⏱️ Total execution time: ${Math.round(duration / 1000)}s`, 'info');
                }
            }

            if (code === 0) {
                resolve({ success: true, duration, output });
            } else {
                resolve({ success: false, duration, output, errorOutput, exitCode: code, signal });
            }
        });

        child.on('error', (error) => {
            if (isResolved) return;
            isResolved = true;
            cleanup();

            if (currentTestRun) {
                currentTestRun.currentTestProgress = 100;
            }

            console.error(`Test ${scriptName} error:`, error);
            reject(error);
        });
    });
}

function addLogEntry(testKey, message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
        timestamp,
        message,
        type,
        testKey
    };

    if (!testLogs.has(testKey)) {
        testLogs.set(testKey, []);
    }

    testLogs.get(testKey).push(logEntry);
    liveLogBuffer.push(logEntry);

    if (liveLogBuffer.length > 1000) {
        liveLogBuffer = liveLogBuffer.slice(-1000);
    }

    console.log(`[${testKey}] ${message}`);
}

app.get('/api/logs', (req, res) => {
    const { testKey, since } = req.query;

    if (testKey) {
        const logs = testLogs.get(testKey) || [];
        return res.json(logs);
    }

    let logs = liveLogBuffer;
    if (since) {
        const sinceTime = new Date(since);
        logs = logs.filter(log => new Date(log.timestamp) > sinceTime);
    }

    res.json(logs);
});

app.listen(port, () => {
    console.log(`Test interface server running at http://localhost:${port}`);
});
