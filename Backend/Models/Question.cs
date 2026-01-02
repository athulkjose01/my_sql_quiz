using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class Question
{
    [Key]
    public Guid Id { get; set; }
    public required string QuestionText { get; set; }

    // We will store this list as a JSON string in the database
    public required List<string> Options { get; set; }
    public required int CorrectAnswer { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}