# Information Security Quiz Application

An educational web application for demonstrating password security vulnerabilities to students in Information Security courses.

## Purpose

This application is designed for **AXBOROT XAVFSIZLIGI XAVFLARINI BOSHQARISHGA KIRISH** (Introduction to Information Security Risk Management) course to:

1. Allow students to create accounts and take security quizzes
2. Demonstrate the importance of strong passwords by showing how easily weak passwords can be captured
3. Provide a leaderboard to encourage participation
4. Give instructors visibility into common password weaknesses

## Features

- **Student Registration & Login**: Students create accounts with email and password
- **Interactive Quiz**: 20 questions about information security concepts
- **Leaderboard**: Real-time rankings based on quiz scores
- **Admin Dashboard**: 
  - View all student credentials (for educational demonstration)
  - Start/stop quiz sessions
  - Analyze password strength
  - Export credentials to CSV
  - View password security statistics

## Installation

1. Install Node.js (if not already installed)

2. Navigate to the project directory:
```bash
cd security-quiz-app
```

3. Install dependencies:
```bash
npm install
```

4. Start the server:
```bash
npm start
```

5. Open your browser and go to:
   - Students: `http://localhost:3000/index.html`
   - Admin: `http://localhost:3000/admin.html`

## Usage

### For Students:
1. Register with your name, email, and password
2. Login with your credentials
3. Wait for the instructor to start the quiz
4. Answer 20 questions about information security
5. View your score and ranking on the leaderboard

### For Instructors (Admin):
1. Go to admin.html
2. Login with password: `admin123` (change this in admin.js)
3. View all registered students and their passwords
4. Click "Start Quiz" to allow students to begin
5. Monitor real-time leaderboard
6. View password security analysis
7. Export credentials to demonstrate password weaknesses

## Educational Value

This application demonstrates:
- **Why strong passwords matter**: Students see their actual passwords exposed
- **Common password mistakes**: Analysis shows weak password patterns
- **Real-world security risks**: Simulates how attackers can capture credentials
- **Best practices**: Teaches importance of unique, complex passwords

## Security Notice

⚠️ **This is an educational tool**. In production environments:
- Never store passwords in plain text
- Always use proper password hashing (bcrypt, argon2)
- Implement HTTPS
- Use secure session management
- Follow OWASP security guidelines

## Admin Password

Default admin password: `admin123`

To change it, edit the `ADMIN_PASSWORD` variable in `admin.js`.

## Data Storage

All data is stored in `data.json` file. To reset all data, use the "Reset All Data" button in the admin panel.

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Storage: JSON file-based database

## License

This project is for educational purposes only.
