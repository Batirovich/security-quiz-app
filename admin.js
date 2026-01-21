// Admin Panel Logic
const API_URL = '';
const ADMIN_PASSWORD = 'admin123'; // Change this for security

document.addEventListener('DOMContentLoaded', function() {
    const adminLoginSection = document.getElementById('adminLoginSection');
    const adminDashboard = document.getElementById('adminDashboard');
    const adminLoginForm = document.getElementById('adminLoginForm');

    // Check if admin is already logged in
    if (localStorage.getItem('adminLoggedIn') === 'true') {
        showDashboard();
    }

    adminLoginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPassword').value;
        
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('adminLoggedIn', 'true');
            showDashboard();
        } else {
            alert('Invalid admin password!');
        }
    });

    function showDashboard() {
        adminLoginSection.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadDashboardData();
        updateQuizStatus();
        setInterval(loadDashboardData, 3000); // Refresh every 3 seconds
    }
});

function adminLogout() {
    localStorage.removeItem('adminLoggedIn');
    location.reload();
}

async function loadDashboardData() {
    await loadStudents();
    await loadLeaderboard();
    await analyzePasswords();
}

async function updateQuizStatus() {
    try {
        const response = await fetch(`${API_URL}/api/quiz/status`);
        const data = await response.json();
        
        const statusText = document.getElementById('quizStatus');
        const startBtn = document.getElementById('startQuizBtn');
        const stopBtn = document.getElementById('stopQuizBtn');
        
        if (data.isActive) {
            statusText.textContent = 'Active ✅';
            statusText.style.color = '#28a745';
            startBtn.style.display = 'none';
            stopBtn.style.display = 'inline-block';
        } else {
            statusText.textContent = 'Not Started ⏸️';
            statusText.style.color = '#dc3545';
            startBtn.style.display = 'inline-block';
            stopBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error updating quiz status:', error);
    }
}

async function startQuiz() {
    try {
        const response = await fetch(`${API_URL}/api/admin/start-quiz`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('Quiz started! Students can now begin.');
            updateQuizStatus();
        }
    } catch (error) {
        console.error('Error starting quiz:', error);
    }
}

async function stopQuiz() {
    try {
        const response = await fetch(`${API_URL}/api/admin/stop-quiz`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('Quiz stopped!');
            updateQuizStatus();
        }
    } catch (error) {
        console.error('Error stopping quiz:', error);
    }
}

async function resetQuiz() {
    if (!confirm('Are you sure you want to reset all data? This will delete all students and scores!')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/admin/reset`, {
            method: 'POST'
        });
        
        if (response.ok) {
            alert('All data has been reset!');
            loadDashboardData();
        }
    } catch (error) {
        console.error('Error resetting data:', error);
    }
}

async function loadStudents() {
    try {
        const response = await fetch(`${API_URL}/api/admin/students`);
        const students = await response.json();
        
        const tbody = document.getElementById('studentsTableBody');
        tbody.innerHTML = '';
        
        students.forEach((student, index) => {
            const strength = analyzePasswordStrength(student.password);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${student.name}</td>
                <td>${student.email}</td>
                <td><code>${student.password}</code></td>
                <td class="password-${strength.level}">${strength.text}</td>
                <td>${student.score || 0}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading students:', error);
    }
}

async function loadLeaderboard() {
    try {
        const response = await fetch(`${API_URL}/api/leaderboard`);
        const leaderboard = await response.json();
        
        const tbody = document.getElementById('leaderboardTableBody');
        tbody.innerHTML = '';
        
        leaderboard.forEach((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${medal} ${index + 1}</td>
                <td>${entry.name}</td>
                <td><strong>${entry.score}</strong></td>
                <td>${entry.completedAt ? new Date(entry.completedAt).toLocaleString() : 'N/A'}</td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading leaderboard:', error);
    }
}

function analyzePasswordStrength(password) {
    const length = password.length;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    let strength = 0;
    if (length >= 8) strength++;
    if (length >= 12) strength++;
    if (hasUpperCase) strength++;
    if (hasLowerCase) strength++;
    if (hasNumbers) strength++;
    if (hasSpecialChar) strength++;
    
    if (strength <= 2) {
        return { level: 'weak', text: '❌ Very Weak' };
    } else if (strength <= 4) {
        return { level: 'medium', text: '⚠️ Weak' };
    } else {
        return { level: 'strong', text: '✅ Strong' };
    }
}

async function analyzePasswords() {
    try {
        const response = await fetch(`${API_URL}/api/admin/students`);
        const students = await response.json();
        
        let weak = 0, medium = 0, strong = 0;
        const commonPasswords = [];
        const passwordPatterns = {};
        
        students.forEach(student => {
            const strength = analyzePasswordStrength(student.password);
            
            if (strength.level === 'weak') weak++;
            else if (strength.level === 'medium') medium++;
            else strong++;
            
            // Track common passwords
            if (!passwordPatterns[student.password]) {
                passwordPatterns[student.password] = 0;
            }
            passwordPatterns[student.password]++;
        });
        
        // Find duplicate passwords
        for (let [password, count] of Object.entries(passwordPatterns)) {
            if (count > 1) {
                commonPasswords.push(`"${password}" used by ${count} students`);
            }
        }
        
        const analysisDiv = document.getElementById('passwordAnalysis');
        analysisDiv.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number" style="color: #dc3545;">${weak}</div>
                    <div class="stat-label">Weak Passwords</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #ffc107;">${medium}</div>
                    <div class="stat-label">Medium Passwords</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number" style="color: #28a745;">${strong}</div>
                    <div class="stat-label">Strong Passwords</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${students.length}</div>
                    <div class="stat-label">Total Students</div>
                </div>
            </div>
            
            ${commonPasswords.length > 0 ? `
                <div class="alert alert-danger" style="margin-top: 20px;">
                    <strong>⚠️ Security Alert:</strong><br>
                    ${commonPasswords.join('<br>')}
                </div>
            ` : ''}
            
            <div class="alert alert-warning" style="margin-top: 20px;">
                <strong>📊 Analysis:</strong><br>
                ${((weak / students.length) * 100).toFixed(1)}% of students are using weak passwords that can be easily cracked.<br>
                This demonstrates why strong password policies are essential for information security.
            </div>
        `;
    } catch (error) {
        console.error('Error analyzing passwords:', error);
    }
}

function exportCredentials() {
    fetch(`${API_URL}/api/admin/students`)
        .then(response => response.json())
        .then(students => {
            let csv = 'Name,Email,Password,Password Strength,Score\n';
            
            students.forEach(student => {
                const strength = analyzePasswordStrength(student.password);
                csv += `"${student.name}","${student.email}","${student.password}","${strength.text}","${student.score || 0}"\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `student-credentials-${Date.now()}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error exporting credentials:', error);
        });
}
