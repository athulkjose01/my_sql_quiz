namespace Backend.Models;

public class RegisterDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Name { get; set; }
}

public class LoginDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class AdminLoginDto
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class AuthResponseDto
{
    public required string Token { get; set; }
    public required string Id { get; set; }
    public required string Email { get; set; }
    public required string Name { get; set; }
    public required string Role { get; set; }
}

public class QuestionDto
{
    public required string QuestionText { get; set; }
    public required List<string> Options { get; set; }
    public required int CorrectAnswer { get; set; }
}

public class SubmitQuizDto
{
    public required List<AnswerDto> Answers { get; set; }
    public int TimeTaken { get; set; }
}

public class AnswerDto
{
    public required string QuestionId { get; set; }
    public int SelectedAnswer { get; set; }
}

public class QuizResultDto
{
    public required string Id { get; set; }
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int WrongAnswers { get; set; }
    public double Percentage { get; set; }
    public int TimeTaken { get; set; }
    public DateTime CompletedAt { get; set; }
    public List<AnswerResultDto>? AnswerResults { get; set; }
}

public class AnswerResultDto
{
    public required string QuestionId { get; set; }
    public required string QuestionText { get; set; }
    public required List<string> Options { get; set; }
    public int CorrectAnswer { get; set; }
    public int SelectedAnswer { get; set; }
    public bool IsCorrect { get; set; }
}

public class StatsDto
{
    public int TotalUsers { get; set; }
    public int TotalQuestions { get; set; }
    public int TotalAttempts { get; set; }
    public double AverageScore { get; set; }
}
