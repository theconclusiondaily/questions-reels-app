// Enhanced Questions Reels App with User Registration
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
let userAnswers = [];
let score = 0;
let currentUser = null;
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
    localStorage.removeItem('currentUser');
    currentUser = null;
    showLoginScreen();
}

function saveUserResult(score, total) {
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
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString()
        });
        
        saveUsers(users);
    }
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
        showQuiz();
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

// Quiz Functions
function showQuiz() {
    // Reset quiz state
    currentQuestion = 0;
    userAnswers = [];
    score = 0;
    
    container.innerHTML = `
        <div class="quiz-header">
            <div class="header-left">
                <img src="images/company-logo.png" alt="The Conclusion Daily Logo" class="company-logo">
                <span class="company-name">The Conclusion Daily</span>
            </div>
            <div class="user-info">
                <span>Welcome, ${currentUser.name}!</span>
                <button onclick="showProfile()" class="profile-btn">Profile</button>
                <button onclick="logout()" class="logout-btn">Logout</button>
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress"></div>
        </div>
        <div class="reels-container">
            ${questions.map((q, index) => `
                <div class="question-slide" id="slide-${index}" style="display: ${index === 0 ? 'flex' : 'none'}">
                    <div class="question-wrapper">
                        ${q.image ? `<img src="${q.image}" alt="Question image" class="question-image" onerror="this.style.display='none'">` : ''}
                        <div class="question-content">
                            <h2 class="question-text">${q.question}</h2>
                            <div class="options-grid">
                                ${q.options.map((option, optIndex) => `
                                    <button class="option-btn" onclick="selectOption(${index}, ${optIndex})">
                                        ${option}
                                    </button>
                                `).join('')}
                            </div>
                        </div>
                        <div class="counter">${index + 1} / ${questions.length}</div>
                    </div>
                </div>
            `).join('')}
        </div>
        <div class="swipe-hint">⬆️ Swipe up/down to navigate ⬇️</div>
    `;
    
    updateProgressBar();
    setupSwipeGestures();
}

function showProfile() {
    const user = currentUser;
    const results = user.quizResults || [];
    const bestScore = results.length > 0 ? Math.max(...results.map(r => r.percentage)) : 0;
    const totalAttempts = results.length;
    
    container.innerHTML = `
        <div class="profile-container">
            <div class="profile-header">
                <h1>Your Profile 👤</h1>
                <button onclick="showQuiz()" class="back-btn">Back to Quiz</button>
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
            </div>
            
            <div class="stats-container">
                <h2>Quiz Statistics 📊</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-value">${totalAttempts}</div>
                        <div class="stat-label">Total Attempts</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${bestScore}%</div>
                        <div class="stat-label">Best Score</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-value">${questions.length}</div>
                        <div class="stat-label">Questions</div>
                    </div>
                </div>
            </div>
            
            ${results.length > 0 ? `
                <div class="attempts-history">
                    <h3>Recent Attempts</h3>
                    ${results.slice(-5).reverse().map(result => `
                        <div class="attempt-item">
                            <div class="attempt-score">${result.score}/${result.total} (${result.percentage}%)</div>
                            <div class="attempt-date">${result.date} ${result.time}</div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p class="no-attempts">No quiz attempts yet. Start your first quiz!</p>'}
        </div>
    `;
}

function showQuestion(index) {
    console.log('🔄 showQuestion called with index:', index);
    
    if (index < 0 || index >= questions.length) {
        console.log('❌ Invalid index');
        return;
    }
    
    // Hide all slides
    const slides = document.querySelectorAll('.question-slide');
    console.log('📊 Total slides found:', slides.length);
    
    slides.forEach((slide, i) => {
        slide.style.display = 'none';
    });
    
    // Show current slide
    const currentSlide = document.getElementById(`slide-${index}`);
    if (currentSlide) {
        currentSlide.style.display = 'flex';
        console.log('🎯 Now showing slide', index);
    } else {
        console.error('❌ Slide not found: slide-' + index);
    }
    
    currentQuestion = index;
    updateProgressBar();
}

function selectOption(questionIndex, optionIndex) {
    console.log('🎯 selectOption called:', questionIndex, optionIndex);
    
    const question = questions[questionIndex];
    const buttons = document.querySelectorAll(`#slide-${questionIndex} .option-btn`);
    console.log('🔘 Buttons found:', buttons.length);
    
    // Remove all selections
    buttons.forEach(btn => {
        btn.classList.remove('selected', 'correct', 'wrong');
    });
    
    // Add selected class
    if (buttons[optionIndex]) {
        buttons[optionIndex].classList.add('selected');
        console.log('✅ Added selected class to button', optionIndex);
    }
    
    // Store user answer
    userAnswers[questionIndex] = optionIndex;
    console.log('📝 User answers:', userAnswers);
    
    // Show correct/wrong with colors
    setTimeout(() => {
        if (buttons[question.correctAnswer]) {
            buttons[question.correctAnswer].classList.add('correct');
        }
        if (optionIndex !== question.correctAnswer && buttons[optionIndex]) {
            buttons[optionIndex].classList.add('wrong');
        }
        
        // Calculate score
        if (optionIndex === question.correctAnswer) {
            score++;
        }
    }, 500);
    
    // Auto move to next question after 2 seconds
    setTimeout(() => {
        if (questionIndex < questions.length - 1) {
            console.log('➡️ Moving to next question:', questionIndex + 1);
            showQuestion(questionIndex + 1);
        } else {
            console.log('🏁 Quiz completed!');
            showResults();
        }
    }, 2000);
}

function updateProgressBar() {
    const progress = (currentQuestion / (questions.length - 1)) * 100;
    const progressElement = document.querySelector('.progress');
    if (progressElement) {
        progressElement.style.width = progress + '%';
    }
}

function setupSwipeGestures() {
    let startY = 0;
    let endY = 0;
    
    container.addEventListener('touchstart', (e) => {
        startY = e.touches[0].clientY;
    });
    
    container.addEventListener('touchend', (e) => {
        endY = e.changedTouches[0].clientY;
        handleSwipe();
    });
    
    function handleSwipe() {
        const diff = startY - endY;
        
        if (diff > 50 && currentQuestion < questions.length - 1) {
            // Swipe up - next question
            showQuestion(currentQuestion + 1);
        } else if (diff < -50 && currentQuestion > 0) {
            // Swipe down - previous question
            showQuestion(currentQuestion - 1);
        }
    }
    
    // Mouse wheel for desktop
    document.addEventListener('wheel', (e) => {
        e.preventDefault();
        if (e.deltaY > 50 && currentQuestion < questions.length - 1) {
            showQuestion(currentQuestion + 1);
        } else if (e.deltaY < -50 && currentQuestion > 0) {
            showQuestion(currentQuestion - 1);
        }
    }, { passive: false });
}

function showResults() {
    // Calculate score
    score = 0;
    for (let i = 0; i < questions.length; i++) {
        if (userAnswers[i] === questions[i].correctAnswer) {
            score++;
        }
    }
    
    const percentage = Math.round((score / questions.length) * 100);
    
    // Save result for registered users
    saveUserResult(score, questions.length);
    
    // Build results HTML first
    let resultsHTML = `
        <div class="results-container">
            <div class="results-content">
                <div class="results-header">
                    <img src="images/company-logo.png" alt="Company Logo" class="results-logo">
                    <div class="user-results-header">
                        <div class="user-greeting">Well done, ${currentUser.name}! 🎉</div>
                    </div>
                </div>
                <div class="results-title">Quiz Completed!</div>
                <div class="results-score">${score}/${questions.length}</div>
                <div class="results-percentage">${percentage}% Correct</div>
                
                <div class="detailed-results">
                    <h3>Detailed Results:</h3>
    `;
    
    // Add each question with correct answer
    questions.forEach((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer === question.correctAnswer;
        
        resultsHTML += `
            <div class="result-item ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="result-question">Q${index + 1}: ${question.question || 'Question ' + (index + 1)}</div>
                <div class="result-answer">
                    <span class="user-answer">Your answer: ${question.options[userAnswer] || 'Not answered'}</span>
                    <span class="correct-answer">Correct answer: ${question.options[question.correctAnswer]}</span>
                </div>
                <div class="result-status">${isCorrect ? '✅ Correct' : '❌ Incorrect'}</div>
            </div>
        `;
    });
    
    resultsHTML += `
                </div>
                <div class="results-actions">
                    <button class="restart-btn" onclick="restartQuiz()">Take Quiz Again</button>
                    <button class="profile-btn" onclick="showProfile()">View Profile</button>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = resultsHTML;
}

function restartQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    score = 0;
    showQuiz();
}

// Make functions globally available
window.showQuiz = showQuiz;
window.showQuestion = showQuestion;
window.selectOption = selectOption;
window.showProfile = showProfile;
window.logout = logout;
window.showLoginScreen = showLoginScreen;
window.showRegisterScreen = showRegisterScreen;
window.login = login;
window.register = register;
window.restartQuiz = restartQuiz;

// Initialize app
function initApp() {
    console.log('🚀 App starting...');
    const user = getCurrentUser();
    if (user) {
        currentUser = user;
        showQuiz();
    } else {
        showLoginScreen();
    }
}

window.onload = initApp;