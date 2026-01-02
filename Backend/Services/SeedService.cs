using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services;

public class SeedService
{
    private readonly QuizDbContext _context;

    public SeedService(QuizDbContext context)
    {
        _context = context;
    }

    public async Task SeedDataAsync()
    {
        // This ensures the database tables are created automatically!
        await _context.Database.EnsureCreatedAsync();

        await SeedAdminUserAsync();
        await SeedQuestionsAsync();
    }

    private async Task SeedAdminUserAsync()
    {
        var existingAdmin = await _context.Users
            .FirstOrDefaultAsync(u => u.Role == "admin");

        if (existingAdmin == null)
        {
            var admin = new User
            {
                Id = Guid.NewGuid(),
                Email = "admin@quiz.com",
                Password = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Name = "Admin",
                Role = "admin"
            };
            _context.Users.Add(admin);
            await _context.SaveChangesAsync();
        }
    }

    private async Task SeedQuestionsAsync()
    {
        var count = await _context.Questions.CountAsync();

        if (count == 0)
        {
            var questions = new List<Question>
            {
                // ... (Paste your same list of questions here) ...
                // Just make sure to remove "new()" and use "new Question" if implicit types confuse the compiler, 
                // but your previous list structure is fine.
                // IMPORTANT: Add "Id = Guid.NewGuid()," to every new Question in the list.
            };

            // Shortened example for one question:
            var sampleQuestion = new Question
            {
                Id = Guid.NewGuid(),
                QuestionText = "What does HTML stand for?",
                Options = new List<string> { "Hyper Text Markup Language", "High Tech Modern Language" },
                CorrectAnswer = 0
            };

            // You can copy your huge list from before, just ensure they are valid Question objects.
            // Since you have the content, I won't re-paste the whole list to save space.

            // _context.Questions.AddRange(questions); // Uncomment this when you paste your list back
            // await _context.SaveChangesAsync();
        }
    }
}