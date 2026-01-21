const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files

// In-memory data storage (works on Render's ephemeral storage)
let appData = {
    users: [],
    quizActive: false,
    leaderboard: []
};

// Read data
function readData() {
    return appData;
}

// Write data
function writeData(data) {
    appData = data;
}

// Security Questions for Information Security Course
const questions = [
    {
        question: "What is the primary purpose of a firewall?",
        answers: [
            "To increase internet speed",
            "To filter and control network traffic",
            "To store passwords",
            "To encrypt files"
        ],
        correctAnswer: 1
    },
    {
        question: "What does 'phishing' refer to in cybersecurity?",
        answers: [
            "Fishing for data in databases",
            "A technique to trick users into revealing sensitive information",
            "A type of encryption",
            "A network protocol"
        ],
        correctAnswer: 1
    },
    {
        question: "What is two-factor authentication (2FA)?",
        answers: [
            "Using two passwords",
            "Authentication requiring two different types of credentials",
            "Logging in twice",
            "Two people sharing one account"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the most secure type of password?",
        answers: [
            "Your birth date",
            "Password123",
            "A combination of uppercase, lowercase, numbers, and special characters",
            "Your name"
        ],
        correctAnswer: 2
    },
    {
        question: "What is malware?",
        answers: [
            "A type of hardware",
            "Malicious software designed to harm systems",
            "A programming language",
            "An operating system"
        ],
        correctAnswer: 1
    },
    {
        question: "What does VPN stand for?",
        answers: [
            "Virtual Private Network",
            "Very Personal Network",
            "Verified Public Network",
            "Virtual Public Node"
        ],
        correctAnswer: 0
    },
    {
        question: "What is ransomware?",
        answers: [
            "Free software",
            "Software that helps you find files",
            "Malware that encrypts files and demands payment",
            "A type of antivirus"
        ],
        correctAnswer: 2
    },
    {
        question: "What is the purpose of encryption?",
        answers: [
            "To make files smaller",
            "To protect data by converting it into a coded format",
            "To speed up computers",
            "To delete unwanted files"
        ],
        correctAnswer: 1
    },
    {
        question: "What is a DDoS attack?",
        answers: [
            "A virus that deletes files",
            "Overwhelming a system with traffic to make it unavailable",
            "A type of encryption",
            "A password cracking technique"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the best practice for password management?",
        answers: [
            "Use the same password for all accounts",
            "Write passwords on sticky notes",
            "Use a password manager and unique passwords for each account",
            "Share passwords with friends"
        ],
        correctAnswer: 2
    },
    {
        question: "What is social engineering in cybersecurity?",
        answers: [
            "Building social media networks",
            "Manipulating people to reveal confidential information",
            "Engineering social software",
            "A programming technique"
        ],
        correctAnswer: 1
    },
    {
        question: "What does HTTPS ensure?",
        answers: [
            "Faster website loading",
            "Encrypted communication between browser and server",
            "Better search engine rankings only",
            "More website visitors"
        ],
        correctAnswer: 1
    },
    {
        question: "What is a zero-day vulnerability?",
        answers: [
            "A vulnerability that takes zero days to fix",
            "A security flaw unknown to the software vendor",
            "A vulnerability that doesn't exist",
            "A vulnerability found on day zero"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the purpose of antivirus software?",
        answers: [
            "To speed up the computer",
            "To detect and remove malicious software",
            "To create viruses",
            "To manage passwords"
        ],
        correctAnswer: 1
    },
    {
        question: "What is SQL injection?",
        answers: [
            "A medical procedure",
            "A technique to inject malicious SQL code into databases",
            "A type of encryption",
            "A programming language"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the principle of 'least privilege'?",
        answers: [
            "Giving everyone full access",
            "Giving users only the access they need to perform their job",
            "Removing all privileges",
            "Giving privileges based on seniority"
        ],
        correctAnswer: 1
    },
    {
        question: "What is a brute force attack?",
        answers: [
            "Physical damage to hardware",
            "Trying all possible password combinations until finding the correct one",
            "A type of virus",
            "A network protocol"
        ],
        correctAnswer: 1
    },
    {
        question: "What is the CIA triad in information security?",
        answers: [
            "Central Intelligence Agency protocols",
            "Confidentiality, Integrity, and Availability",
            "Computer Internet Access",
            "Cyber Investigation Authority"
        ],
        correctAnswer: 1
    },
    {
        question: "What is a security patch?",
        answers: [
            "A physical repair on hardware",
            "An update to fix security vulnerabilities in software",
            "A type of antivirus",
            "A network cable"
        ],
        correctAnswer: 1
    },
    {
        question: "Why should you regularly backup your data?",
        answers: [
            "To use more storage space",
            "To protect against data loss from attacks, failures, or accidents",
            "To slow down the computer",
            "It's not necessary"
        ],
        correctAnswer: 1
    }
];

// Initialize
// initDataFile();

// API Routes

// Register user
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }
    
    const data = readData();
    
    // Check if user already exists
    if (data.users.find(u => u.email === email)) {
        return res.status(400).json({ error: 'User already exists' });
    }
    
    // Add new user
    data.users.push({
        name,
        email,
        password, // In production, this should be hashed!
        registeredAt: new Date().toISOString(),
        score: null
    });
    
    writeData(data);
    res.json({ message: 'Registration successful' });
});

// Login user
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    const data = readData();
    const user = data.users.find(u => u.email === email && u.password === password);
    
    if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({
        message: 'Login successful',
        user: { name: user.name, email: user.email },
        token: 'dummy-token-' + Date.now()
    });
});

// Get quiz status
app.get('/api/quiz/status', (req, res) => {
    const data = readData();
    res.json({ isActive: data.quizActive });
});

// Get quiz questions
app.get('/api/quiz/questions', (req, res) => {
    const data = readData();
    
    if (!data.quizActive) {
        return res.status(403).json({ error: 'Quiz is not active' });
    }
    
    res.json(questions);
});

// Submit quiz
app.post('/api/quiz/submit', (req, res) => {
    const { email, score, totalQuestions } = req.body;
    
    const data = readData();
    const user = data.users.find(u => u.email === email);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user score
    user.score = score;
    user.totalQuestions = totalQuestions;
    user.completedAt = new Date().toISOString();
    
    // Update leaderboard
    data.leaderboard = data.users
        .filter(u => u.score !== null)
        .sort((a, b) => b.score - a.score)
        .map(u => ({
            name: u.name,
            email: u.email,
            score: u.score,
            completedAt: u.completedAt
        }));
    
    writeData(data);
    res.json({ message: 'Quiz submitted successfully' });
});

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
    const data = readData();
    res.json(data.leaderboard);
});

// Admin: Get all students
app.get('/api/admin/students', (req, res) => {
    const data = readData();
    res.json(data.users);
});

// Admin: Start quiz
app.post('/api/admin/start-quiz', (req, res) => {
    const data = readData();
    data.quizActive = true;
    writeData(data);
    res.json({ message: 'Quiz started' });
});

// Admin: Stop quiz
app.post('/api/admin/stop-quiz', (req, res) => {
    const data = readData();
    data.quizActive = false;
    writeData(data);
    res.json({ message: 'Quiz stopped' });
});

// Admin: Reset all data
app.post('/api/admin/reset', (req, res) => {
    const initialData = {
        users: [],
        quizActive: false,
        leaderboard: []
    };
    writeData(initialData);
    res.json({ message: 'All data reset' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Admin password: admin123`);
    console.log(`\n👨‍🎓 Student Login: http://localhost:${PORT}/index.html`);
    console.log(`🔑 Admin Panel: http://localhost:${PORT}/admin.html`);
});
