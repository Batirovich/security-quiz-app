// Quiz Logic
const API_URL = 'http://localhost:3000';

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let userAnswers = [];

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    displayUserName();
    checkQuizStatus();
    setInterval(checkQuizStatus, 5000); // Check every 5 seconds
});

function checkAuth() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
        window.location.href = 'index.html';
    }
}

function displayUserName() {
    const user = JSON.parse(localStorage.getItem('user'));
    document.getElementById('userName').textContent = `Welcome, ${user.name}!`;
}

function logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

async function checkQuizStatus() {
    try {
        const response = await fetch(`${API_URL}/api/quiz/status`);
        const data = await response.json();
        
        if (data.isActive && !data.userCompleted) {
            document.getElementById('waitingSection').style.display = 'none';
            document.getElementById('quizSection').style.display = 'block';
            if (questions.length === 0) {
                loadQuiz();
            }
        } else {
            loadLeaderboard();
        }
    } catch (error) {
        console.error('Error checking quiz status:', error);
    }
}

async function loadQuiz() {
    try {
        const response = await fetch(`${API_URL}/api/quiz/questions`);
        questions = await response.json();
        document.getElementById('totalQuestions').textContent = questions.length;
        displayQuestion();
    } catch (error) {
        console.error('Error loading quiz:', error);
    }
}

function displayQuestion() {
    if (currentQuestionIndex >= questions.length) {
        submitQuiz();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
    document.getElementById('questionText').textContent = question.question;
    document.getElementById('currentScore').textContent = score;

    const answersContainer = document.getElementById('answersContainer');
    answersContainer.innerHTML = '';

    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer;
        button.onclick = () => selectAnswer(index);
        answersContainer.appendChild(button);
    });
}

function selectAnswer(selectedIndex) {
    const question = questions[currentQuestionIndex];
    const buttons = document.querySelectorAll('.answer-btn');
    
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (index === question.correctAnswer) {
            btn.classList.add('correct');
        }
        if (index === selectedIndex && index !== question.correctAnswer) {
            btn.classList.add('incorrect');
        }
    });

    const isCorrect = selectedIndex === question.correctAnswer;
    if (isCorrect) {
        score++;
        document.getElementById('currentScore').textContent = score;
    }

    userAnswers.push({
        question: currentQuestionIndex,
        selected: selectedIndex,
        correct: isCorrect
    });

    setTimeout(() => {
        currentQuestionIndex++;
        displayQuestion();
    }, 1500);
}

async function submitQuiz() {
    const user = JSON.parse(localStorage.getItem('user'));
    
    try {
        const response = await fetch(`${API_URL}/api/quiz/submit`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                score: score,
                totalQuestions: questions.length,
                answers: userAnswers
            })
        });

        if (response.ok) {
            showResults();
        }
    } catch (error) {
        console.error('Error submitting quiz:', error);
    }
}

function showResults() {
    document.getElementById('quizSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    
    const percentage = (score / questions.length) * 100;
    document.getElementById('finalScore').textContent = `${score}/${questions.length} (${percentage.toFixed(1)}%)`;
    
    let message = '';
    if (percentage >= 90) {
        message = '🌟 Excellent! You have a great understanding of information security!';
    } else if (percentage >= 70) {
        message = '👍 Good job! Keep learning more about cybersecurity.';
    } else if (percentage >= 50) {
        message = '📚 Not bad, but there\'s room for improvement.';
    } else {
        message = '⚠️ You need to study more about information security.';
    }
    
    document.getElementById('scoreMessage').textContent = message;
    loadFinalLeaderboard();
}

async function loadLeaderboard() {
    try {
        const response = await fetch(`${API_URL}/api/leaderboard`);
        const leaderboard = await response.json();
        displayLeaderboard(leaderboard, 'leaderboardList');
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

async function loadFinalLeaderboard() {
    try {
        const response = await fetch(`${API_URL}/api/leaderboard`);
        const leaderboard = await response.json();
        displayLeaderboard(leaderboard, 'finalLeaderboard');
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

function displayLeaderboard(leaderboard, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (leaderboard.length === 0) {
        container.innerHTML = '<p>No scores yet. Be the first to complete the quiz!</p>';
        return;
    }

    leaderboard.forEach((entry, index) => {
        const item = document.createElement('div');
        item.className = `leaderboard-item ${index < 3 ? 'top' : ''}`;
        
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        
        item.innerHTML = `
            <span>${medal} ${entry.name}</span>
            <span><strong>${entry.score}</strong> points</span>
        `;
        container.appendChild(item);
    });
}
