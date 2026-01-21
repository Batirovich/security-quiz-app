// Login and Registration Logic
const API_URL = '';

document.addEventListener('DOMContentLoaded', function() {
    const loginSection = document.getElementById('loginSection');
    const registerSection = document.getElementById('registerSection');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Toggle between login and register
    showRegisterLink?.addEventListener('click', (e) => {
        e.preventDefault();
        loginSection.style.display = 'none';
        registerSection.style.display = 'block';
    });

    showLoginLink?.addEventListener('click', (e) => {
        e.preventDefault();
        registerSection.style.display = 'none';
        loginSection.style.display = 'block';
    });

    // Handle Registration
    registerForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;

        try {
            const response = await fetch(`${API_URL}/api/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Registration successful! Please login.');
                registerSection.style.display = 'none';
                loginSection.style.display = 'block';
                registerForm.reset();
            } else {
                alert(data.error || 'Registration failed');
            }
        } catch (error) {
            alert('Error connecting to server. Please try again.');
        }
    });

    // Handle Login
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        console.log('Attempting login with:', email);

        try {
            const response = await fetch(`${API_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            console.log('Login response:', response.status, data);
            
            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                localStorage.setItem('token', data.token);
                alert('Login successful! Redirecting to quiz...');
                window.location.href = 'quiz.html';
            } else {
                alert(data.error || 'Login failed. Please check your email and password.');
                console.error('Login error:', data);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Error connecting to server: ' + error.message);
        }
    });
});
