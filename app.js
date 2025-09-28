// Enhanced Questions Reels App with All Features
const questions = [
    {
        id: 1,
        question: "What's your favorite programming language?",
        options: ['JavaScript', 'Python', 'Java', 'C++'],
        image: 'images/code.jpg',
        correctAnswer: 0 // JavaScript
    },
    {
        id: 2,
        question: "Which mobile OS do you prefer?",
        options: ['iOS', 'Android', 'Both', "Don't care"],
        image: 'images/mobile.jpg',
        correctAnswer: 1 // Android
    },
    {
        id: 3,
        question: "What's your favorite social media platform?",
        options: ['Instagram', 'TikTok', 'YouTube', 'Twitter'],
        image: 'images/social.jpg',
        correctAnswer: 2 // YouTube
    },
    {
        id: 4,
        question: "Do you prefer coffee or tea?",
        options: ['Coffee', 'Tea', 'Both', 'Neither'],
        image: 'images/coffee-tea.jpg',
        correctAnswer: 0 // Coffee
    },
    {
        id: 5,
        question: "What's your ideal vacation?",
        options: ['Beach', 'Mountains', 'City', 'Staycation'],
        image: 'images/vacation.jpg',
        correctAnswer: 1 // Mountains
    }
];

let currentQuestion = 0;
let userAnswers = [];
let score = 0;
const container = document.getElementById('root');

// Sound functions
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(e => console.log('Sound play failed:', e));
    }
}

function createApp() {
    container.innerHTML = `
        <div class="progress-bar">
            <div class="progress"></div>
        </div>
        <div class="reels-container">
            ${questions.map((q, index) => `
                <div class="question-slide" id="slide-${index}" style="display: ${index === 0 ? 'flex' : 'none'}">
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

function showQuestion(index) {
    if (index < 0 || index >= questions.length) return;
    
    // Hide all slides
    document.querySelectorAll('.question-slide').forEach(slide => {
        slide.style.display = 'none';
    });
    
    // Show current slide
    const currentSlide = document.getElementById(`slide-${index}`);
    if (currentSlide) {
        currentSlide.style.display = 'flex';
    }
    
    currentQuestion = index;
    updateProgressBar();
    playSound('swipeSound');
}

function selectOption(questionIndex, optionIndex) {
    const question = questions[questionIndex];
    const buttons = document.querySelectorAll(`#slide-${questionIndex} .option-btn`);
    
    // Remove all selections
    buttons.forEach(btn => {
        btn.classList.remove('selected', 'correct', 'wrong');
    });
    
    // Add selected class
    buttons[optionIndex].classList.add('selected');
    playSound('clickSound');
    
    // Store user answer
    userAnswers[questionIndex] = optionIndex;
    
    // Show correct/wrong with colors
    setTimeout(() => {
        buttons[question.correctAnswer].classList.add('correct');
        if (optionIndex !== question.correctAnswer) {
            buttons[optionIndex].classList.add('wrong');
        }
        
        // Calculate score
        if (optionIndex === question.correctAnswer) {
            score++;
            playSound('correctSound');
        }
    }, 500);
    
    // Auto move to next question after 2 seconds
    setTimeout(() => {
        if (questionIndex < questions.length - 1) {
            showQuestion(questionIndex + 1);
        } else {
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
    const percentage = Math.round((score / questions.length) * 100);
    let message = '';
    
    if (percentage >= 80) message = 'Excellent! 🎉';
    else if (percentage >= 60) message = 'Great job! 👍';
    else if (percentage >= 40) message = 'Good effort! 😊';
    else message = 'Keep practicing! 💪';
    
    container.innerHTML = `
        <div class="results-container">
            <div class="results-content">
                <div class="results-title">Quiz Completed!</div>
                <div class="results-score">${score}/${questions.length}</div>
                <div class="results-message">${message} (${percentage}%)</div>
                <button class="restart-btn" onclick="restartQuiz()">Play Again</button>
            </div>
        </div>
    `;
}

function restartQuiz() {
    currentQuestion = 0;
    userAnswers = [];
    score = 0;
    createApp();
}

// Initialize app when page loads
window.onload = createApp;