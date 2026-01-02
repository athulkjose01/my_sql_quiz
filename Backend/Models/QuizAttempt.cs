using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class QuizAttempt
{
    [Key]
    public Guid Id { get; set; }
    public required string UserId { get; set; }
    public string? UserName { get; set; }
    public string? UserEmail { get; set; }

    // We will store this list as a JSON string in the database
    public required List<UserAnswer> Answers { get; set; }

    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int WrongAnswers { get; set; }
    public double Percentage { get; set; }
    public int TimeTaken { get; set; }
    public DateTime CompletedAt { get; set; } = DateTime.UtcNow;
}

public class UserAnswer
{
    public required string QuestionId { get; set; }
    public int SelectedAnswer { get; set; }
    public bool IsCorrect { get; set; }
}