# 🧪 AIStartSel - Automated Testing Suite

A comprehensive Selenium-based testing framework with a web interface for running automated tests on educational platforms.

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Available Tests](#available-tests)
- [Test Interface](#test-interface)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v14.0.0 or higher)
- **npm** (comes with Node.js)
- **Google Chrome** browser
- **Git** (to clone the repository)

### System Requirements
- **Windows**: Windows 10 or higher
- **macOS**: macOS 10.14 or higher  
- **Linux**: Ubuntu 18.04+ or equivalent

## 📦 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/AIStartSel.git
cd AIStartSel
```

### 2. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Selenium WebDriver
- ChromeDriver
- Mocha testing framework
- Mochawesome reporter
- Express server

### 3. Verify ChromeDriver Installation
The ChromeDriver should be automatically installed with the dependencies. If you encounter issues, you can manually install it:
```bash
npm install chromedriver --save-dev
```

## ⚙️ Configuration

### 1. Account Configuration
Edit the `config/accountManager.js` file to set up your test accounts:

```javascript
// Example configuration
const accounts = {
    teacher: {
        email: 'teacher@example.com',
        password: 'your-teacher-password'
    },
    admin: {
        email: 'admin@example.com', 
        password: 'your-admin-password'
    },
    student: {
        email: 'student@example.com',
        password: 'your-student-password'
    }
};
```

### 2. Test Target URL
Update the target URL in your test files if needed. Currently set to:
```javascript
await driver.get('http://51.112.130.69');
```

## 🚀 Running Tests

### Option 1: Web Interface (Recommended)

1. **Start the Test Server:**
```bash
node server.js
```

2. **Open your browser and navigate to:**
```
http://localhost:3001
```

3. **Use the Web Interface:**
   - Select your account type (Teacher/Admin/Student)
   - Choose which tests to run
   - Click "Run Selected Tests"
   - Monitor real-time progress and logs
   - View detailed HTML reports

### Option 2: Command Line

Run individual tests directly:
```bash
# Run a specific test
npx mocha test/00-Login.js

# Run all tests
npx mocha test/

# Run with custom reporter
npx mocha test/00-Login.js --reporter mochawesome
```

## 📊 Available Tests

| Test # | Name | Description |
|--------|------|-------------|
| 00 | Login Test | Tests user authentication |
| 01 | OTP Verification | Tests forgot password OTP flow |
| 02 | Add Admin | Tests admin user creation |
| 03 | Change Password | Tests password change functionality |
| 04 | Course Search | Tests course search features |
| 05 | Create/Delete Course | Tests course management |
| 06 | Course Enroll/Leave | Tests enrollment process |
| 07 | Add Notes | Tests note-taking functionality |
| 08 | AI Notes Summary | Tests AI-powered note summaries |
| 09 | Chat Course | Tests course chat features |
| 10 | Mark Complete | Tests completion tracking |
| 11 | Enrolled Course Count | Tests enrollment count validation |
| 12 | Add Teacher | Tests teacher creation functionality |
| 13 | Edit/Delete Teacher | Tests teacher management operations |
| 14 | Export Teachers | Tests teacher data export |
| 15 | Bulk Adding | Tests bulk import functionality |
| 16 | Search/Filter Teachers | Tests teacher search and filtering |
| 17 | Resources | Tests resource management |
| 18 | Add Student | Tests student creation functionality |
| 19 | Edit/Delete Student | Tests student management operations |

## 🖥️ Test Interface Features

### Dashboard
- **Account Selection**: Choose between Teacher, Admin, or Student accounts
- **Test Selection**: Select individual tests or use "Select All"
- **Real-time Monitoring**: Live progress updates and logs
- **Batch Execution**: Run multiple tests in sequence

### Test Reports
- **HTML Reports**: Detailed test reports with screenshots
- **Live Logs**: Real-time test execution logs
- **Status Tracking**: Visual indicators for test progress
- **Error Details**: Comprehensive error reporting

### Report Access
Test reports are automatically generated and accessible at:
```
http://localhost:3001/reports/[TestName]Report.html
```
**Happy Testing! 🚀**