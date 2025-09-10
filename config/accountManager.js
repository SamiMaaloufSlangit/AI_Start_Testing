require('dotenv').config();

class AccountManager {
    constructor() {
        this.accounts = {
            teacher: {
                email: process.env.TEACHER_EMAIL,
                password: process.env.TEACHER_PASSWORD
            },
            admin: {
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            },
            student: {
                email: process.env.STUDENT_EMAIL,
                password: process.env.STUDENT_PASSWORD
            },
            grade11: {
                email: process.env.GRADE11_EMAIL,
                password: process.env.GRADE11_PASSWORD
            }
        };

        this.currentAccount = process.env.SELECTED_ACCOUNT;
    }

    getCurrentAccount() {
        return this.accounts[this.currentAccount];
    }

    setAccount(accountType) {
        if (accountType === 'teacher' || accountType === 'admin' || accountType === 'student' || accountType === 'grade11') {
            this.currentAccount = accountType;
        } else {
            throw new Error('Invalid account type. Use "teacher", "admin", "student", or "grade11"');
        }
    }

    getAccount(accountType) {
        if (accountType === 'teacher' || accountType === 'admin' || accountType === 'student' || accountType === 'grade11') {
            return this.accounts[accountType];
        } else {
            throw new Error('Invalid account type. Use "teacher", "admin", "student", or "grade11"');
        }
    }

    get email() {
        return this.getCurrentAccount().email;
    }

    get password() {
        return this.getCurrentAccount().password;
    }

    get teacherEmail() {
        return this.accounts.teacher.email;
    }

    get teacherPassword() {
        return this.accounts.teacher.password;
    }

    get studentEmail() {
        return this.accounts.student.email;
    }

    get studentPassword() {
        return this.accounts.student.password;
    }

    get adminEmail() {
        return this.accounts.admin.email;
    }

    get adminPassword() {
        return this.accounts.admin.password;
    }

    get grade11Email() {
        return this.accounts.grade11.email;
    }

    get grade11Password() {
        return this.accounts.grade11.password;
    }
}

const accountManager = new AccountManager();

module.exports = accountManager; 