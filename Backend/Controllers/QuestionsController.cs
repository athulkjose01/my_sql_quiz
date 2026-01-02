using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private readonly QuizDbContext _context;

    public QuestionsController(QuizDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<Question>>> GetQuestions()
    {
        return await _context.Questions.ToListAsync();
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<Question>> GetQuestion(string id)
    {
        // We parse string id to Guid
        if (!Guid.TryParse(id, out var guidId)) return NotFound();

        var question = await _context.Questions.FindAsync(guidId);

        if (question == null) return NotFound(new { message = "Question not found" });

        return Ok(question);
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult<Question>> CreateQuestion([FromBody] QuestionDto dto)
    {
        var question = new Question
        {
            Id = Guid.NewGuid(),
            QuestionText = dto.QuestionText,
            Options = dto.Options,
            CorrectAnswer = dto.CorrectAnswer
        };

        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetQuestion), new { id = question.Id.ToString() }, question);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> UpdateQuestion(string id, [FromBody] QuestionDto dto)
    {
        if (!Guid.TryParse(id, out var guidId)) return NotFound();

        var question = await _context.Questions.FindAsync(guidId);
        if (question == null) return NotFound(new { message = "Question not found" });

        question.QuestionText = dto.QuestionText;
        question.Options = dto.Options;
        question.CorrectAnswer = dto.CorrectAnswer;

        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<ActionResult> DeleteQuestion(string id)
    {
        if (!Guid.TryParse(id, out var guidId)) return NotFound();

        var question = await _context.Questions.FindAsync(guidId);
        if (question == null) return NotFound(new { message = "Question not found" });

        _context.Questions.Remove(question);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}