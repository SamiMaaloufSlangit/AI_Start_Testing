# 🧪 AIStartSel - Automated Testing Suite

A comprehensive Selenium-based testing framework with a modern web interface for running automated tests on the AIStart educational platform.

## 📋 Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Account Configuration](#account-configuration)
- [Running Tests](#running-tests)
- [Available Tests](#available-tests)
- [Web Interface Guide](#web-interface-guide)
- [Test Categories](#test-categories)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## ✨ Features

- 🌐 **Modern Web Interface** - Intuitive dashboard for test management
- 🔐 **Multi-Account Support** - Test with different user roles (Admin, Teacher, Student, Grade 11)
- 📊 **Real-Time Monitoring** - Live test execution logs and progress tracking
- 📈 **Comprehensive Reports** - Detailed HTML reports with screenshots
- 🎯 **Categorized Tests** - Organized test suites by functionality
- ⚡ **Batch Execution** - Run multiple tests simultaneously
- 🔄 **Live Logs** - Real-time test output and debugging information

## 🔧 Prerequisites

### Required Software
- **Node.js** (v14.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Google Chrome** browser (latest version)
- **Git** (to clone the repository)

### System Requirements
- **Windows**: Windows 10 or higher
- **macOS**: macOS 10.14 or higher  
- **Linux**: Ubuntu 18.04+ or equivalent
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 1GB free space

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

This installs all required packages:
- Selenium WebDriver
- ChromeDriver (automated)
- Mocha testing framework
- Mochawesome reporter
- Express server
- Additional dependencies

### 3. Verify Installation
```bash
# Check if ChromeDriver is properly installed
npx chromedriver --version

# Verify Node.js setup
node --version
npm --version
```

## 🚀 Quick Start

### 1. Start the Test Server
```bash
node server.js
```

### 2. Access the Web Interface
Open your browser and navigate to:
```
http://localhost:3001
```

### 3. Run Your First Test
1. Select an account type (Teacher/Admin/Student/Grade 11)
2. Choose a test (e.g., "Login Test")
3. Click "Run Selected Tests"
4. Watch the real-time progress!

## 🔐 Account Configuration

The framework supports four different user accounts for comprehensive testing:

### Available Accounts

| Account Type | Purpose | Default Credentials |
|--------------|---------|-------------------|
| **Admin** | Administrative functions | `admin@example.com` |
| **Teacher** | Instructor features | `teacher@example.com` |
| **Student** | Student experience | `student@example.com` |
| **Grade 11** | Specific grade level testing | `grade11.student@gmail.com` |

### Configuring Credentials

Edit `config/accountManager.js` to set your actual credentials:

```javascript
const accounts = {
    teacher: {
        email: 'your-teacher@email.com',
        password: 'your-teacher-password'
    },
    admin: {
        email: 'your-admin@email.com',
        password: 'your-admin-password'
    },
    student: {
        email: 'your-student@email.com',
        password: 'your-student-password'
    },
    grade11: {
        email: 'grade11.student@gmail.com',
        password: 'graent11!'
    }
};
```

## 🚀 Running Tests

### Web Interface (Recommended)

1. **Start the server:**
   ```bash
   node server.js
   ```

2. **Open the dashboard:**
   ```
   http://localhost:3001
   ```

3. **Select tests and account:**
   - Choose your account type from the dropdown
   - Select individual tests or use "Select All"
   - Click "Run Selected Tests"

4. **Monitor execution:**
   - View real-time progress bars
   - Check live logs
   - Access detailed reports

### Command Line Interface

Run tests directly via command line:

```bash
# Run a specific test
npx mocha test/00-Login.js

# Run multiple tests
npx mocha test/00-Login.js test/01-ForgetPassOTP.js

# Run all tests in a category
npx mocha test/0*-*.js  # Authentication tests

# Run with detailed reporting
npx mocha test/00-Login.js --reporter mochawesome
```

### Running Tests with Different Accounts

The account selection in the web interface automatically configures which credentials to use. You can also manually set accounts in the code if needed.

## 📊 Available Tests

### Complete Test Suite (32 Tests)

| # | Test Name | Description | Category |
|---|-----------|-------------|----------|
| **00** | Login Test | User authentication flow | Authentication |
| **01** | OTP Verification | Forgot password with OTP | Authentication |
| **02** | Add Admin | Create administrator accounts | Admin Management |
| **03** | Edit Admin | Modify administrator details | Admin Management |
| **04** | Delete Admin | Remove administrator accounts | Admin Management |
| **05** | Change Password | Password modification flow | Authentication |
| **06** | Course Search | Search functionality for courses | Course Management |
| **07** | Create Delete Course | Course creation and removal | Course Management |
| **08** | Course Enroll Leave | Student enrollment process | Course Management |
| **09** | Add Notes | Note-taking functionality | Course Content |
| **10** | AI Notes Summary Download | AI-powered note summaries | Course Content |
| **11** | Chat Course | Course discussion features | Course Content |
| **12** | Mark Complete | Lesson completion tracking | Course Content |
| **13** | Enrolled Course NB | Enrollment count validation | Course Management |
| **14** | Add Teacher | Teacher account creation | Teacher Management |
| **15** | Edit Delete Teacher | Teacher profile management | Teacher Management |
| **16** | Export Teachers | Teacher data export | Teacher Management |
| **17** | Bulk Add Teacher | Bulk teacher import | Teacher Management |
| **18** | Search Filter Teachers | Teacher search functionality | Teacher Management |
| **19** | Resources | Resource management system | Course Content |
| **20** | Add Student | Student account creation | Student Management |
| **21** | Edit Delete Student | Student profile management | Student Management |
| **22** | Bulk Add Students | Bulk student import | Student Management |
| **23** | View All Courses Student | Student course catalog | Student Management |
| **24** | Upload Content Bulk | Bulk content upload | Course Content |
| **25** | Add Module | Course module creation | Course Content |
| **26** | Add Lesson | Individual lesson creation | Course Content |
| **27** | Edit Lesson | Lesson modification | Course Content |
| **28** | Delete Module | Module removal | Course Content |
| **29** | Course Clone | Course duplication | Course Management |
| **30** | Add Subjects | Subject creation | Course Management |
| **31** | Edit Subject | Subject modification | Course Management |
| **32** | Course Enroll Refresh | Enrollment persistence testing | Course Management |

## 🖥️ Web Interface Guide

### Dashboard Overview

The web interface provides a modern, intuitive way to manage and execute tests:

#### Account Selector
- **Located**: Top-left of the interface
- **Options**: Admin, Teacher, Student, Grade 11
- **Visual Indicator**: Color-coded badges show selected account
- **Functionality**: Automatically configures test credentials

#### Test Categories

Tests are organized into logical categories:

1. **🔐 Authentication & Login**
   - Login, OTP verification, password management

2. **👨‍💼 Admin Management**
   - Admin account operations

3. **👩‍🏫 Teacher Management**
   - Teacher account and profile management

4. **👨‍🎓 Student Management**
   - Student accounts and dashboard features

5. **📚 Course Management**
   - Course creation, enrollment, subjects

6. **📝 Course Content**
   - Modules, lessons, notes, resources

#### Test Selection
- **Individual Selection**: Click on test cards
- **Batch Selection**: Use "Select All" button
- **Visual Feedback**: Selected tests show checkmarks
- **Counter**: Shows number of selected tests

#### Execution Controls
- **Run Button**: Starts selected tests
- **Progress Tracking**: Real-time progress bars
- **Status Updates**: Live test status indicators
- **Log Streaming**: Real-time execution logs

### Test Reports

#### Report Generation
- **Automatic**: Generated after each test completion
- **Format**: HTML with embedded screenshots
- **Location**: `/Testreports/` directory
- **Access**: Direct links in the interface

#### Report Features
- **Detailed Results**: Step-by-step execution details
- **Screenshots**: Automatic capture on failures
- **Timing Information**: Execution duration
- **Error Details**: Comprehensive error reporting

### Live Monitoring

#### Real-Time Features
- **Progress Bars**: Visual execution progress
- **Status Updates**: Current test state
- **Live Logs**: Streaming test output
- **Error Alerts**: Immediate failure notifications

## 🎯 Test Categories

### Authentication & Login
Tests core authentication flows including login, logout, password management, and OTP verification.

### Admin Management
Comprehensive testing of administrative functions including user management, system configuration, and administrative workflows.

### Teacher Management
Tests teacher-specific features including profile management, course assignment, bulk operations, and teacher dashboard functionality.

### Student Management
Validates student experience including enrollment, course access, dashboard features, and student-specific workflows.

### Course Management
Tests course lifecycle including creation, editing, deletion, cloning, enrollment management, and course organization.

### Course Content
Validates content management including modules, lessons, notes, resources, AI features, and content organization.

## 🔧 Troubleshooting

### Common Issues

#### ChromeDriver Issues
```bash
# Reinstall ChromeDriver
npm uninstall chromedriver
npm install chromedriver

# Check Chrome version compatibility
chrome --version
npx chromedriver --version
```

#### Port Already in Use
```bash
# Find process using port 3001
netstat -ano | findstr :3001

# Kill the process (Windows)
taskkill /PID <process_id> /F

# Or use a different port
PORT=3002 node server.js
```

#### Test Failures
1. **Check credentials** in `config/accountManager.js`
2. **Verify target URL** is accessible
3. **Review error logs** in the web interface
4. **Check network connectivity**
5. **Ensure Chrome is updated**

#### Memory Issues
```bash
# Increase Node.js memory limit
node --max-old-space-size=4096 server.js
```

### Debug Mode

Enable detailed logging:
```bash
# Enable debug output
DEBUG=* node server.js

# Or set environment variable
export DEBUG=selenium*
```

### Getting Help

1. **Check the logs** in the web interface
2. **Review test reports** for detailed error information
3. **Verify system requirements** are met
4. **Check network connectivity** to the target application
5. **Ensure all dependencies** are properly installed

## 🤝 Contributing

### Development Setup

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
4. **Add tests** for new functionality
5. **Submit a pull request**

### Adding New Tests

1. **Create test file** in `/test/` directory
2. **Follow naming convention**: `XX-TestName.js`
3. **Add to server configuration** in `server.js`
4. **Update HTML interface** test numbering
5. **Document the test** in README

### Code Style

- Use **ES6/ES7** features
- Follow **async/await** patterns
- Include **comprehensive logging**
- Add **error handling**
- Write **descriptive test names**

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎉 Happy Testing!

The AIStartSel testing framework provides comprehensive coverage of the educational platform with an intuitive interface for managing test execution. Whether you're testing core authentication, complex course management workflows, or advanced AI features, this framework has you covered.

For questions, issues, or contributions, please feel free to reach out!

---

**Made with ❤️ for better educational software testing**