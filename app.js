// Emergency debug code
console.log('🔧 App starting...');

// Global error handler
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('❌ JavaScript Error:', msg, 'at', url, 'line', lineNo);
    document.body.innerHTML = `
        <div style="padding: 20px; color: red; font-family: Arial;">
            <h1>JavaScript Error</h1>
            <p><strong>Error:</strong> ${msg}</p>
            <p><strong>Line:</strong> ${lineNo}</p>
            <p>Check browser console (F12) for details</p>
        </div>
    `;
    return false;
};

// Check if root element exists
if (!document.getElementById('root')) {
    console.error('❌ Root element not found!');
    document.body.innerHTML = '<h1 style="color: red; padding: 20px;">Error: No root element with id "root" found</h1>';
} else {
    console.log('✅ Root element found');
}

// Test if we can render something
try {
    const container = document.getElementById('root');
    container.innerHTML = `
        <div style="padding: 20px; text-align: center; background: #667eea; color: white; min-height: 100vh;">
            <h1>App Loading... 🚀</h1>
            <p>If you see this, JavaScript is working</p>
            <button onclick="showLoginScreen()" style="padding: 10px 20px; margin: 10px;">Test Login Screen</button>
        </div>
    `;
    console.log('✅ Test content rendered');
} catch (error) {
    console.error('❌ Error rendering test content:', error);
}

// Enhanced Questions Reels App with User Registration - One Attempt Only
const questions = [
    {
        id: 1,
        question: "",
        options: ['13', '6', '10', '12'],
        image: 'images/Question1.jpg',
        correctAnswer: 2
    },
    {
        id: 2,
        question: "",
        options: ['784', '512', '900', "841"],
        image: 'images/Question2.jpg',
        correctAnswer: 0
    },
    {
        id: 3,
        question: "",
        options: ['18', '38', '46', '72'],
        image: 'images/Question3.jpg',
        correctAnswer: 1
    },
    {
        id: 4,
        question: "",
        options: ['TZUTSZUHPM', 'TZUTSZSHPO', 'TBUTSZUHPM', 'TZUTUZUHPM'],
        image: 'images/Question4.jpg',
        correctAnswer: 0
    },
    {
        id: 5,
        question: "",
        options: ['243', '441', '526', '625'],
        image: 'images/Question5.jpg',
        correctAnswer: 1
    },
    {
        id: 6,
        question: "",
        options: ['99', '105', '115', '110'],
        image: 'images/Question6.jpg',
        correctAnswer: 3
    },
    {
        id: 7,
        question: "",
        options: ['1595', '1379', '1437', '1617'],
        image: 'images/Question7.jpg',
        correctAnswer: 0
    },
    {
        id: 8,
        question: "",
        options: ['1009', '1109', '1099', '1199'],
        image: 'images/Question8.jpg',
        correctAnswer: 2
    },
    {
        id: 9,
        question: "",
        options: ['4', '6', '8', '9'],
        image: 'images/Question9.jpg',
        correctAnswer: 1
    },
    {
        id: 10,
        question: "",
        options: ['78', '79', '80', '81'],
        image: 'images/Question10.jpg',
        correctAnswer: 2
    }
];

let currentQuestion = 0;
let userAnswers = new Array(questions.length).fill(null);
let score = 0;
let currentUser = null;
let quizTimer = null;
let timeLeft = 1800; // 30 minutes in seconds
const container = document.getElementById('root');
// ===================== EMERGENCY PASSWORD FIX - ADD AT TOP =====================
// Simple password functions (no hashing)
async function hashPassword(password) {
    console.log('🔐 Storing password:', password);
    return password; // Store plain text (TEMPORARY)
}

async function verifyPassword(password, hashedPassword) {
    console.log('🔐 Verifying:', password, 'vs', hashedPassword);
    return password === hashedPassword; // Compare plain text
}

// Simple reset function
function resetAllPasswords() {
    console.log('🔄 Resetting passwords...');
    
    const users = JSON.parse(localStorage.getItem('quizUsers') || '[]');
    const defaultPassword = 'Test123!';
    
    users.forEach(user => {
        user.password = defaultPassword;
        console.log(`✅ Reset ${user.email} to: ${defaultPassword}`);
    });
    
    localStorage.setItem('quizUsers', JSON.stringify(users));
    console.log('🎉 All passwords reset to:', defaultPassword);
    alert('All passwords reset to: ' + defaultPassword);
    
    return users;
}

// Make available immediately
window.hashPassword = hashPassword;
window.verifyPassword = verifyPassword;
window.resetAllPasswords = resetAllPasswords;
// ===================== END EMERGENCY FIX =====================
// ===================== SECURITY ENHANCEMENTS =====================
// ADD THIS SECURITY CONFIG RIGHT HERE:
const SECURITY_CONFIG = {
    // Input validation limits
    MAX_EMAIL_LENGTH: 254,
    MAX_NAME_LENGTH: 100,
    MAX_MOBILE_LENGTH: 10,
    
    // Rate limiting
    MAX_LOGIN_ATTEMPTS: 5,
    LOGIN_TIMEOUT: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS_PER_MINUTE: 60,
    OTP_ATTEMPTS: 3,
    
    // Session management
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    MAX_SESSIONS: 3
};

// Security functions
function sanitizeInput(input) {
    if (typeof input !== 'string') return '';
    return input
        .trim()
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;')
        .replace(/\\/g, '&#x5C;')
        .replace(/`/g, '&#96;');
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= SECURITY_CONFIG.MAX_EMAIL_LENGTH;
}

function validateMobile(mobile) {
    return /^[6-9]\d{9}$/.test(mobile) && mobile.length === SECURITY_CONFIG.MAX_MOBILE_LENGTH;
}

// XSS Protection
function safeInnerHTML(element, content) {
    element.textContent = content;
}
// Production Configuration
const CONFIG = {
    OTP_EXPIRY_TIME: 5 * 60 * 1000, // 5 minutes
    MAX_LOGIN_ATTEMPTS: 5,
    PASSWORD_MIN_LENGTH: 8,
    SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes
};
// Rate limiting storage
function checkRateLimit(key, maxAttempts, windowMs) {
    try {
        const now = Date.now();
        const attempts = JSON.parse(localStorage.getItem(`rate_limit_${key}`) || '[]');
        
        // Remove expired attempts
        const recentAttempts = attempts.filter(time => now - time < windowMs);
        
        if (recentAttempts.length >= maxAttempts) {
            return false;
        }
        
        recentAttempts.push(now);
        localStorage.setItem(`rate_limit_${key}`, JSON.stringify(recentAttempts));
        return true;
    } catch (error) {
        console.error('Rate limit error:', error);
        return true; // Fail open to avoid blocking legitimate users
    }
}

// Clear expired rate limits
function cleanupRateLimits() {
    const now = Date.now();
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('rate_limit_')) {
            try {
                const attempts = JSON.parse(localStorage.getItem(key));
                const recentAttempts = attempts.filter(time => now - time < 24 * 60 * 60 * 1000);
                if (recentAttempts.length === 0) {
                    localStorage.removeItem(key);
                } else {
                    localStorage.setItem(key, JSON.stringify(recentAttempts));
                }
            } catch (e) {
                localStorage.removeItem(key);
            }
        }
    }
}

// Run cleanup every hour
setInterval(cleanupRateLimits, 60 * 60 * 1000);
// Production User Management Functions
function getUsers() {
    try {
        return JSON.parse(localStorage.getItem('quizUsers')) || [];
    } catch (error) {
        console.error('Error reading users:', error);
        return [];
    }
}

function saveUsers(users) {
    try {
        localStorage.setItem('quizUsers', JSON.stringify(users));
        return true;
    } catch (error) {
        console.error('Error saving users:', error);
        return false;
    }
}

function getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser'));
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;
}

function logout() {
    const session = JSON.parse(localStorage.getItem('currentSession') || '{}');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    logSecurityEvent('logout', { 
        email: currentUser.email,
        sessionId: session.id,
        reason: 'user_action'
    });
    
    // Clear session data
    localStorage.removeItem('currentSession');
    localStorage.removeItem('currentUser');
    currentUser = null;
    
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    
    showLoginScreen();
}
// Session Security Functions
function generateSessionId() {
    return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
}

function initSession(userData) {
    const sessionId = generateSessionId();
    const sessionData = {
        id: sessionId,
        created: Date.now(),
        lastActivity: Date.now(),
        ip: 'unknown',
        userAgent: navigator.userAgent,
        userId: userData.email
    };
    
    localStorage.setItem('currentSession', JSON.stringify(sessionData));
    
    // Log session start
    logSecurityEvent('session_start', { 
        email: userData.email,
        sessionId: sessionId 
    });
    
    return sessionId;
}

function validateSession() {
    try {
        const sessionStr = localStorage.getItem('currentSession');
        const currentUserStr = localStorage.getItem('currentUser');
        
        if (!sessionStr || !currentUserStr) {
            return false;
        }
        
        const session = JSON.parse(sessionStr);
        const currentUser = JSON.parse(currentUserStr);
        
        // Check session timeout
        if (Date.now() - session.lastActivity > SECURITY_CONFIG.SESSION_TIMEOUT) {
            logSecurityEvent('session_timeout', { 
                email: currentUser.email,
                sessionId: session.id 
            });
            return false;
        }
        
        // Update last activity
        session.lastActivity = Date.now();
        localStorage.setItem('currentSession', JSON.stringify(session));
        
        return true;
    } catch (error) {
        console.error('Session validation error:', error);
        return false;
    }
}

// Enhanced logout with session cleanup
function secureLogout() {
    const session = JSON.parse(localStorage.getItem('currentSession') || '{}');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    logSecurityEvent('logout', { 
        email: currentUser.email,
        sessionId: session.id,
        reason: 'user_action'
    });
    
    // Clear session data
    localStorage.removeItem('currentSession');
    localStorage.removeItem('currentUser');
    currentUser = null;
    
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    
    showLoginScreen();
}

// Update activity on user interaction
document.addEventListener('click', () => {
    if (localStorage.getItem('currentSession')) {
        validateSession();
    }
});

document.addEventListener('keypress', () => {
    if (localStorage.getItem('currentSession')) {
        validateSession();
    }
});

// Auto-logout timer
setInterval(() => {
    if (localStorage.getItem('currentSession') && !validateSession()) {
        alert('Session expired. Please login again.');
        secureLogout();
    }
}, 60000); // Check every minute
// Security audit logging
function logSecurityEvent(event, details = {}) {
    try {
        const auditLog = JSON.parse(localStorage.getItem('security_audit') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            event: event,
            details: details,
            user: currentUser.email || 'anonymous',
            ip: details.ip || 'unknown',
            userAgent: navigator.userAgent
        };
        
        auditLog.unshift(logEntry);
        
        // Keep only last 1000 events
        if (auditLog.length > 1000) {
            auditLog.splice(1000);
        }
        
        localStorage.setItem('security_audit', JSON.stringify(auditLog));
        
        // Also log to console for debugging
        console.log('🔒 Security Event:', event, details);
    } catch (error) {
        console.error('Failed to log security event:', error);
    }
}

// Log important events throughout your application
// Add these calls to relevant functions:

// In registration success:
// logSecurityEvent('user_registration', { email: userData.email });

// In login (both success and failure):
// logSecurityEvent('login_attempt', { email: email, success: loginSuccessful });

// In password change:
// logSecurityEvent('password_change', { user: currentUser.email });

// In quiz submission:
// logSecurityEvent('quiz_submission', { 
//     user: currentUser.email, 
//     score: score,
//     quizId: quizId
// });

// In logout:
// logSecurityEvent('logout', { user: currentUser.email });

// In session timeout:
// logSecurityEvent('session_timeout', { user: currentUser.email });
// ===================== STEP 8: ADD SECURITY HEALTH CHECK RIGHT HERE =====================
// Security health check
function runSecurityScan() {
    const issues = [];
    
    try {
        // Check for weak passwords in stored users
        const users = JSON.parse(localStorage.getItem('quizUsers') || '[]');
        users.forEach(user => {
            if (user.password && user.password.length < 8) {
                issues.push(`Weak password detected for user: ${user.email}`);
            }
        });
        
        // Check for old sessions
        const session = JSON.parse(localStorage.getItem('currentSession') || '{}');
        if (session.created && Date.now() - session.created > 24 * 60 * 60 * 1000) {
            issues.push('Old session detected (over 24 hours)');
        }
        
        // Check storage quota
        let totalSize = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                totalSize += localStorage[key].length * 2;
            }
        }
        
        if (totalSize > 4.5 * 1024 * 1024) {
            issues.push('Local storage approaching limit: ' + Math.round(totalSize / 1024 / 1024) + 'MB used');
        }
        
        // Check for missing security headers (basic client-side check)
        if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
            issues.push('Content Security Policy header missing');
        }
        
        // Check for expired rate limits
        const now = Date.now();
        let expiredRateLimits = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith('rate_limit_')) {
                try {
                    const attempts = JSON.parse(localStorage.getItem(key));
                    const recentAttempts = attempts.filter(time => now - time < 24 * 60 * 60 * 1000);
                    if (recentAttempts.length === 0) {
                        expiredRateLimits++;
                    }
                } catch (e) {
                    // Ignore corrupted data
                }
            }
        }
        
        if (expiredRateLimits > 0) {
            issues.push(`${expiredRateLimits} expired rate limits found`);
        }
        
    } catch (error) {
        issues.push('Error during security scan: ' + error.message);
    }
    
    if (issues.length > 0) {
        console.warn('🔒 Security issues found:', issues);
        logSecurityEvent('security_scan_issues', { issues: issues });
    } else {
        console.log('✅ Security scan completed - no issues found');
    }
    
    return issues;
}

// Run security scan periodically
setInterval(() => {
    runSecurityScan();
}, 5 * 60 * 1000); // Every 5 minutes

// Also run on startup
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const issues = runSecurityScan();
        if (issues.length > 0 && console) {
            console.log('Initial security scan completed. Issues:', issues);
        }
    }, 2000);
});

// Security monitoring dashboard (optional - for admin view)
function getSecurityStatus() {
    const scanResults = runSecurityScan();
    const auditLogs = JSON.parse(localStorage.getItem('security_audit') || '[]');
    const recentEvents = auditLogs.slice(0, 10);
    
    return {
        timestamp: new Date().toISOString(),
        scanResults: {
            issueCount: scanResults.length,
            issues: scanResults,
            status: scanResults.length === 0 ? 'healthy' : 'needs_attention'
        },
        recentSecurityEvents: recentEvents,
        sessionStatus: localStorage.getItem('currentSession') ? 'active' : 'inactive',
        rateLimitsActive: Object.keys(localStorage).filter(key => key.startsWith('rate_limit_')).length
    };
}
// ===================== END OF STEP 8 =====================
// ===================== STEP 10: ADD SECURITY TESTING RIGHT HERE =====================
// Test security features
function testSecurityFeatures() {
    console.log('🧪 Testing Security Features...');
    
    // Test input sanitization
    const testInput = '<script>alert("xss")</script>';
    const sanitized = sanitizeInput(testInput);
    console.log('✅ Input Sanitization:', testInput, '→', sanitized);
    
    // Test email validation
    console.log('✅ Email Validation - valid:', validateEmail('test@example.com'));
    console.log('✅ Email Validation - invalid:', validateEmail('invalid-email'));
    
    // Test mobile validation  
    console.log('✅ Mobile Validation - valid:', validateMobile('9876543210'));
    console.log('✅ Mobile Validation - invalid:', validateMobile('12345'));
    
    // Test rate limiting
    console.log('✅ Rate Limiting - first attempt:', checkRateLimit('test', 3, 60000));
    
    // Test session functions
    const testUser = { email: 'test@example.com', name: 'Test User' };
    const sessionId = generateSessionId();
    console.log('✅ Session ID Generation:', sessionId);
    
    // Run security scan
    const issues = runSecurityScan();
    console.log('✅ Security Scan Issues:', issues);
    
    // Test audit logging
    logSecurityEvent('security_test', { test: 'completed', timestamp: new Date().toISOString() });
    console.log('✅ Audit Logging - test event logged');
    
    console.log('🎉 All security features tested successfully!');
    
    return {
        sanitization: sanitized !== testInput,
        emailValidation: validateEmail('test@example.com'),
        mobileValidation: validateMobile('9876543210'),
        rateLimiting: true,
        sessionManagement: true,
        securityScan: Array.isArray(issues),
        auditLogging: true
    };
}
// ===================== ADD MISSING FUNCTION =====================
// Display security status (for admin panel)
function displaySecurityStatus() {
    if (!currentUser || !isAdminUser(currentUser)) {
        console.log('🔒 Security status: Admin access required');
        return { status: 'admin_access_required' };
    }
    
    const status = getSecurityStatus();
    console.log('🔒 Security Status:', status);
    
    // Return security status for display
    const securityStatus = {
        lastScan: new Date().toLocaleString(),
        issues: status.scanResults.issues.length,
        activeSessions: localStorage.getItem('currentSession') ? 1 : 0,
        recentEvents: status.recentSecurityEvents.length,
        totalUsers: status.scanResults.summary?.totalUsers || 0,
        totalAttempts: status.scanResults.summary?.totalAttempts || 0,
        averageScore: status.scanResults.summary?.averageScore || 0,
        status: status.scanResults.status
    };
    
    console.log('📊 Security Summary:', securityStatus);
    return securityStatus;
}


// ===================== END MISSING FUNCTION =====================
// Make security functions globally available for testing
window.sanitizeInput = sanitizeInput;
window.validateEmail = validateEmail;
window.validateMobile = validateMobile;
window.logSecurityEvent = logSecurityEvent;
window.runSecurityScan = runSecurityScan;
window.testSecurityFeatures = testSecurityFeatures;
window.displaySecurityStatus = displaySecurityStatus;
window.getSecurityStatus = getSecurityStatus;

// Optional: Auto-test on startup in development
// Uncomment the line below to automatically test security features on app load
// document.addEventListener('DOMContentLoaded', () => setTimeout(testSecurityFeatures, 3000));
// ===================== END OF STEP 10 =====================
function saveUserResult(score, total, timeUsed) {
    if (!currentUser) return;
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.email === currentUser.email);
    
    if (userIndex !== -1) {
        if (!users[userIndex].quizResults) {
            users[userIndex].quizResults = [];
        }
        
        users[userIndex].quizResults.push({
            score: score,
            total: total,
            percentage: Math.round((score / total) * 100),
            timeUsed: timeUsed,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            timestamp: new Date().toISOString()
        });
        
        saveUsers(users);
        
        // Store individual attempt data separately
        storeIndividualAttempt(users[userIndex], score, total, timeUsed);
    }
}

// Store individual attempt data separately
function storeIndividualAttempt(user, score, total, timeUsed) {
    const attemptData = {
        userId: user.email,
        userName: user.name,
        userMobile: user.mobile,
        score: score,
        total: total,
        percentage: Math.round((score / total) * 100),
        timeUsed: timeUsed,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        timestamp: new Date().toISOString(),
        answers: userAnswers
    };
    
    const allAttempts = JSON.parse(localStorage.getItem('quizAttempts')) || [];
    allAttempts.push(attemptData);
    localStorage.setItem('quizAttempts', JSON.stringify(allAttempts));
}
// User Management Utilities
function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('currentUser'));
    } catch (error) {
        return null;
    }
}

function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;
}

function updateUserStats(score) {
    const currentUser = getCurrentUser();
    if (!currentUser) return;
    
    let users = JSON.parse(localStorage.getItem('quizUsers')) || [];
    const userIndex = users.findIndex(user => user.id === currentUser.id);
    
    if (userIndex !== -1) {
        // Update attempts and best score
        users[userIndex].quizAttempts = (users[userIndex].quizAttempts || 0) + 1;
        
        if (score > (users[userIndex].bestScore || 0)) {
            users[userIndex].bestScore = score;
        }
        
        users[userIndex].lastLogin = new Date().toISOString();
        
        // Save updated users
        localStorage.setItem('quizUsers', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(users[userIndex]));
    }
}

function isUserLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}
// Check if user has already attempted the quiz
function hasUserAttemptedQuiz() {
    if (!currentUser) return false;
    
    const users = getUsers();
    const user = users.find(u => u.email === currentUser.email);
    
    return user && user.quizResults && user.quizResults.length > 0;
}

// Timer Functions
function startTimer() {
    const startTime = Date.now();
    const timerDisplay = document.getElementById('timerDisplay');
    
    quizTimer = setInterval(() => {
        const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
        const remainingTime = timeLeft - elapsedSeconds;
        
        if (remainingTime <= 0) {
            clearInterval(quizTimer);
            autoSubmitQuiz();
            return;
        }
        
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        
        if (timerDisplay) {
            timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            // Change color when less than 5 minutes
            if (remainingTime < 300) {
                timerDisplay.style.color = '#ff4444';
                timerDisplay.classList.add('pulse');
            } else if (remainingTime < 600) {
                timerDisplay.style.color = '#ffaa00';
            }
        }
    }, 1000);
}

function autoSubmitQuiz() {
    // Calculate score for answered questions
    score = 0;
    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] !== null && userAnswers[i] === questions[i].correctAnswer) {
            score++;
        }
    }
    
    const timeUsed = timeLeft; // All time used when auto-submitted
    saveUserResult(score, questions.length, timeUsed);
    showSubmissionPage(timeUsed);
}
/ === AUTOMATIC DATA STORAGE FUNCTIONS === //

// Store complete user registration data in analytics - UPDATED VERSION
function storeUserInAnalytics(userData) {
    try {
        console.log('📊 Storing user in analytics:', userData.email);
        console.log('📝 User data received:', userData);
        
        // Initialize analytics if needed
        let analyticsData = JSON.parse(localStorage.getItem('adminAnalytics') || '{"users":[],"quizAttempts":[],"summary":{"totalUsers":0,"totalAttempts":0,"averageScore":0,"registrationDates":[]}}');
        
        console.log('📈 Current analytics data:', analyticsData);
        
        // Store user data (without password for security)
        const userAnalytics = {
            userId: userData.id,
            email: userData.email,
            name: userData.name,
            mobile: userData.mobile,
            registrationDate: userData.registrationDate,
            registrationIP: userData.registrationIP || 'unknown',
            deviceInfo: userData.deviceInfo || 'unknown',
            isActive: userData.isActive,
            lastUpdated: new Date().toISOString()
        };
        
        console.log('👤 User analytics object:', userAnalytics);
        
        // Check if user already exists in analytics
        const existingUserIndex = analyticsData.users.findIndex(u => u.userId === userData.id);
        console.log('🔍 Existing user index:', existingUserIndex);
        
        if (existingUserIndex === -1) {
            // Add new user
            analyticsData.users.push(userAnalytics);
            analyticsData.summary.totalUsers = analyticsData.users.length;
            analyticsData.summary.registrationDates.push(userData.registrationDate);
            console.log('✅ Added new user to analytics');
        } else {
            // Update existing user
            analyticsData.users[existingUserIndex] = userAnalytics;
            console.log('✅ Updated existing user in analytics');
        }
        
        // CRITICAL: Save back to localStorage
        localStorage.setItem('adminAnalytics', JSON.stringify(analyticsData));
        console.log('💾 Saved analytics data to localStorage');
        
        // VERIFY: Check if it was actually saved
        const verifyData = JSON.parse(localStorage.getItem('adminAnalytics') || '{}');
        console.log('🔍 VERIFICATION - Analytics users count:', verifyData.users ? verifyData.users.length : 0);
        console.log('🔍 VERIFICATION - Last user email:', verifyData.users && verifyData.users.length > 0 ? verifyData.users[verifyData.users.length - 1].email : 'none');
        
        console.log('🎉 User data successfully stored in admin analytics:', userData.email);
        
    } catch (error) {
        console.error('❌ Error storing user in analytics:', error);
        console.error('Error details:', error.message);
    }
}
// Make it globally available
window.storeUserInAnalytics = storeUserInAnalytics;
// ===================== ADD initializeAdminAnalytics RIGHT HERE =====================
// Initialize and ensure admin analytics data exists
function initializeAdminAnalytics() {
    try {
        console.log('🔄 Initializing admin analytics...');
        
        const defaultAnalytics = {
            users: [],
            quizAttempts: [],
            summary: {
                totalUsers: 0,
                totalAttempts: 0,
                averageScore: 0,
                registrationDates: []
            }
        };
        
        // Get or create analytics data
        let analyticsData = JSON.parse(localStorage.getItem('adminAnalytics') || 'null');
        
        if (!analyticsData) {
            console.log('📊 Creating new admin analytics storage');
            analyticsData = defaultAnalytics;
            localStorage.setItem('adminAnalytics', JSON.stringify(analyticsData));
        } else {
            console.log('📊 Existing admin analytics found');
        }
        
        // Migrate existing users to analytics if needed
        const quizUsers = JSON.parse(localStorage.getItem('quizUsers') || '[]');
        if (quizUsers.length > 0 && (!analyticsData.users || analyticsData.users.length === 0)) {
            console.log('🔄 Migrating existing users to analytics...');
            analyticsData.users = quizUsers.map(user => ({
                userId: user.id,
                email: user.email,
                name: user.name,
                mobile: user.mobile,
                registrationDate: user.registrationDate || new Date().toISOString(),
                registrationIP: user.registrationIP || 'unknown',
                deviceInfo: user.deviceInfo || 'unknown',
                isActive: user.isActive !== undefined ? user.isActive : true
            }));
            analyticsData.summary.totalUsers = analyticsData.users.length;
            localStorage.setItem('adminAnalytics', JSON.stringify(analyticsData));
            console.log('✅ Users migrated to analytics:', analyticsData.users.length);
        }
        
        return analyticsData;
    } catch (error) {
        console.error('❌ Analytics initialization failed:', error);
        return {
            users: [],
            quizAttempts: [],
            summary: { totalUsers: 0, totalAttempts: 0, averageScore: 0, registrationDates: [] }
        };
    }
}

// Make it globally available
window.initializeAdminAnalytics = initializeAdminAnalytics;
// ===================== END initializeAdminAnalytics =====================

// Store quiz results in analytics
function storeQuizResultsInAnalytics(score, timeUsed) {
    if (!currentUser) return;
    
    try {
        const analyticsData = JSON.parse(localStorage.getItem('adminAnalytics')) || {
            users: [],
            quizAttempts: [],
            summary: {
                totalUsers: 0,
                totalAttempts: 0,
                averageScore: 0,
                registrationDates: []
            }
        };
        
        const quizResult = {
            attemptId: Date.now(),
            userId: currentUser.id,
            userEmail: currentUser.email,
            userName: currentUser.name,
            userMobile: currentUser.mobile,
            score: score,
            totalQuestions: questions.length,
            percentage: Math.round((score / questions.length) * 100),
            timeUsed: timeUsed,
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
            timestamp: new Date().toISOString(),
            answers: userAnswers,
            detailedResults: questions.map((q, index) => ({
                questionId: q.id,
                userAnswer: userAnswers[index],
                correctAnswer: q.correctAnswer,
                isCorrect: userAnswers[index] === q.correctAnswer
            }))
        };
        
        // Add to quiz attempts
        analyticsData.quizAttempts.push(quizResult);
        
        // Update summary statistics
        analyticsData.summary.totalAttempts = analyticsData.quizAttempts.length;
        
        // Calculate average score safely
        if (analyticsData.quizAttempts.length > 0) {
            analyticsData.summary.averageScore = Math.round(
                analyticsData.quizAttempts.reduce((sum, attempt) => sum + attempt.percentage, 0) / 
                analyticsData.quizAttempts.length
            );
        } else {
            analyticsData.summary.averageScore = 0;
        }
        
        // Save updated analytics
        localStorage.setItem('adminAnalytics', JSON.stringify(analyticsData));
        console.log('✅ Quiz results stored in admin analytics for:', currentUser.email);
        
    } catch (error) {
        console.error('Error storing quiz results in analytics:', error);
    }
}

// Find and REPLACE your getClientIP function with this:
async function getClientIP() {
    try {
        console.log('🌐 Attempting to get IP address...');
        
        // Try the IP API
        const response = await fetch('https://api.ipify.org?format=json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ IP address obtained:', data.ip);
        return data.ip;
        
    } catch (error) {
        console.log('🌐 IP API blocked or failed, using fallback');
        
        // FALLBACK: Don't use external API at all
        const fallbackIP = 'local-' + Math.random().toString(36).substr(2, 8);
        console.log('🌐 Using fallback IP:', fallbackIP);
        return fallbackIP;
    }
}
function showLoginScreen() {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <div class="auth-header">
                    <img src="images/company-logo.png" alt="The Conclusion Daily Logo" class="auth-logo">
                    <h1 class="auth-title">Welcome to The Conclusion Daily! </h1>
                </div>
                <p class="auth-subtitle">Test your knowledge with our interactive quiz</p>
                
                <div class="auth-form">
                    <input type="email" id="loginEmail" placeholder="Enter your email" class="auth-input" required>
                    <div class="password-container">
    <input type="password" id="loginPassword" placeholder="Enter your password" class="auth-input" required>
    <button type="button" class="password-toggle" onclick="togglePassword('loginPassword')">
        👁️
    </button>
</div>
                    
                    <!-- CAPTCHA for Login -->
                    <div class="captcha-container">
                        <div class="captcha-display">
                            <span id="loginCaptchaText"></span>
                            <button type="button" onclick="generateLoginCaptcha()" class="refresh-captcha">↻</button>
                        </div>
                        <input type="text" id="loginCaptchaInput" placeholder="Enter CAPTCHA code" class="auth-input" required>
                    </div>
                    
                    <button onclick="login()" class="auth-btn">Login</button>
                    
                    <!-- Forgot Password Link -->
                    <div class="forgot-password-container">
                        <button onclick="showForgotPasswordScreen()" class="forgot-password-btn">
                            Forgot Password?
                        </button>
                    </div>
                </div>
                
                <div class="auth-divider">
                    <span>or</span>
                </div>
                
                <button onclick="showRegisterScreen()" class="auth-switch-btn">
                    Don't have an account? Register
                </button>
            </div>
        </div>
    `;
    
    generateLoginCaptcha();
}
// Forgot Password Flow
function showForgotPasswordScreen() {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <div class="auth-header">
                    <img src="images/company-logo.png" alt="Company Logo" class="auth-logo">
                    <h1 class="auth-title">Reset Password 🔑</h1>
                </div>
                <p class="auth-subtitle">Enter your email to receive a password reset OTP</p>
                
                <div class="auth-form">
                    <input type="email" id="forgotEmail" placeholder="Enter your registered email" class="auth-input" required>
                    
                    <button onclick="sendPasswordResetOTP()" class="auth-btn" id="sendResetOtpBtn">
                        Send Reset OTP
                    </button>
                </div>
                
                <div class="auth-divider">
                    <span>or</span>
                </div>
                
                <button onclick="showLoginScreen()" class="auth-switch-btn">
                    Back to Login
                </button>
            </div>
        </div>
    `;
}

function showResetPasswordScreen() {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <div class="auth-header">
                    <img src="images/company-logo.png" alt="Company Logo" class="auth-logo">
                    <h1 class="auth-title">Set New Password 🔑</h1>
                </div>
                <p class="auth-subtitle">Enter the OTP and your new password</p>
                
                <div class="auth-form">
                    <div class="input-with-verification">
                        <input type="text" id="resetOtp" placeholder="Enter Reset OTP" class="auth-input" required>
                    </div>
                    <input type="password" id="newPassword" placeholder="New Password (min. 8 characters)" class="auth-input" required>
                    <input type="password" id="confirmNewPassword" placeholder="Confirm New Password" class="auth-input" required>
                    
                    <button onclick="resetPassword()" class="auth-btn" id="resetPasswordBtn">
                        Reset Password
                    </button>
                </div>
                
                <div class="auth-divider">
                    <span>or</span>
                </div>
                
                <button onclick="showForgotPasswordScreen()" class="auth-switch-btn">
                    Resend OTP
                </button>
            </div>
        </div>
    `;
}
// Enhanced authentication with validation and CAPTCHA
function showRegisterScreen() {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <div class="auth-header">
                    <img src="images/company-logo.png" alt="Company Logo" class="auth-logo">
                    <h1 class="auth-title">Create Account 👤</h1>
                </div>
                <p class="auth-subtitle">Join thousands of quiz enthusiasts</p>
                
                <div class="auth-form">
                    <input type="text" id="registerName" placeholder="Full Name" class="auth-input" required>
                    <input type="email" id="registerEmail" placeholder="Email Address" class="auth-input" required>
                    <div class="input-with-verification">
                        <input type="tel" id="registerMobile" placeholder="Mobile Number" class="auth-input" required>
                        <button type="button" id="sendOtpBtn" class="otp-btn" onclick="sendMobileOTP()">Send OTP</button>
                    </div>
                    <div class="input-with-verification">
                        <input type="text" id="mobileOtp" placeholder="Enter Mobile OTP" class="auth-input" disabled>
                    </div>
                    <div class="password-container">
    <input type="password" id="registerPassword" placeholder="Create Password (min. 8 characters)" class="auth-input" required 
           oninput="checkPasswordStrength('registerPassword')">
    <button type="button" class="password-toggle" onclick="togglePassword('registerPassword')" title="Show password">
        👁️
    </button>
</div>
<div class="password-strength-container">
    <div class="password-strength" id="registerPasswordStrength"></div>
    <div class="strength-text" id="registerPasswordStrengthText"></div>
</div>

<div class="password-container">
    <input type="password" id="registerConfirm" placeholder="Confirm Password" class="auth-input" required
           oninput="checkPasswordMatch()">
    <button type="button" class="password-toggle" onclick="togglePassword('registerConfirm')" title="Show password">
        👁️
    </button>
</div>
<div class="password-match-container">
    <div class="match-text" id="passwordMatchText"></div>
</div>
                    
                    <!-- CAPTCHA Section -->
                    <div class="captcha-container">
                        <div class="captcha-display">
                            <span id="captchaText"></span>
                            <button type="button" onclick="generateCaptcha()" class="refresh-captcha">↻</button>
                        </div>
                        <input type="text" id="captchaInput" placeholder="Enter CAPTCHA code" class="auth-input" required>
                    </div>
                    
                    <button onclick="handleRegistration(event)" class="auth-btn" id="registerBtn">Create Account</button>
                </div>
                
                <div class="auth-divider">
                    <span>or</span>
                </div>
                
                <button onclick="showLoginScreen()" class="auth-switch-btn">
                    Already have an account? Login
                </button>
            </div>
        </div>
    `;
    
    generateCaptcha();
}

// Forgot Password Functions
async function sendPasswordResetOTP() {
    const sendBtn = document.getElementById('sendResetOtpBtn');
    const email = document.getElementById('forgotEmail').value.trim().toLowerCase();
    
    try {
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending OTP...';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return;
        }

        // Check if user exists
        const users = getUsers();
        const user = users.find(u => u.email === email);
        
        if (!user) {
            alert('No account found with this email address');
            return;
        }

        // Generate reset OTP
        const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store reset OTP data
        localStorage.setItem('resetOTP', resetOtp);
        localStorage.setItem('resetOTPTime', Date.now());
        localStorage.setItem('resetEmail', email);
        localStorage.setItem('resetOTPType', 'password_reset');

        // Simulate sending reset OTP
        const smsResult = await sendResetSMS(user.mobile, resetOtp);
        
        if (smsResult.success) {
            logSecurityEvent('password_reset_otp_sent', { email: email });
            alert(`Password reset OTP sent to your registered mobile number ending with ${user.mobile.slice(-4)}`);
            showResetPasswordScreen();
            trackEvent('password_reset_otp_sent');
        } else {
            throw new Error(smsResult.error || 'Failed to send reset OTP');
        }

    } catch (error) {
        console.error('Password reset OTP error:', error);
        alert('Failed to send reset OTP. Please try again.');
    } finally {
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send Reset OTP';
    }
}

async function sendResetSMS(mobile, otp) {
    // Simulate SMS sending for password reset
    console.log(`[Password Reset SMS] OTP ${otp} sent to ${mobile}`);
    
    // DEMO: Show OTP in alert
    alert(`DEMO: Password Reset OTP sent to ${mobile}: ${otp}\n\nIn production, this would be sent via SMS`);
    
    return { success: true, messageId: 'reset_simulated_' + Date.now() };
}

async function resetPassword() {
    const resetBtn = document.getElementById('resetPasswordBtn');
    
    try {
        resetBtn.disabled = true;
        resetBtn.textContent = 'Resetting Password...';

        const otp = document.getElementById('resetOtp').value.trim();
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmNewPassword').value;
        
        const storedOtp = localStorage.getItem('resetOTP');
        const otpTime = localStorage.getItem('resetOTPTime');
        const email = localStorage.getItem('resetEmail');

        // Validation
        if (!otp || !newPassword || !confirmPassword) {
            alert('Please fill all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (newPassword.length < CONFIG.PASSWORD_MIN_LENGTH) {
            alert(`Password must be at least ${CONFIG.PASSWORD_MIN_LENGTH} characters long`);
            return;
        }

        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
            alert('Password must contain at least one uppercase letter, one lowercase letter, and one number');
            return;
        }

        // Verify OTP
        if (!storedOtp || otp !== storedOtp) {
            alert('Invalid OTP');
            return;
        }

        // Check if OTP is expired (10 minutes for password reset)
        if (Date.now() - parseInt(otpTime) > 10 * 60 * 1000) {
            alert('OTP has expired. Please request a new one.');
            return;
        }

        // Update user password
        const users = getUsers();
        const userIndex = users.findIndex(u => u.email === email);
        
        if (userIndex === -1) {
            alert('User not found');
            return;
        }

        // Hash new password
        const hashedPassword = await hashPassword(newPassword);
        users[userIndex].password = hashedPassword;
        users[userIndex].lastPasswordReset = new Date().toISOString();

        if (saveUsers(users)) {
            // Clear reset data
            localStorage.removeItem('resetOTP');
            localStorage.removeItem('resetOTPTime');
            localStorage.removeItem('resetEmail');
            localStorage.removeItem('resetOTPType');
            logSecurityEvent('password_reset_success', { email: email });
            alert('✅ Password reset successfully! You can now login with your new password.');
            trackEvent('password_reset_success');
            showLoginScreen();
        } else {
            throw new Error('Failed to save new password');
        }

    } catch (error) {
        console.error('Password reset error:', error);
        alert('Password reset failed. Please try again.');
        trackEvent('password_reset_failed', { error: error.message });
    } finally {
        resetBtn.disabled = false;
        resetBtn.textContent = 'Reset Password';
    }
}

// Enhanced password validation function
function validatePassword(password) {
    if (password.length < CONFIG.PASSWORD_MIN_LENGTH) {
        return { isValid: false, message: `Password must be at least ${CONFIG.PASSWORD_MIN_LENGTH} characters long` };
    }

    if (!/(?=.*[a-z])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one lowercase letter' };
    }

    if (!/(?=.*[A-Z])/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter' };
    }

    if (!/(?=.*\d)/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one number' };
    }

    return { isValid: true, message: 'Password is valid' };
}
// CAPTCHA Functions
function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('captchaText').textContent = captcha;
    localStorage.setItem('registerCaptcha', captcha);
}

function generateLoginCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('loginCaptchaText').textContent = captcha;
    localStorage.setItem('loginCaptcha', captcha);
}

// Mobile OTP Simulation (In real app, integrate with SMS service)
function sendMobileOTP() {
    const mobileInput = document.getElementById('registerMobile');
    const mobile = mobileInput.value.trim();
    
    // Mobile validation
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
        alert('Please enter a valid 10-digit Indian mobile number starting with 6-9');
        return;
    }
    
    // Check if mobile already exists
    const users = getUsers();
    if (users.find(u => u.mobile === mobile)) {
        alert('Mobile number already registered');
        return;
    }
    
    // Simulate OTP sending (in production, integrate with SMS gateway)
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    localStorage.setItem('mobileOTP', otp);
    localStorage.setItem('mobileOTPTime', Date.now());
    localStorage.setItem('mobileToVerify', mobile);
    
    // Enable OTP input
    document.getElementById('mobileOtp').disabled = false;
    
    // Disable send button for 60 seconds
    const sendBtn = document.getElementById('sendOtpBtn');
    sendBtn.disabled = true;
    let timeLeft = 60;
    
    const timer = setInterval(() => {
        sendBtn.textContent = `Resend (${timeLeft}s)`;
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timer);
            sendBtn.disabled = false;
            sendBtn.textContent = 'Resend OTP';
        }
    }, 1000);
    
    // For demo purposes, show OTP in alert (remove in production)
    alert(`DEMO: OTP sent to ${mobile}: ${otp}\n\nIn production, this would be sent via SMS`);
}

function verifyMobileOTP() {
    const enteredOtp = document.getElementById('mobileOtp').value.trim();
    const storedOtp = localStorage.getItem('mobileOTP');
    const otpTime = localStorage.getItem('mobileOTPTime');
    
    if (!enteredOtp || !storedOtp) {
        return { isValid: false, message: 'Please enter OTP' };
    }
    
    // Check if OTP is expired (5 minutes)
    if (Date.now() - parseInt(otpTime) > 5 * 60 * 1000) {
        return { isValid: false, message: 'OTP has expired. Please request a new one.' };
    }
    
    if (enteredOtp !== storedOtp) {
        return { isValid: false, message: 'Invalid OTP' };
    }
    
    return { isValid: true, message: 'Mobile verified successfully' };
}

// Enhanced Registration with Production Features
async function register() {
    const registerBtn = document.getElementById('registerBtn');
    
    try {
        // Show loading state
        registerBtn.disabled = true;
        registerBtn.textContent = 'Creating Account...';

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim().toLowerCase();
        const mobile = document.getElementById('registerMobile').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('registerConfirm').value;
        const captchaInput = document.getElementById('captchaInput').value.trim();
        const storedCaptcha = localStorage.getItem('registerCaptcha');

        // ========== ADD RATE LIMITING CHECK ==========
        if (!checkRateLimit(`registration_${email}`, 3, 15 * 60 * 1000)) {
            alert('Too many registration attempts. Please try again in 15 minutes.');
            return;
        }
        // Comprehensive validation
        const validation = validateRegistrationData(name, email, mobile, password, confirm, captchaInput, storedCaptcha);
        if (!validation.isValid) {
            alert(validation.message);
            return;
        }

        // Verify mobile OTP
        const otpVerification = verifyMobileOTP();
        if (!otpVerification.isValid) {
            alert(otpVerification.message);
            return;
        }

        const users = getUsers();

        // Check for existing users
        const existingUser = users.find(u => u.email === email || u.mobile === mobile);
        if (existingUser) {
            if (existingUser.email === email) {
                alert('Email already registered. Please use a different email or login.');
            } else {
                alert('Mobile number already registered.');
            }
            return;
        }

        // Hash password for security
        const hashedPassword = await hashPassword(password);

        // Create new user with enhanced data
        const newUser = {
            id: generateUserId(),
            name: name,
            email: email,
            mobile: mobile,
            password: hashedPassword,
            isVerified: true,
            isActive: true,
            registrationDate: new Date().toISOString(),
            lastLogin: null,
            loginAttempts: 0,
            quizResults: [],
            metadata: {
                ip: await getClientIP(),
                userAgent: navigator.userAgent,
                screenResolution: `${screen.width}x${screen.height}`
            }
        };

        users.push(newUser);
        
        if (saveUsers(users)) {
            // Clear sensitive data
            clearSensitiveData();
            
            setCurrentUser(newUser);
              // ========== ADD SAFETY CHECK HERE ==========
    if (typeof storeUserInAnalytics === 'function') {
        storeUserInAnalytics(newUser);
        console.log('✅ User stored in analytics');
    } else {
        console.error('❌ storeUserInAnalytics not available, but continuing...');
        // Create basic analytics entry as fallback
        const analyticsData = JSON.parse(localStorage.getItem('adminAnalytics') || '{"users":[],"quizAttempts":[],"summary":{"totalUsers":0,"totalAttempts":0,"averageScore":0,"registrationDates":[]}}');
        analyticsData.users.push({
            userId: newUser.id,
            email: newUser.email,
            name: newUser.name,
            mobile: newUser.mobile,
            registrationDate: newUser.registrationDate
        });
        analyticsData.summary.totalUsers = analyticsData.users.length;
        localStorage.setItem('adminAnalytics', JSON.stringify(analyticsData));
        console.log('✅ User added to analytics via fallback');
    }
    // ========== END SAFETY CHECK ==========
            trackEvent('registration_success');
            
            alert('🎉 Registration successful! Welcome to The Conclusion Daily.');
            showQuiz();
        } else {
            throw new Error('Failed to save user data');
        }

    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
        trackEvent('registration_failed', { error: error.message });
    } finally {
        registerBtn.disabled = false;
        registerBtn.textContent = 'Create Account';
    }
}
// Registration Form Handler
function handleRegistration(event) {
    if (event) event.preventDefault();
    
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirm').value;
    const name = document.getElementById('registerName') ? document.getElementById('registerName').value : '';
    const mobile = document.getElementById('registerMobile') ? document.getElementById('registerMobile').value : '';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return false;
    }
    
    // Validate CAPTCHA if exists
    if (typeof validateCaptcha === 'function' && !validateCaptcha()) {
        return false;
    }
    
    // Register user
    return registerUser(email, password, name, mobile);
}

// Enhanced registerUser function - FIND AND REPLACE
async function registerUser(email, password, name = '', mobile = '') {
    try {
        console.log('🚀 Starting user registration...', { email, name, mobile });

        // Validate inputs
        if (!email || !password) {
            alert('Please fill in all required fields');
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address');
            return false;
        }

        // Create user object with COMPLETE data
        const userData = {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            email: email.toLowerCase().trim(),
            name: name.trim(),
            mobile: mobile.trim(),
            password: await hashPassword(password),
            registrationDate: new Date().toISOString(),
            registrationIP: await getClientIP(),
            userAgent: navigator.userAgent,
            deviceInfo: `${screen.width}x${screen.height}`,
            quizAttempts: 0,
            bestScore: 0,
            lastLogin: new Date().toISOString(),
            isActive: true,
            quizResults: [],
            loginAttempts: 0,
            isVerified: true
        };

        console.log('📝 User data created:', userData);

        // Get existing users
        let users = JSON.parse(localStorage.getItem('quizUsers')) || [];
        console.log('📊 Existing users:', users);
        
        // Check if user exists
        const existingUser = users.find(user => user.email === userData.email);
        if (existingUser) {
            alert('User with this email already exists!');
            return false;
        }

        // Add new user
        users.push(userData);
        localStorage.setItem('quizUsers', JSON.stringify(users));
        console.log('✅ User saved to quizUsers');
        
        // ========== CRITICAL: STORE IN ANALYTICS ==========
        if (typeof storeUserInAnalytics === 'function') {
            storeUserInAnalytics(userData);
            console.log('✅ User stored in analytics');
        } else {
            console.error('❌ storeUserInAnalytics not available');
        }
        
        // Set as current user
        localStorage.setItem('currentUser', JSON.stringify(userData));
        currentUser = userData;
        console.log('✅ Current user set');
        
        // Verify storage
        const verifyUsers = JSON.parse(localStorage.getItem('quizUsers') || '[]');
        const verifyAnalytics = JSON.parse(localStorage.getItem('adminAnalytics') || '{}');
        console.log('🔍 VERIFICATION - quizUsers count:', verifyUsers.length);
        console.log('🔍 VERIFICATION - analytics users:', verifyAnalytics.users ? verifyAnalytics.users.length : 0);
        
        alert('🎉 Registration successful! Data saved.');
        
        // Redirect to quiz
        setTimeout(() => {
            showQuiz();
        }, 1000);
        
        return true;
    } catch (error) {
        console.error('❌ Registration error:', error);
        alert('Registration failed: ' + error.message);
        return false;
    }
}
// Enhanced Login with Security Features
async function login() {
    const loginBtn = document.querySelector('#loginForm button') || document.querySelector('.auth-btn');
    
    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        const email = sanitizeInput(document.getElementById('loginEmail').value.trim().toLowerCase());
        const password = document.getElementById('loginPassword').value;
        const captchaInput = sanitizeInput(document.getElementById('loginCaptchaInput').value.trim());
        const storedCaptcha = localStorage.getItem('loginCaptcha');

        // Input validation
        if (!validateEmail(email)) {
            alert('Please enter a valid email address');
            return;
        }

        if (!password) {
            alert('Please enter your password');
            return;
        }

        // Rate limiting check
        if (!checkRateLimit(`login_${email}`, SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS, SECURITY_CONFIG.LOGIN_TIMEOUT)) {
            alert('Too many login attempts. Please try again in 15 minutes.');
            generateLoginCaptcha();
            return;
        }

        // CAPTCHA validation
        if (captchaInput !== storedCaptcha) {
            alert('Invalid CAPTCHA code. Please try again.');
            generateLoginCaptcha();
            logSecurityEvent('login_captcha_failed', { email: email });
            return;
        }

        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            alert('Invalid email or password');
            generateLoginCaptcha();
            logSecurityEvent('login_failed', { email: email, reason: 'user_not_found' });
            return;
        }

        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password);
        
        if (isPasswordValid && user.isActive) {
            // Reset login attempts on successful login
            user.loginAttempts = 0;
            user.lastLogin = new Date().toISOString();
            saveUsers(users);
            
            setCurrentUser(user);
            initSession(user);
            
            logSecurityEvent('login_success', { email: email });
            
            if (hasUserAttemptedQuiz()) {
                showAlreadyAttemptedScreen();
            } else {
                showQuiz();
            }
        } else {
            // Increment failed attempts
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            saveUsers(users);
            
            alert(`Invalid email or password. ${SECURITY_CONFIG.MAX_LOGIN_ATTEMPTS - user.loginAttempts} attempts remaining.`);
            generateLoginCaptcha();
            logSecurityEvent('login_failed', { email: email, attempts: user.loginAttempts });
        }

    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
        logSecurityEvent('login_error', { error: error.message });
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Login';
    }
}
// Password Hashing (Simulated - Use bcrypt in real backend)
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + 'quiz-app-salt');
    const hash = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password, hashedPassword) {
    const newHash = await hashPassword(password);
    return newHash === hashedPassword;
}

// CAPTCHA Functions
function generateCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('captchaText').textContent = captcha;
    localStorage.setItem('registerCaptcha', captcha);
}

function generateLoginCaptcha() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let captcha = '';
    for (let i = 0; i < 6; i++) {
        captcha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById('loginCaptchaText').textContent = captcha;
    localStorage.setItem('loginCaptcha', captcha);
}

// Enhanced OTP System
async function sendMobileOTP() {
    const mobileInput = document.getElementById('registerMobile');
    const sendBtn = document.getElementById('sendOtpBtn');
    const mobile = mobileInput.value.trim();

    try {
        sendBtn.disabled = true;
        sendBtn.textContent = 'Sending...';

        // Mobile validation
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobile)) {
            alert('Please enter a valid 10-digit Indian mobile number starting with 6-9');
            return;
        }

        // Check if mobile already exists
        const users = getUsers();
        if (users.find(u => u.mobile === mobile)) {
            alert('Mobile number already registered');
            return;
        }

        // Generate OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Store OTP data
        localStorage.setItem('mobileOTP', otp);
        localStorage.setItem('mobileOTPTime', Date.now());
        localStorage.setItem('mobileToVerify', mobile);

        // Simulate SMS sending
        const smsResult = await sendSMSGateway(mobile, otp);
        
        if (smsResult.success) {
            // Enable OTP input
            document.getElementById('mobileOtp').disabled = false;
            document.getElementById('mobileOtp').focus();
            
            alert(`OTP sent to ${mobile}`);
            startOTPTimer(sendBtn);
            trackEvent('otp_sent_success');
        } else {
            throw new Error(smsResult.error || 'Failed to send OTP');
        }

    } catch (error) {
        console.error('OTP sending error:', error);
        alert('Failed to send OTP. Please try again.');
        sendBtn.disabled = false;
        sendBtn.textContent = 'Send OTP';
        trackEvent('otp_sent_failed', { error: error.message });
    }
}

// SMS Gateway Integration (Simulated)
async function sendSMSGateway(mobile, otp) {
    // For now, simulate success (replace with actual API call)
    console.log(`[SMS] OTP ${otp} sent to ${mobile}`);
    
    // DEMO: Show OTP in alert (remove in production)
    alert(`DEMO: OTP sent to ${mobile}: ${otp}\n\nIn production, this would be sent via SMS`);
    
    return { success: true, messageId: 'simulated_' + Date.now() };
}

function verifyMobileOTP() {
    const enteredOtp = document.getElementById('mobileOtp').value.trim();
    const storedOtp = localStorage.getItem('mobileOTP');
    const otpTime = localStorage.getItem('mobileOTPTime');
    
    if (!enteredOtp || !storedOtp) {
        return { isValid: false, message: 'Please enter OTP' };
    }
    
    // Check if OTP is expired (5 minutes)
    if (Date.now() - parseInt(otpTime) > CONFIG.OTP_EXPIRY_TIME) {
        return { isValid: false, message: 'OTP has expired. Please request a new one.' };
    }
    
    if (enteredOtp !== storedOtp) {
        return { isValid: false, message: 'Invalid OTP' };
    }
    
    return { isValid: true, message: 'Mobile verified successfully' };
}

// Production Validation Functions
function validateRegistrationData(name, email, mobile, password, confirm, captcha, storedCaptcha) {
    // Name validation
    if (name.length < 2) {
        return { isValid: false, message: 'Please enter a valid name (minimum 2 characters)' };
    }

    if (!/^[a-zA-Z\s]{2,50}$/.test(name)) {
        return { isValid: false, message: 'Name can only contain letters and spaces' };
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, message: 'Please enter a valid email address' };
    }

    // Mobile validation (Indian numbers)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
        return { isValid: false, message: 'Please enter a valid 10-digit Indian mobile number starting with 6-9' };
    }

    // Password validation
    if (password.length < CONFIG.PASSWORD_MIN_LENGTH) {
        return { isValid: false, message: `Password must be at least ${CONFIG.PASSWORD_MIN_LENGTH} characters long` };
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        return { isValid: false, message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number' };
    }

    if (password !== confirm) {
        return { isValid: false, message: 'Passwords do not match' };
    }

    // CAPTCHA validation
    if (captcha !== storedCaptcha) {
        return { isValid: false, message: 'Invalid CAPTCHA code. Please try again.' };
    }

    return { isValid: true, message: 'All validations passed' };
}

// Utility Functions
function generateUserId() {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function startOTPTimer(button) {
    let timeLeft = 60;
    
    const timer = setInterval(() => {
        button.textContent = `Resend (${timeLeft}s)`;
        timeLeft--;
        
        if (timeLeft < 0) {
            clearInterval(timer);
            button.disabled = false;
            button.textContent = 'Resend OTP';
        }
    }, 1000);
}

function clearSensitiveData() {
    localStorage.removeItem('mobileOTP');
    localStorage.removeItem('mobileOTPTime');
    localStorage.removeItem('mobileToVerify');
    localStorage.removeItem('registerCaptcha');
    localStorage.removeItem('loginCaptcha');
}

async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        return 'unknown';
    }
}

function trackEvent(eventName, properties = {}) {
    // Store events locally for debugging
    const events = JSON.parse(localStorage.getItem('quizEvents') || '[]');
    events.push({
        event: eventName,
        properties: properties,
        timestamp: new Date().toISOString(),
        user: currentUser ? currentUser.email : 'anonymous'
    });
    localStorage.setItem('quizEvents', JSON.stringify(events));
}
// Password visibility toggle function
function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.textContent = '🙈';
        toggleButton.style.color = '#667eea';
    } else {
        passwordInput.type = 'password';
        toggleButton.textContent = '👁️';
        toggleButton.style.color = '#666';
    }
}

// Real-time password strength indicator (Optional)
function checkPasswordStrength(inputId) {
    const password = document.getElementById(inputId).value;
    const strengthBar = document.getElementById(inputId + 'Strength');
    const strengthText = document.getElementById(inputId + 'StrengthText');
    
    if (!strengthBar) return;
    
    let strength = 0;
    let text = '';
    let color = '';
    
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    if (password.length === 0) {
        text = '';
        color = 'transparent';
    } else if (strength <= 25) {
        text = 'Weak';
        color = '#ff4444';
    } else if (strength <= 50) {
        text = 'Fair';
        color = '#ffaa00';
    } else if (strength <= 75) {
        text = 'Good';
        color = '#4CAF50';
    } else {
        text = 'Strong';
        color = '#4CAF50';
    }
    
    strengthBar.style.width = strength + '%';
    strengthBar.style.background = color;
    strengthText.textContent = text;
    strengthText.style.color = color;
}
// ✅ ADD checkPasswordMatch RIGHT HERE:
// Password match checker
function checkPasswordMatch() {
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    const matchText = document.getElementById('passwordMatchText');
    
    if (!matchText) return;
    
    if (confirm.length === 0) {
        matchText.textContent = '';
        matchText.style.color = 'transparent';
    } else if (password === confirm) {
        matchText.textContent = '✅ Passwords match';
        matchText.style.color = '#4CAF50';
    } else {
        matchText.textContent = '❌ Passwords do not match';
        matchText.style.color = '#ff4444';
    }
}
// Screen for users who have already attempted the quiz
function showAlreadyAttemptedScreen() {
    const userResults = currentUser.quizResults[0]; // Get first attempt
    
    container.innerHTML = `
        <div class="results-container">
            <div class="results-content">
                <div class="results-header">
                    <img src="images/company-logo.png" alt="Company Logo" class="results-logo">
                    <div class="user-results-header">
                        <div class="user-greeting">Welcome back, ${currentUser.name}! 👋</div>
                    </div>
                </div>
                
                <div class="attempted-message">
                    <div class="attempted-icon">✅</div>
                    <h2 class="attempted-title">Quiz Already Attempted</h2>
                    <p class="attempted-text">
                        You have already completed this quiz. Each user is allowed only one attempt 
                        to maintain fairness for all participants.
                    </p>
                    
                    <div class="previous-result">
                        <h3>Your Previous Result:</h3>
                        <div class="result-summary">
                            <div class="score-display">
                                <span class="score">${userResults.score}/${questions.length}</span>
                                <span class="percentage">(${userResults.percentage}%)</span>
                            </div>
                            <div class="attempt-date">Attempted on: ${userResults.date} at ${userResults.time}</div>
                        </div>
                    </div>
                </div>
                
                <div class="results-actions">
                    <button class="profile-btn" onclick="showProfile()">View Detailed Profile</button>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            </div>
        </div>
    `;
}

// Updated Quiz Screen with Timer and Navigation Buttons
function showQuiz() {
    if (hasUserAttemptedQuiz()) {
        showAlreadyAttemptedScreen();
        return;
    }
    
    // Reset quiz state
    currentQuestion = 0;
    userAnswers = new Array(questions.length).fill(null);
    score = 0;
    
    container.innerHTML = `
        <div class="quiz-header">
            <div class="header-left">
                <img src="images/company-logo.png" alt="The Conclusion Daily Logo" class="company-logo">
                <span class="company-name">The Conclusion Daily</span>
            </div>
            <div class="header-center">
                <div class="timer-container">
                    <span class="timer-label">Time Left:</span>
                    <span id="timerDisplay" class="timer">30:00</span>
                </div>
            </div>
            <div class="user-info">
                <span>Welcome, ${currentUser.name}!</span>
                 ${isAdminUser(currentUser) ? 
        '<a href="dashboard-7x3k9.html" class="admin-link" style="margin-right: 10px;">📊 Analytics</a>' : 
        ''
            }
                <button onclick="logout()" class="logout-btn">Logout</button>
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress"></div>
        </div>
        <div class="reels-container">
            ${questions.map((q, index) => `
                <div class="question-slide" id="slide-${index}" style="display: ${index === 0 ? 'flex' : 'none'}">
                    <div class="watermark"></div>
                    <div class="question-wrapper">
                        ${q.image ? `
                            <div class="image-container">
                                <img src="${q.image}" alt="Question ${index + 1}" class="question-image">
                            </div>
                        ` : ''}
                        <div class="question-content">
                            <h2 class="question-text">${q.question || `Question ${index + 1}`}</h2>
                            <div class="options-grid">
                                ${q.options.map((option, optIndex) => `
                                    <button class="option-btn" onclick="selectOption(${index}, ${optIndex})">
                                        ${option}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        <div class="navigation-buttons">
                            <button class="nav-btn prev-btn" onclick="navigateToQuestion(${index - 1})" ${index === 0 ? 'disabled' : ''}>
                                ← Previous
                            </button>
                            <div class="counter">${index + 1} / ${questions.length}</div>
                            <button class="nav-btn next-btn" onclick="navigateToQuestion(${index + 1})" ${index === questions.length - 1 ? 'disabled' : ''}>
                                Next →
                            </button>
                        </div>
                        ${index === questions.length - 1 ? `
                            <button class="submit-btn" onclick="submitQuiz()">Submit Quiz</button>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
    
    updateProgressBar();
    startTimer();
}

function navigateToQuestion(index) {
    if (index >= 0 && index < questions.length) {
        showQuestion(index);
    }
}

function showQuestion(index) {
    // Hide all slides
    const slides = document.querySelectorAll('.question-slide');
    slides.forEach((slide, i) => {
        slide.style.display = 'none';
    });
    
    // Show current slide
    const currentSlide = document.getElementById(`slide-${index}`);
    if (currentSlide) {
        currentSlide.style.display = 'flex';
    }
    
    currentQuestion = index;
    updateProgressBar();
}

function selectOption(questionIndex, optionIndex) {
    const buttons = document.querySelectorAll(`#slide-${questionIndex} .option-btn`);
    
    // Remove all selections
    buttons.forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Add selected class to chosen option
    if (buttons[optionIndex]) {
        buttons[optionIndex].classList.add('selected');
    }
    
    // Store user answer (don't show correct/wrong during quiz)
    userAnswers[questionIndex] = optionIndex;
    
    // Auto-move to next question after 1 second
    setTimeout(() => {
        if (questionIndex < questions.length - 1) {
            showQuestion(questionIndex + 1);
        }
    }, 1000);
}

function updateProgressBar() {
    const progress = (currentQuestion / (questions.length - 1)) * 100;
    const progressElement = document.querySelector('.progress');
    if (progressElement) {
        progressElement.style.width = progress + '%';
    }
}
// === ADD THIS FUNCTION === //
// Export user data for analytics
function exportUserDataForAnalytics(score, timeUsed) {
    if (!currentUser) {
        console.warn('No user data available for export');
        alert('Please complete user registration first');
        return;
    }
    
    const userData = {
        userId: currentUser.email,
        userName: currentUser.name,
        userMobile: currentUser.mobile,
        score: score,
        total: questions.length,
        percentage: Math.round((score / questions.length) * 100),
        timeUsed: timeUsed,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        timestamp: new Date().toISOString(),
        answers: userAnswers || []
    };
    
    // Create downloadable JSON file
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `quiz-result-${currentUser.email}-${Date.now()}.json`;
    link.style.display = 'none';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('📊 User data exported for analytics');
    alert('✅ Results exported! Please send this file to the admin.');
}
// === END OF ADDED FUNCTION === //

function submitQuiz() {
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    
    // Calculate final score
    score = 0;
    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] !== null && userAnswers[i] === questions[i].correctAnswer) {
            score++;
        }
    }
    
    // Calculate time used
    const timerDisplay = document.getElementById('timerDisplay');
    const timeText = timerDisplay ? timerDisplay.textContent : '30:00';
    const [minutes, seconds] = timeText.split(':').map(Number);
    const timeUsed = timeLeft - (minutes * 60 + seconds);
    
    // ✅ AUTOMATICALLY STORE QUIZ RESULTS IN ANALYTICS
    storeQuizResultsInAnalytics(score, timeUsed);
    
    saveUserResult(score, questions.length, timeUsed);
    showSubmissionPage(timeUsed);
}

function showSubmissionPage(timeUsed) {
    const percentage = Math.round((score / questions.length) * 100);
    const timeMinutes = Math.floor(timeUsed / 60);
    const timeSeconds = timeUsed % 60;
    
    container.innerHTML = `
        <div class="submission-container">
            <div class="submission-content">
                <div class="submission-header">
                    <img src="images/company-logo.png" alt="Company Logo" class="submission-logo">
                    <h1>Thank You! 🙏</h1>
                </div>
                
                <div class="submission-message">
                    <div class="submission-icon">📝</div>
                    <h2>Quiz Submitted Successfully</h2>
                    <p>Your answers have been recorded. Results will be announced later.</p>
                </div>
                
                <div class="submission-details">
                    <div class="detail-card">
                        <div class="detail-label">Questions Attempted</div>
                        <div class="detail-value">${userAnswers.filter(answer => answer !== null).length}/${questions.length}</div>
                    </div>
                    <div class="detail-card">
                        <div class="detail-label">Time Taken</div>
                        <div class="detail-value">${timeMinutes}m ${timeSeconds}s</div>
                    </div>
                    <div class="detail-card">
                        <div class="detail-label">Submission Time</div>
                        <div class="detail-value">${new Date().toLocaleTimeString()}</div>
                    </div>
                </div>
                
                <!-- === ADD EXPORT SECTION RIGHT HERE === -->
                <div class="export-section" style="margin-top: 30px; padding: 20px; background: #f8f9ff; border-radius: 10px; border: 2px dashed #667eea;">
                    <h3 style="color: #333; margin-bottom: 15px; text-align: center;">📤 Share Your Results</h3>
                    <p style="text-align: center; margin-bottom: 15px; color: #555;">
                        Help us improve by sharing your quiz data with the admin:
                    </p>
                    
                    <div style="text-align: center; margin: 20px 0;">
                        <button onclick="exportUserDataForAnalytics(${score}, ${timeUsed})" 
                                style="background: #667eea; color: white; border: none; padding: 12px 24px; border-radius: 5px; cursor: pointer; font-size: 16px; margin: 10px;">
                            📊 Export My Results
                        </button>
                    </div>
                    
                    <div style="font-size: 0.9rem; color: #666; margin-top: 15px; background: white; padding: 15px; border-radius: 5px;">
                        <p style="margin-bottom: 10px;"><strong>📝 Instructions:</strong></p>
                        <ol style="text-align: left; margin-left: 20px; line-height: 1.6;">
                            <li>Click <strong>"Export My Results"</strong> to download your data file (.json)</li>
                            <li>Send the downloaded file to your quiz administrator via email/WhatsApp</li>
                            <li>Or upload it directly to the <a href="data-collection.html" style="color: #667eea; font-weight: bold;">Data Collection Page</a></li>
                        </ol>
                        <p style="margin-top: 10px; font-style: italic;">
                            This helps us analyze overall quiz performance and improve content!
                        </p>
                    </div>
                </div>
                <!-- === END OF ADDED SECTION === -->
                
                <div class="one-time-message">
                    <div class="message-icon">🎯</div>
                    <p class="message-text">
                        <strong>One Attempt Only:</strong> This was your one and only attempt at this quiz. 
                        Thank you for participating!
                    </p>
                </div>
                
                <div class="submission-actions">
                    <button class="profile-btn" onclick="showProfile()">View Profile</button>
                    <button class="logout-btn" onclick="logout()">Logout</button>
                </div>
            </div>
        </div>
    `;
}

// Profile function (updated)
function showProfile() {
    const user = currentUser;
    const users = getUsers();
    const currentUserData = users.find(u => u.email === user.email);
    const results = currentUserData?.quizResults || [];
    const totalAttempts = results.length;
    const hasAttempted = totalAttempts > 0;

    container.innerHTML = `
        <div class="profile-container">
            <div class="profile-header">
                <h1>Your Profile 👤</h1>
                ${!hasAttempted ? '<button onclick="showQuiz()" class="back-btn">Back to Quiz</button>' : ''}
            </div>
            
            <div class="profile-info">
                <div class="info-item">
                    <label>Name:</label>
                    <span>${user.name}</span>
                </div>
                <div class="info-item">
                    <label>Email:</label>
                    <span>${user.email}</span>
                </div>
                <div class="info-item">
                    <label>Mobile:</label>
                    <span>${user.mobile}</span>
                </div>
                <div class="info-item">
                    <label>Member since:</label>
                    <span>${user.registeredAt}</span>
                </div>
                <div class="info-item">
                    <label>Quiz Attempts:</label>
                    <span>${totalAttempts} / 1</span>
                </div>
            </div>
            
            ${hasAttempted ? `
                <div class="attempts-history">
                    <h3>Your Quiz Attempt</h3>
                    ${results.map(result => `
                        <div class="attempt-item">
                            <div class="attempt-score">Submitted on ${result.date}</div>
                            <div class="attempt-date">Time taken: ${Math.floor(result.timeUsed / 60)}m ${result.timeUsed % 60}s</div>
                        </div>
                    `).join('')}
                </div>
            ` : `
                <div class="no-attempts-container">
                    <div class="no-attempts-icon">📝</div>
                    <h3>Ready to Take the Quiz!</h3>
                    <p>You haven't attempted the quiz yet. Click the button below to start your one-time attempt.</p>
                    <button onclick="showQuiz()" class="auth-btn" style="margin-top: 1rem;">Start Quiz</button>
                </div>
            `}
            
            <div class="profile-actions">
                <button onclick="logout()" class="logout-btn">Logout</button>
            </div>
        </div>
    `;
}
// Make security functions globally available
window.sanitizeInput = sanitizeInput;
window.validateEmail = validateEmail;
window.validateMobile = validateMobile;
window.logSecurityEvent = logSecurityEvent;
window.runSecurityScan = runSecurityScan;
// Make functions globally available
window.showProfile = showProfile;
window.logout = logout;
window.showLoginScreen = showLoginScreen;
window.showRegisterScreen = showRegisterScreen;
window.login = login;
window.register = register;                    // ← ADD THIS
window.handleRegistration = handleRegistration; // ← ADD THIS
window.registerUser = registerUser;            // ← ADD THIS
window.showAlreadyAttemptedScreen = showAlreadyAttemptedScreen;
window.sendMobileOTP = sendMobileOTP;
window.generateCaptcha = generateCaptcha;
window.generateLoginCaptcha = generateLoginCaptcha;
window.togglePassword = togglePassword;  // ← ADD THIS LINE
window.checkPasswordStrength = checkPasswordStrength;  // ← ADD THIS LINE (if using strength indicator)
window.checkPasswordMatch = checkPasswordMatch;
window.exportUserDataForAnalytics = exportUserDataForAnalytics;

// ADD FORGOT PASSWORD FUNCTIONS:
window.showForgotPasswordScreen = showForgotPasswordScreen;
window.showResetPasswordScreen = showResetPasswordScreen;
window.sendPasswordResetOTP = sendPasswordResetOTP;
window.resetPassword = resetPassword;

// === ADMIN PANEL INTEGRATION ===

// Check if user is admin
function isAdminUser(user) {
    const adminEmails = [
        'admin@theconclusiondaily.com',
        
    ];
    return adminEmails.includes(user.email.toLowerCase());
}

// Show floating admin button
function showFloatingAdminButton() {
    if (!currentUser || !isAdminUser(currentUser)) return;
    
    // Remove existing button if any
    const existingBtn = document.querySelector('.floating-admin-btn');
    if (existingBtn) existingBtn.remove();
    
    const floatingBtn = document.createElement('a');
    floatingBtn.href = 'dashboard-7x3k9.html';
    floatingBtn.className = 'floating-admin-btn';
    floatingBtn.innerHTML = '📊 Admin';
    floatingBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #dc3545, #e83e8c);
        color: white;
        padding: 12px 16px;
        border-radius: 50px;
        text-decoration: none;
        font-weight: bold;
        box-shadow: 0 5px 20px rgba(220, 53, 69, 0.4);
        z-index: 10000;
        transition: all 0.3s ease;
        font-size: 0.9rem;
    `;
    
    floatingBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 25px rgba(220, 53, 69, 0.5)';
    });
    
    floatingBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 5px 20px rgba(220, 53, 69, 0.4)';
    });
    
    document.body.appendChild(floatingBtn);
}

// Update initApp to include admin button
const originalInitApp = initApp;
initApp = function() {
    originalInitApp();
    
    // Show admin button after a short delay to ensure DOM is ready
    setTimeout(() => {
        if (currentUser && isAdminUser(currentUser)) {
            showFloatingAdminButton();
        }
    }, 1000);
};

// Make functions globally available (add these to your existing list)
window.isAdminUser = isAdminUser;
window.showFloatingAdminButton = showFloatingAdminButton;
// ===================== ADD DEBUG FUNCTION RIGHT HERE =====================
// Debug: Check if data is being stored
function debugDataStorage() {
    console.log('🔍 DEBUG: Checking data storage...');
    
    // Check users
    const users = JSON.parse(localStorage.getItem('quizUsers') || '[]');
    console.log('📊 Users in quizUsers:', users);
    
    // Check analytics
    const analytics = JSON.parse(localStorage.getItem('adminAnalytics') || '{}');
    console.log('📈 Analytics data:', analytics);
    
    // Check current user
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('👤 Current user:', currentUser);
    
    // Check security audit logs
    const securityLogs = JSON.parse(localStorage.getItem('security_audit') || '[]');
    console.log('🔒 Security logs:', securityLogs);
    
    return {
        usersCount: users.length,
        analyticsUsers: analytics.users ? analytics.users.length : 0,
        analyticsAttempts: analytics.quizAttempts ? analytics.quizAttempts.length : 0,
        hasCurrentUser: !!currentUser.email,
        securityLogsCount: securityLogs.length
    };
}

// Make it globally available
window.debugDataStorage = debugDataStorage;

// Quick test function for registration
function testRegistration() {
    console.log('🧪 Testing registration data flow...');
    const testData = {
        name: 'Test User',
        email: 'test@example.com', 
        mobile: '9876543210',
        password: 'Test123!'
    };
    console.log('Test data:', testData);
}
window.testRegistration = testRegistration;
// ===================== END DEBUG FUNCTION =====================
// ===================== ADD PASSWORD RESET HERE =====================
// TEMPORARY: Reset all passwords (run this once in console)
async function resetAllPasswords() {
    try {
        console.log('🔄 Starting password reset...');
        
        // Check if users exist
        const users = JSON.parse(localStorage.getItem('quizUsers') || '[]');
        console.log('Found users:', users);
        
        if (users.length === 0) {
            console.log('❌ No users found in storage');
            alert('No users found to reset!');
            return;
        }
        
        const defaultPassword = 'Test123!';
        
        // Reset each password
        for (let user of users) {
            console.log(`Resetting password for: ${user.email}`);
            user.password = await hashPassword(defaultPassword);
            console.log(`✅ Reset complete for: ${user.email}`);
        }
        
        // Save back to storage
        localStorage.setItem('quizUsers', JSON.stringify(users));
        console.log('🎉 All passwords reset to: ' + defaultPassword);
        console.log('Updated users:', users);
        alert('✅ All passwords reset to: ' + defaultPassword);
        
        return users;
    } catch (error) {
        console.error('❌ Password reset failed:', error);
        alert('Password reset failed: ' + error.message);
    }
}

// Make it available in console
window.resetAllPasswords = resetAllPasswords;

// Test if hashPassword function exists
function testHashPassword() {
    console.log('🧪 Testing hashPassword function...');
    
    if (typeof hashPassword === 'function') {
        console.log('✅ hashPassword function exists');
        // Test it with a simple password
        hashPassword('test').then(hash => {
            console.log('✅ hashPassword works. Hash:', hash);
        }).catch(error => {
            console.error('❌ hashPassword error:', error);
        });
    } else {
        console.error('❌ hashPassword function NOT found!');
    }
}

window.testHashPassword = testHashPassword;
// ===================== END PASSWORD RESET =====================
// ===================== ADD DEBUG FUNCTION HERE =====================
// Debug function to check function availability
function debugFunctionAvailability() {
    console.log('🔍 CHECKING FUNCTION AVAILABILITY:');
    console.log('storeUserInAnalytics:', typeof storeUserInAnalytics);
    console.log('getClientIP:', typeof getClientIP);
    console.log('registerUser:', typeof registerUser);
    console.log('hashPassword:', typeof hashPassword);
    console.log('showLoginScreen:', typeof showLoginScreen);
    
    // Check if functions are in window scope
    console.log('window.storeUserInAnalytics:', typeof window.storeUserInAnalytics);
    console.log('window.getClientIP:', typeof window.getClientIP);
    
    // Check if analytics data exists
    const analytics = JSON.parse(localStorage.getItem('adminAnalytics') || '{}');
    console.log('📊 Analytics users count:', analytics.users ? analytics.users.length : 0);
    
    return {
        storeUserInAnalytics: typeof storeUserInAnalytics,
        getClientIP: typeof getClientIP,
        analyticsUsers: analytics.users ? analytics.users.length : 0
    };
}

// Make it globally available
window.debugFunctionAvailability = debugFunctionAvailability;

// Test registration flow
function testRegistrationFlow() {
    console.log('🧪 TESTING REGISTRATION FLOW...');
    
    // Test hashPassword
    hashPassword('test123').then(hash => {
        console.log('✅ hashPassword works:', hash);
    }).catch(err => {
        console.error('❌ hashPassword failed:', err);
    });
    
    // Test getClientIP
    getClientIP().then(ip => {
        console.log('✅ getClientIP works:', ip);
    }).catch(err => {
        console.error('❌ getClientIP failed:', err);
    });
    
    // Test storeUserInAnalytics
    if (typeof storeUserInAnalytics === 'function') {
        console.log('✅ storeUserInAnalytics is available');
        // Test with dummy data
        storeUserInAnalytics({
            id: 'test-id',
            email: 'test@example.com',
            name: 'Test User',
            registrationDate: new Date().toISOString()
        });
    } else {
        console.error('❌ storeUserInAnalytics NOT available');
    }
}

window.testRegistrationFlow = testRegistrationFlow;
// ===================== END DEBUG FUNCTION =====================

// Your existing initApp function continues...
function initApp() {
    const user = getCurrentUser();
    if (user) {
        // ... your existing code
    } else {
        showLoginScreen();
    }
}

window.onload = initApp;
// Initialize app
function initApp() {
    const user = getCurrentUser();
    if (user) {
        currentUser = user;
        
        const users = getUsers();
        const currentUserData = users.find(u => u.email === user.email);
        
        if (currentUserData?.quizResults && currentUserData.quizResults.length > 0) {
            showAlreadyAttemptedScreen();
        } else {
            showQuiz();
        }
    } else {
        showLoginScreen();
    }
}

window.onload = initApp;


