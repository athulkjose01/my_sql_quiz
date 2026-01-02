using Backend.Models;
using Backend.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")]
public class AdminController : ControllerBase
{
    private readonly QuizDbContext _context;

    public AdminController(QuizDbContext context)
    {
        _context = context;
    }

    [HttpGet("reports")]
    public async Task<ActionResult<List<QuizAttempt>>> GetAllReports()
    {
        var attempts = await _context.QuizAttempts
            .OrderByDescending(a => a.CompletedAt)
            .ToListAsync();

        return Ok(attempts);
    }

    [HttpGet("stats")]
    public async Task<ActionResult<StatsDto>> GetStats()
    {
        var totalUsers = await _context.Users
            .CountAsync(u => u.Role == "user");

        var totalQuestions = await _context.Questions
            .CountAsync();

        var totalAttempts = await _context.QuizAttempts
            .CountAsync();

        // Calculate average score. 
        // Note: If there are no attempts, we return 0 to avoid division by zero errors.
        var averageScore = 0.0;
        if (totalAttempts > 0)
        {
            averageScore = await _context.QuizAttempts.AverageAsync(a => a.Percentage);
        }

        return Ok(new StatsDto
        {
            TotalUsers = totalUsers,
            TotalQuestions = totalQuestions,
            TotalAttempts = totalAttempts,
            AverageScore = Math.Round(averageScore, 2)
        });
    }

    [HttpGet("users")]
    public async Task<ActionResult> GetUsers()
    {
        var users = await _context.Users
            .Where(u => u.Role == "user")
            .Select(u => new
            {
                u.Id,
                u.Email,
                u.Name,
                u.CreatedAt
            })
            .ToListAsync();

        return Ok(users);
    }
}