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

// User Management Functions
function getUsers() {
    return JSON.parse(localStorage.getItem('quizUsers')) || [];
}

function saveUsers(users) {
    localStorage.setItem('quizUsers', JSON.stringify(users));
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
                    <input type="text" id="registerName" placeholder="Full Name" class="auth-input">
                    <input type="email" id="registerEmail" placeholder="Email Address" class="auth-input">
                    <input type="tel" id="registerMobile" placeholder="Mobile Number" class="auth-input">
                    <input type="password" id="registerPassword" placeholder="Create Password" class="auth-input">
                    <input type="password" id="registerConfirm" placeholder="Confirm Password" class="auth-input">
                    <button onclick="register()" class="auth-btn">Create Account</button>
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
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('Please enter both email and password');
        return;
    }
    
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        setCurrentUser(user);
        
        // Check if user has already attempted the quiz
        if (hasUserAttemptedQuiz()) {
            showAlreadyAttemptedScreen();
        } else {
            showQuiz();
        }
    } else {
        alert('Invalid email or password');
    }
}

function register() {
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const mobile = document.getElementById('registerMobile').value;
    const password = document.getElementById('registerPassword').value;
    const confirm = document.getElementById('registerConfirm').value;
    
    if (!name || !email || !mobile || !password || !confirm) {
        alert('Please fill all fields');
        return;
    }
    
    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
        alert('Please enter a valid 10-digit mobile number');
        return;
    }
    
    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters');
        return;
    }
    
    const users = getUsers();
    
    if (users.find(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    // Check if mobile number already exists
    if (users.find(u => u.mobile === mobile)) {
        alert('Mobile number already registered');
        return;
    }
    
    const newUser = {
        id: Date.now(),
        name: name,
        email: email,
        mobile: mobile,
        password: password,
        registeredAt: new Date().toLocaleDateString(),
        quizResults: []
    };
    
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);
    showQuiz();
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