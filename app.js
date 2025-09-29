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

// Production Configuration
const CONFIG = {
    OTP_EXPIRY_TIME: 5 * 60 * 1000, // 5 minutes
    MAX_LOGIN_ATTEMPTS: 5,
    PASSWORD_MIN_LENGTH: 8,
    SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes
};

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
    if (quizTimer) {
        clearInterval(quizTimer);
    }
    localStorage.removeItem('currentUser');
    currentUser = null;
    showLoginScreen();
}

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
// Authentication Screens
function showLoginScreen() {
    container.innerHTML = `
        <div class="auth-container">
            <div class="auth-box">
                <div class="auth-header">
                    <img src="images/company-logo.png" alt="The Conclusion Daily Logo" class="auth-logo">
                    <h1 class="auth-title">Welcome to The Conclusion Daily! 🎯</h1>
                </div>
                <p class="auth-subtitle">Test your knowledge with our interactive quiz</p>
                
                <div class="auth-form">
                    <input type="email" id="loginEmail" placeholder="Enter your email" class="auth-input">
                    <input type="password" id="loginPassword" placeholder="Enter your password" class="auth-input">
                    <button onclick="login()" class="auth-btn">Login</button>
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
                    <input type="password" id="registerPassword" placeholder="Create Password (min. 8 characters)" class="auth-input" required>
                    <input type="password" id="registerConfirm" placeholder="Confirm Password" class="auth-input" required>
                    
                    <!-- CAPTCHA Section -->
                    <div class="captcha-container">
                        <div class="captcha-display">
                            <span id="captchaText"></span>
                            <button type="button" onclick="generateCaptcha()" class="refresh-captcha">↻</button>
                        </div>
                        <input type="text" id="captchaInput" placeholder="Enter CAPTCHA code" class="auth-input" required>
                    </div>
                    
                    <button onclick="register()" class="auth-btn" id="registerBtn">Create Account</button>
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

// Enhanced Login with Production Features
async function login() {
    const loginBtn = document.querySelector('#loginForm button') || document.querySelector('.auth-btn');
    
    try {
        loginBtn.disabled = true;
        loginBtn.textContent = 'Logging in...';

        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;
        const captchaInput = document.getElementById('loginCaptchaInput').value.trim();
        const storedCaptcha = localStorage.getItem('loginCaptcha');

        // Validation
        if (!email || !password || !captchaInput) {
            alert('Please fill all fields');
            return;
        }

        if (captchaInput !== storedCaptcha) {
            alert('Invalid CAPTCHA code. Please try again.');
            generateLoginCaptcha();
            return;
        }

        const users = getUsers();
        const user = users.find(u => u.email === email);

        if (!user) {
            alert('Invalid email or password');
            generateLoginCaptcha();
            return;
        }

        // Check if account is locked
        if (user.loginAttempts >= CONFIG.MAX_LOGIN_ATTEMPTS) {
            alert('Account temporarily locked due to too many failed attempts. Please try again later.');
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
            trackEvent('login_success');
            
            if (hasUserAttemptedQuiz()) {
                showAlreadyAttemptedScreen();
            } else {
                showQuiz();
            }
        } else {
            // Increment failed attempts
            user.loginAttempts = (user.loginAttempts || 0) + 1;
            saveUsers(users);
            
            alert(`Invalid email or password. ${CONFIG.MAX_LOGIN_ATTEMPTS - user.loginAttempts} attempts remaining.`);
            generateLoginCaptcha();
            trackEvent('login_failed', { attempts: user.loginAttempts });
        }

    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
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

// Make functions globally available
window.showQuiz = showQuiz;
window.showQuestion = showQuestion;
window.selectOption = selectOption;
window.navigateToQuestion = navigateToQuestion;
window.submitQuiz = submitQuiz;
window.showProfile = showProfile;
window.logout = logout;
window.showLoginScreen = showLoginScreen;
window.showRegisterScreen = showRegisterScreen;
window.login = login;
window.register = register;
window.showAlreadyAttemptedScreen = showAlreadyAttemptedScreen;
// ADD THESE NEW FUNCTIONS:
window.sendMobileOTP = sendMobileOTP;
window.generateCaptcha = generateCaptcha;
window.generateLoginCaptcha = generateLoginCaptcha;

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