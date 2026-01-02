using System.Security.Claims;
using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuizController : ControllerBase
{
    private readonly QuizDbContext _context;

    public QuizController(QuizDbContext context)
    {
        _context = context;
    }

    [HttpPost("submit")]
    public async Task<ActionResult<QuizResultDto>> SubmitQuiz([FromBody] SubmitQuizDto dto)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var userName = User.FindFirst(ClaimTypes.Name)?.Value;
        var userEmail = User.FindFirst(ClaimTypes.Email)?.Value;

        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var questions = await _context.Questions.ToListAsync();

        // Convert Guid keys to string for dictionary lookup matching DTO
        var questionDict = questions.ToDictionary(q => q.Id.ToString());

        var answers = new List<UserAnswer>();
        int correctCount = 0;

        foreach (var answer in dto.Answers)
        {
            if (questionDict.TryGetValue(answer.QuestionId, out var question))
            {
                var isCorrect = question.CorrectAnswer == answer.SelectedAnswer;
                if (isCorrect) correctCount++;

                answers.Add(new UserAnswer
                {
                    QuestionId = answer.QuestionId,
                    SelectedAnswer = answer.SelectedAnswer,
                    IsCorrect = isCorrect
                });
            }
        }

        var totalQuestions = questions.Count;
        var wrongCount = totalQuestions - correctCount;
        var percentage = totalQuestions > 0 ? (double)correctCount / totalQuestions * 100 : 0;

        var attempt = new QuizAttempt
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            UserName = userName,
            UserEmail = userEmail,
            Answers = answers,
            Score = correctCount,
            TotalQuestions = totalQuestions,
            CorrectAnswers = correctCount,
            WrongAnswers = wrongCount,
            Percentage = Math.Round(percentage, 2),
            TimeTaken = dto.TimeTaken
        };

        _context.QuizAttempts.Add(attempt);
        await _context.SaveChangesAsync();

        var answerResults = answers.Select(a =>
        {
            var q = questionDict[a.QuestionId];
            return new AnswerResultDto
            {
                QuestionId = a.QuestionId,
                QuestionText = q.QuestionText,
                Options = q.Options,
                CorrectAnswer = q.CorrectAnswer,
                SelectedAnswer = a.SelectedAnswer,
                IsCorrect = a.IsCorrect
            };
        }).ToList();

        return Ok(new QuizResultDto
        {
            Id = attempt.Id.ToString(),
            Score = correctCount,
            TotalQuestions = totalQuestions,
            CorrectAnswers = correctCount,
            WrongAnswers = wrongCount,
            Percentage = Math.Round(percentage, 2),
            TimeTaken = dto.TimeTaken,
            CompletedAt = attempt.CompletedAt,
            AnswerResults = answerResults
        });
    }

    [HttpGet("history")]
    public async Task<ActionResult<List<QuizResultDto>>> GetHistory()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var attempts = await _context.QuizAttempts
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.CompletedAt)
            .ToListAsync();

        var results = attempts.Select(a => new QuizResultDto
        {
            Id = a.Id.ToString(),
            Score = a.Score,
            TotalQuestions = a.TotalQuestions,
            CorrectAnswers = a.CorrectAnswers,
            WrongAnswers = a.WrongAnswers,
            Percentage = a.Percentage,
            TimeTaken = a.TimeTaken,
            CompletedAt = a.CompletedAt
        }).ToList();

        return Ok(results);
    }

    [HttpGet("result/{id}")]
    public async Task<ActionResult<QuizResultDto>> GetResult(string id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(id, out var guidId)) return NotFound();

        var attempt = await _context.QuizAttempts.FindAsync(guidId);

        if (attempt == null) return NotFound(new { message = "Quiz attempt not found" });

        if (attempt.UserId != userId && User.FindFirst(ClaimTypes.Role)?.Value != "admin")
        {
            return Forbid();
        }

        var questions = await _context.Questions.ToListAsync();
        var questionDict = questions.ToDictionary(q => q.Id.ToString());

        var answerResults = attempt.Answers.Select(a =>
        {
            if (questionDict.TryGetValue(a.QuestionId, out var q))
            {
                return new AnswerResultDto
                {
                    QuestionId = a.QuestionId,
                    QuestionText = q.QuestionText,
                    Options = q.Options,
                    CorrectAnswer = q.CorrectAnswer,
                    SelectedAnswer = a.SelectedAnswer,
                    IsCorrect = a.IsCorrect
                };
            }
            return null;
        }).Where(r => r != null).Cast<AnswerResultDto>().ToList();

        return Ok(new QuizResultDto
        {
            Id = attempt.Id.ToString(),
            Score = attempt.Score,
            TotalQuestions = attempt.TotalQuestions,
            CorrectAnswers = attempt.CorrectAnswers,
            WrongAnswers = attempt.WrongAnswers,
            Percentage = attempt.Percentage,
            TimeTaken = attempt.TimeTaken,
            CompletedAt = attempt.CompletedAt,
            AnswerResults = answerResults
        });
    }
}