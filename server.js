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
    'login': { name: 'Login Test', script: '00-login', file: 'LoginReport.html', category: 'authentication' },
    'otp-verification': { name: 'OTP Verification Test', script: '01-ForgetPassOTP', file: 'OTPVerificationReport.html', category: 'authentication' },
    'add-admin': { name: 'Add Admin Test', script: '02-addAdmin', file: 'AddAdminReport.html', category: 'admin-management' },
    'edit-admin': { name: 'Edit Admin Test', script: '03-EditAdmin', file: 'EditAdminReport.html', category: 'admin-management' },
    'delete-admin': { name: 'Delete Admin Test', script: '04-DeleteAdmin', file: 'DeleteAdminReport.html', category: 'admin-management' },
    'change-password': { name: 'Change Password Test', script: '05-changePassword', file: 'ChangePasswordReport.html', category: 'authentication' },
    'course-search': { name: 'Course Search Test', script: '06-courseSearch', file: 'CourseSearchReport.html', category: 'course-management' },
    'create-delete-course': { name: 'Create and Delete Course Test', script: '07-createDeleteCourse', file: 'CreateDeleteCourseReport.html', category: 'course-management' },
    'course-enroll-leave': { name: 'Course Enroll and Leave Test', script: '08-courseEnrollLeave', file: 'CourseEnrollLeaveReport.html', category: 'course-management' },
    'add-notes': { name: 'Add Notes Test', script: '09-AddNotes', file: 'AddNotesReport.html', category: 'course-content' },
    'ai-notes-summary-download': { name: 'AI Notes Summary & Download Test', script: '10-aiNotesSummaryDownload', file: 'AiNotesSummaryDownloadReport.html', category: 'course-content' },
    'chat-course': { name: 'Chat Course Test', script: '11-ChatCourse', file: 'ChatCourseReport.html', category: 'course-content' },
    'mark-complete': { name: 'Mark Complete Test', script: '12-markComplete', file: 'MarkCompleteReport.html', category: 'course-content' },
    'enrolled-course-nb': { name: 'Enrolled Course Count Test', script: '13-EnrolledCourseNB', file: 'EnrolledCourseNBReport.html', category: 'course-management' },
    'add-teacher': { name: 'Add Teacher Test', script: '14-AddTeacher', file: 'AddTeacherReport.html', category: 'teacher-management' },
    'edit-delete-teacher': { name: 'Edit and Delete Teacher Test', script: '15-EditDeleteTeacher', file: 'EditDeleteTeacherReport.html', category: 'teacher-management' },
    'export-teachers': { name: 'Export Teachers Test', script: '16-ExportTeachers', file: 'ExportTeachersReport.html', category: 'teacher-management' },
    'bulk-add-teachers': { name: 'Bulk Add Teachers Test', script: '17-BulkAddTeacher', file: 'BulkAddTeachersReport.html', category: 'teacher-management' },
    'search-filter-teachers': { name: 'Search & Filter Teachers Test', script: '18-SearchFilterTeachers', file: 'SearchFilterTeachersReport.html', category: 'teacher-management' },
    'resources': { name: 'Resources Test', script: '19-Resources', file: 'ResourcesReport.html', category: 'course-content' },
    'add-student': { name: 'Add Student Test', script: '20-AddStudent', file: 'AddStudentReport.html', category: 'student-management' },
    'edit-delete-student': { name: 'Edit and Delete Student Test', script: '21-EditDeleteStudent', file: 'EditDeleteStudentReport.html', category: 'student-management' },
    'bulk-add-students': { name: 'Bulk Add Students Test', script: '22-BulkAddStudents', file: 'BulkAddStudentsReport.html', category: 'student-management' },
    'view-all-courses-student': { name: 'View All Courses Student Test', script: '23-ViewAllCoursesStudent', file: 'ViewAllCoursesStudentReport.html', category: 'student-management' },
    'upload-content-bulk': { name: 'Upload Content Bulk Test', script: '24-UploadContentBulk', file: 'UploadContentBulkReport.html', category: 'course-content' },
    'add-module': { name: 'Add Module Test', script: '25-AddModule', file: 'AddModuleReport.html', category: 'course-content' },
    'add-lesson': { name: 'Add Lesson Test', script: '26-AddLesson', file: 'AddLessonReport.html', category: 'course-content' },
    'edit-lesson': { name: 'Edit Lesson Test', script: '27-EditLesson', file: 'EditLessonReport.html', category: 'course-content' },
    'delete-module': { name: 'Delete Module Test', script: '28-DeleteModule', file: 'DeleteModuleReport.html', category: 'course-content' },
    'course-clone': { name: 'Course Clone Test', script: '29-CourseClone', file: 'CourseCloneReport.html', category: 'course-management' },
    'student-dashboard-cards': { name: 'Student Dashboard Cards Test', script: '30-StudentDashboardCards', file: 'StudentDashboardCardsReport.html', category: 'student-management' },
    'add-subjects': { name: 'Add Subjects Test', script: '31-AddSubjects', file: 'AddSubjectsReport.html', category: 'course-management' },
    'edit-subject': { name: 'Edit Subject Test', script: '32-EditSubject', file: 'EditSubjectReport.html', category: 'course-management' },
    'delete-subject': { name: 'Delete Subject Test', script: '33-DeleteSubject', file: 'DeleteSubjectReport.html', category: 'course-management' }
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
        available: ['teacher', 'admin', 'student', 'grade11'],
        current: accountManager.currentAccount || 'teacher'
    });
});

app.post('/api/run-tests', async (req, res) => {
    const { selectedTests, selectedAccount } = req.body;

    if (!selectedTests || selectedTests.length === 0) {
        return res.status(400).json({ error: 'No tests selected' });
    }

    const validAccounts = ['teacher', 'admin', 'student', 'grade11'];
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

        const reportFileName = testScripts[testKey].file.replace('.html', '');
        const child = spawn('npx', ['mocha', `test/${scriptName}.js`, '--reporter', 'mochawesome', '--reporter-options', `reportDir=Testreports,reportFilename=${reportFileName},quiet=true`], {
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
