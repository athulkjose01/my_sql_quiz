# Quiz Application - Complete Documentation

A full-stack Quiz Application built with React, .NET 8 Web API, and MongoDB Atlas.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Configuration](#configuration)
6. [API Documentation](#api-documentation)
7. [Database Schema](#database-schema)
8. [Features](#features)
9. [User Guide](#user-guide)
10. [Admin Guide](#admin-guide)
11. [Migration to MySQL](#migration-to-mysql)
12. [Troubleshooting](#troubleshooting)

---

## Overview

This Quiz Application allows users to take assessments with predefined multiple-choice questions. It includes separate interfaces for regular users and administrators.

### Key Features
- User registration and authentication
- JWT-based secure authentication
- 20 predefined MCQ questions (seeded automatically)
- Timed quiz attempts with detailed results
- Quiz history tracking
- Admin dashboard with statistics
- Question management (CRUD operations)
- Clean black & white UI design

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Framework |
| Vite | 7.x | Build Tool |
| Tailwind CSS | 4.x | Styling |
| shadcn/ui | Latest | UI Components |
| React Router | 6.x | Navigation |
| Lucide React | Latest | Icons |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| .NET | 9.0 | Runtime |
| ASP.NET Core Web API | 9.0 | API Framework |
| MongoDB.Driver | 3.x | Database Driver |
| BCrypt.Net-Next | 4.x | Password Hashing |
| JWT Bearer | 9.0 | Authentication |
| DotNetEnv | 3.x | Environment Variables |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB Atlas | Cloud Database |

---

## Project Structure

```
Quiz/
├── Frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/              # shadcn/ui components
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── dialog.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── label.jsx
│   │   │   │   ├── progress.jsx
│   │   │   │   ├── radio-group.jsx
│   │   │   │   ├── table.jsx
│   │   │   │   └── textarea.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Authentication state
│   │   ├── lib/
│   │   │   └── utils.js         # Utility functions
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminQuestions.jsx
│   │   │   │   └── AdminReports.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Quiz.jsx
│   │   │   ├── QuizResult.jsx
│   │   │   └── Register.jsx
│   │   ├── services/
│   │   │   └── api.js           # API service layer
│   │   ├── App.jsx              # Main app with routes
│   │   ├── index.css            # Global styles
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── Backend/                     # .NET Web API
│   ├── Controllers/
│   │   ├── AdminController.cs   # Admin endpoints
│   │   ├── AuthController.cs    # Authentication
│   │   ├── QuestionsController.cs
│   │   └── QuizController.cs
│   ├── Models/
│   │   ├── DTOs.cs              # Data Transfer Objects
│   │   ├── Question.cs
│   │   ├── QuizAttempt.cs
│   │   └── User.cs
│   ├── Services/
│   │   ├── JwtService.cs        # JWT token generation
│   │   ├── MongoDBService.cs    # Database connection
│   │   └── SeedService.cs       # Initial data seeding
│   ├── Settings/
│   │   ├── JwtSettings.cs
│   │   └── MongoDBSettings.cs
│   ├── Properties/
│   │   └── launchSettings.json
│   ├── .env                     # Environment variables
│   ├── appsettings.json
│   ├── Backend.csproj
│   └── Program.cs               # Application entry
│
└── DOCUMENTATION.md             # This file
```

---

## Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **.NET SDK** (9.0 or higher)
- **MongoDB Atlas Account** (or local MongoDB)
- **Git** (optional)

### Step 1: Clone/Download the Project

```bash
cd D:\Training\Quiz
```

### Step 2: Backend Setup

1. **Navigate to Backend folder:**
   ```bash
   cd Backend
   ```

2. **Restore NuGet packages:**
   ```bash
   dotnet restore
   ```

3. **Configure environment variables:**

   Edit the `.env` file in the Backend folder:
   ```env
   MONGODB_CONNECTION_STRING=mongodb+srv://your_username:your_password@cluster.mongodb.net/?appName=Cluster0
   MONGODB_DATABASE_NAME=quizapp
   JWT_SECRET_KEY=YourSuperSecretKeyThatIsAtLeast32CharactersLong!
   JWT_ISSUER=QuizApp
   JWT_AUDIENCE=QuizAppUsers
   JWT_EXPIRY_HOURS=24
   ```

4. **Run the Backend:**
   ```bash
   dotnet run
   ```

   The API will start at `http://localhost:5000`

### Step 3: Frontend Setup

1. **Navigate to Frontend folder:**
   ```bash
   cd Frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the Frontend:**
   ```bash
   npm run dev
   ```

   The app will start at `http://localhost:5173`

### Step 4: Access the Application

- **User Interface:** http://localhost:5173
- **Admin Interface:** http://localhost:5173/admin/login
- **API Base URL:** http://localhost:5000/api

---

## Configuration

### Environment Variables (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_CONNECTION_STRING` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/` |
| `MONGODB_DATABASE_NAME` | Database name | `quizapp` |
| `JWT_SECRET_KEY` | Secret key for JWT (min 32 chars) | `YourSuperSecretKey...` |
| `JWT_ISSUER` | JWT token issuer | `QuizApp` |
| `JWT_AUDIENCE` | JWT token audience | `QuizAppUsers` |
| `JWT_EXPIRY_HOURS` | Token expiry in hours | `24` |

### Default Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@quiz.com | Admin@123 |

### Port Configuration

Edit `Backend/Properties/launchSettings.json` to change the API port:
```json
{
  "profiles": {
    "http": {
      "applicationUrl": "http://localhost:5000"
    }
  }
}
```

Edit `Frontend/src/services/api.js` to update the API URL:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

---

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "id": "6937bf08515e38220131cfb2",
  "email": "user@example.com",
  "name": "John Doe",
  "role": "user"
}
```

#### User Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123"
}
```

#### Admin Login
```http
POST /api/auth/admin/login
Content-Type: application/json

{
  "email": "admin@quiz.com",
  "password": "Admin@123"
}
```

### Quiz Endpoints

#### Get All Questions
```http
GET /api/questions
Authorization: Bearer {token}
```

**Response:**
```json
[
  {
    "id": "6937beed515e38220131cf9e",
    "questionText": "What does HTML stand for?",
    "options": [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Home Tool Markup Language"
    ],
    "correctAnswer": 0,
    "createdAt": "2025-12-09T06:17:17.166Z"
  }
]
```

#### Submit Quiz
```http
POST /api/quiz/submit
Authorization: Bearer {token}
Content-Type: application/json

{
  "answers": [
    { "questionId": "6937beed515e38220131cf9e", "selectedAnswer": 0 },
    { "questionId": "6937beed515e38220131cf9f", "selectedAnswer": 2 }
  ],
  "timeTaken": 120
}
```

**Response:**
```json
{
  "id": "6937bf79515e38220131cfb3",
  "score": 5,
  "totalQuestions": 20,
  "correctAnswers": 5,
  "wrongAnswers": 15,
  "percentage": 25,
  "timeTaken": 120,
  "completedAt": "2025-12-09T06:19:37.169Z",
  "answerResults": [...]
}
```

#### Get Quiz History
```http
GET /api/quiz/history
Authorization: Bearer {token}
```

#### Get Quiz Result
```http
GET /api/quiz/result/{id}
Authorization: Bearer {token}
```

### Admin Endpoints

#### Get Statistics
```http
GET /api/admin/stats
Authorization: Bearer {admin_token}
```

**Response:**
```json
{
  "totalUsers": 1,
  "totalQuestions": 20,
  "totalAttempts": 1,
  "averageScore": 25
}
```

#### Get All Reports
```http
GET /api/admin/reports
Authorization: Bearer {admin_token}
```

#### Get All Users
```http
GET /api/admin/users
Authorization: Bearer {admin_token}
```

#### Create Question (Admin)
```http
POST /api/questions
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "questionText": "What is 2 + 2?",
  "options": ["3", "4", "5", "6"],
  "correctAnswer": 1
}
```

#### Update Question (Admin)
```http
PUT /api/questions/{id}
Authorization: Bearer {admin_token}
Content-Type: application/json

{
  "questionText": "Updated question?",
  "options": ["A", "B", "C", "D"],
  "correctAnswer": 0
}
```

#### Delete Question (Admin)
```http
DELETE /api/questions/{id}
Authorization: Bearer {admin_token}
```

---

## Database Schema

### MongoDB Collections

#### users
```javascript
{
  "_id": ObjectId("..."),
  "email": "user@example.com",
  "password": "$2a$11$...", // BCrypt hashed
  "name": "John Doe",
  "role": "user", // or "admin"
  "createdAt": ISODate("2025-12-09T06:17:43.847Z")
}
```

#### questions
```javascript
{
  "_id": ObjectId("..."),
  "question": "What does HTML stand for?",
  "options": [
    "Hyper Text Markup Language",
    "High Tech Modern Language",
    "Hyper Transfer Markup Language",
    "Home Tool Markup Language"
  ],
  "correctAnswer": 0, // Index of correct option
  "createdAt": ISODate("2025-12-09T06:17:17.166Z")
}
```

#### quizAttempts
```javascript
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "userName": "John Doe",
  "userEmail": "user@example.com",
  "answers": [
    {
      "questionId": ObjectId("..."),
      "selectedAnswer": 0,
      "isCorrect": true
    }
  ],
  "score": 15,
  "totalQuestions": 20,
  "correctAnswers": 15,
  "wrongAnswers": 5,
  "percentage": 75,
  "timeTaken": 300, // seconds
  "completedAt": ISODate("2025-12-09T06:19:37.169Z")
}
```

---

## Features

### User Features
- Register with email, password, and name
- Login to access dashboard
- Attempt quiz with 20 MCQ questions
- Timer tracking during quiz
- Navigate between questions
- View detailed results after submission
- View quiz history with past attempts
- Logout functionality

### Admin Features
- Separate admin login
- View dashboard statistics
- Add new questions
- Edit existing questions
- Delete questions
- View all user reports
- View all registered users

---

## User Guide

### Registration
1. Navigate to http://localhost:5173
2. Click "Register" link
3. Fill in name, email, and password
4. Click "Register" button
5. You'll be redirected to the dashboard

### Taking a Quiz
1. Login to your account
2. Click "Attempt Assessment" button
3. Answer each question by selecting an option
4. Use "Previous" and "Next" buttons to navigate
5. Click question numbers for quick navigation
6. Click "Submit Quiz" when finished
7. View your detailed results

### Viewing Results
- After submission, see your score, percentage, and time taken
- Review each question with correct/wrong indicators
- Green highlight shows correct answers
- View your answer vs correct answer for wrong responses

---

## Admin Guide

### Accessing Admin Panel
1. Navigate to http://localhost:5173/admin/login
2. Login with admin credentials:
   - Email: `admin@quiz.com`
   - Password: `Admin@123`

### Managing Questions
1. Go to "Manage Questions" page
2. **Add Question:** Click "Add Question" button, fill form
3. **Edit Question:** Click "Edit" on any question row
4. **Delete Question:** Click "Delete" (with confirmation)

### Viewing Reports
1. Go to "View Reports" page
2. See statistics cards at top
3. View detailed table of all quiz attempts
4. See user name, email, score, percentage, time

---

## Migration to MySQL

If you want to migrate from MongoDB to MySQL, follow these steps:

### Step 1: Install MySQL Packages

```bash
cd Backend
dotnet remove package MongoDB.Driver
dotnet add package Pomelo.EntityFrameworkCore.MySql
dotnet add package Microsoft.EntityFrameworkCore.Design
```

### Step 2: Create Entity Models

Create new models in `Backend/Models/` folder:

**User.cs (MySQL Version)**
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("users")]
public class User
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(255)]
    public string Email { get; set; } = null!;

    [Required]
    [MaxLength(255)]
    public string Password { get; set; } = null!;

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = null!;

    [MaxLength(20)]
    public string Role { get; set; } = "user";

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ICollection<QuizAttempt> QuizAttempts { get; set; } = new List<QuizAttempt>();
}
```

**Question.cs (MySQL Version)**
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("questions")]
public class Question
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    [MaxLength(1000)]
    public string QuestionText { get; set; } = null!;

    [Required]
    [MaxLength(500)]
    public string Option1 { get; set; } = null!;

    [Required]
    [MaxLength(500)]
    public string Option2 { get; set; } = null!;

    [Required]
    [MaxLength(500)]
    public string Option3 { get; set; } = null!;

    [Required]
    [MaxLength(500)]
    public string Option4 { get; set; } = null!;

    [Required]
    public int CorrectAnswer { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Helper property (not mapped)
    [NotMapped]
    public List<string> Options => new() { Option1, Option2, Option3, Option4 };
}
```

**QuizAttempt.cs (MySQL Version)**
```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

[Table("quiz_attempts")]
public class QuizAttempt
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int UserId { get; set; }

    [ForeignKey("UserId")]
    public User User { get; set; } = null!;

    public int Score { get; set; }

    public int TotalQuestions { get; set; }

    public int CorrectAnswers { get; set; }

    public int WrongAnswers { get; set; }

    public double Percentage { get; set; }

    public int TimeTaken { get; set; }

    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ICollection<UserAnswer> Answers { get; set; } = new List<UserAnswer>();
}

[Table("user_answers")]
public class UserAnswer
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }

    [Required]
    public int QuizAttemptId { get; set; }

    [ForeignKey("QuizAttemptId")]
    public QuizAttempt QuizAttempt { get; set; } = null!;

    [Required]
    public int QuestionId { get; set; }

    [ForeignKey("QuestionId")]
    public Question Question { get; set; } = null!;

    public int SelectedAnswer { get; set; }

    public bool IsCorrect { get; set; }
}
```

### Step 3: Create DbContext

Create `Backend/Data/ApplicationDbContext.cs`:

```csharp
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<QuizAttempt> QuizAttempts { get; set; }
    public DbSet<UserAnswer> UserAnswers { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Unique constraint on email
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        // Seed admin user
        modelBuilder.Entity<User>().HasData(new User
        {
            Id = 1,
            Email = "admin@quiz.com",
            Password = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Name = "Admin",
            Role = "admin",
            CreatedAt = DateTime.UtcNow
        });

        // Seed questions
        modelBuilder.Entity<Question>().HasData(
            new Question
            {
                Id = 1,
                QuestionText = "What does HTML stand for?",
                Option1 = "Hyper Text Markup Language",
                Option2 = "High Tech Modern Language",
                Option3 = "Hyper Transfer Markup Language",
                Option4 = "Home Tool Markup Language",
                CorrectAnswer = 0,
                CreatedAt = DateTime.UtcNow
            },
            new Question
            {
                Id = 2,
                QuestionText = "Which programming language is known as the 'language of the web'?",
                Option1 = "Python",
                Option2 = "Java",
                Option3 = "JavaScript",
                Option4 = "C++",
                CorrectAnswer = 2,
                CreatedAt = DateTime.UtcNow
            }
            // Add more questions...
        );
    }
}
```

### Step 4: Update Program.cs

Replace MongoDB configuration with MySQL:

```csharp
using System.Text;
using Backend.Data;
using Backend.Services;
using Backend.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using DotNetEnv;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Configure MySQL
var connectionString = Environment.GetEnvironmentVariable("MYSQL_CONNECTION_STRING")
    ?? builder.Configuration.GetConnectionString("DefaultConnection")!;

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Configure JWT settings
builder.Services.Configure<JwtSettings>(options =>
{
    options.SecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
        ?? builder.Configuration["Jwt:SecretKey"]!;
    options.Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
        ?? builder.Configuration["Jwt:Issuer"]!;
    options.Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
        ?? builder.Configuration["Jwt:Audience"]!;
    options.ExpiryInHours = int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRY_HOURS")
        ?? builder.Configuration["Jwt:ExpiryInHours"] ?? "24");
});

builder.Services.AddSingleton<JwtService>();

// JWT Authentication
var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
    ?? builder.Configuration["Jwt:SecretKey"]!;
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
    ?? builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
    ?? builder.Configuration["Jwt:Audience"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtSecretKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Apply migrations and seed data
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### Step 5: Update .env File

```env
MYSQL_CONNECTION_STRING=Server=localhost;Database=quizapp;User=root;Password=your_password;
JWT_SECRET_KEY=YourSuperSecretKeyThatIsAtLeast32CharactersLong!
JWT_ISSUER=QuizApp
JWT_AUDIENCE=QuizAppUsers
JWT_EXPIRY_HOURS=24
```

### Step 6: Update Controllers

**AuthController.cs (MySQL Version)**
```csharp
using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(ApplicationDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (existingUser != null)
        {
            return BadRequest(new { message = "Email already exists" });
        }

        var user = new User
        {
            Email = dto.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Name = dto.Name,
            Role = "user"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user.Id.ToString(), user.Email, user.Name, user.Role);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Id = user.Id.ToString(),
            Email = user.Email,
            Name = user.Name,
            Role = user.Role
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == "user");

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
        {
            return Unauthorized(new { message = "Invalid email or password" });
        }

        var token = _jwtService.GenerateToken(user.Id.ToString(), user.Email, user.Name, user.Role);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Id = user.Id.ToString(),
            Email = user.Email,
            Name = user.Name,
            Role = user.Role
        });
    }

    [HttpPost("admin/login")]
    public async Task<ActionResult<AuthResponseDto>> AdminLogin([FromBody] AdminLoginDto dto)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email && u.Role == "admin");

        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.Password))
        {
            return Unauthorized(new { message = "Invalid admin credentials" });
        }

        var token = _jwtService.GenerateToken(user.Id.ToString(), user.Email, user.Name, user.Role);

        return Ok(new AuthResponseDto
        {
            Token = token,
            Id = user.Id.ToString(),
            Email = user.Email,
            Name = user.Name,
            Role = user.Role
        });
    }
}
```

### Step 7: Create and Run Migrations

```bash
cd Backend
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### Step 8: MySQL Schema Reference

```sql
-- Create database
CREATE DATABASE quizapp;
USE quizapp;

-- Users table
CREATE TABLE users (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Password VARCHAR(255) NOT NULL,
    Name VARCHAR(100) NOT NULL,
    Role VARCHAR(20) DEFAULT 'user',
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    QuestionText VARCHAR(1000) NOT NULL,
    Option1 VARCHAR(500) NOT NULL,
    Option2 VARCHAR(500) NOT NULL,
    Option3 VARCHAR(500) NOT NULL,
    Option4 VARCHAR(500) NOT NULL,
    CorrectAnswer INT NOT NULL,
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quiz attempts table
CREATE TABLE quiz_attempts (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT NOT NULL,
    Score INT DEFAULT 0,
    TotalQuestions INT DEFAULT 0,
    CorrectAnswers INT DEFAULT 0,
    WrongAnswers INT DEFAULT 0,
    Percentage DOUBLE DEFAULT 0,
    TimeTaken INT DEFAULT 0,
    CompletedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserId) REFERENCES users(Id)
);

-- User answers table
CREATE TABLE user_answers (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    QuizAttemptId INT NOT NULL,
    QuestionId INT NOT NULL,
    SelectedAnswer INT DEFAULT -1,
    IsCorrect BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (QuizAttemptId) REFERENCES quiz_attempts(Id),
    FOREIGN KEY (QuestionId) REFERENCES questions(Id)
);

-- Insert admin user
INSERT INTO users (Email, Password, Name, Role) VALUES
('admin@quiz.com', '$2a$11$...', 'Admin', 'admin');

-- Insert sample questions
INSERT INTO questions (QuestionText, Option1, Option2, Option3, Option4, CorrectAnswer) VALUES
('What does HTML stand for?', 'Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Language', 'Home Tool Markup Language', 0),
('Which programming language is known as the language of the web?', 'Python', 'Java', 'JavaScript', 'C++', 2);
```

---

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
MongoConfigurationException: The connection string is not valid
```
**Solution:** Check your MongoDB connection string in `.env` file. Ensure it follows this format:
```
mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
```

#### 2. CORS Error
```
Access-Control-Allow-Origin error
```
**Solution:** Ensure the frontend URL is added to CORS policy in `Program.cs`:
```csharp
policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
```

#### 3. JWT Token Invalid
```
401 Unauthorized
```
**Solution:**
- Check if JWT_SECRET_KEY is at least 32 characters
- Ensure the token is passed in the Authorization header: `Bearer {token}`
- Check if token hasn't expired

#### 4. Port Already in Use
```
Address already in use
```
**Solution:** Change the port in `launchSettings.json` or kill the process using the port:
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

#### 5. Module Not Found (Frontend)
```
Cannot find module '@/...'
```
**Solution:** Ensure `vite.config.js` has the alias configured:
```javascript
resolve: {
  alias: {
    '@': path.resolve(__dirname, './src'),
  },
}
```

### Getting Help

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB Atlas allows your IP address
4. Check that both frontend and backend are running

---

## License

This project is for educational purposes.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2025-12-09 | Initial release |

---

**Created with React, .NET, MongoDB, and Tailwind CSS**
