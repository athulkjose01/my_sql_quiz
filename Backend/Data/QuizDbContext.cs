using Backend.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;

namespace Backend.Data;

public class QuizDbContext : DbContext
{
    public QuizDbContext(DbContextOptions<QuizDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<QuizAttempt> QuizAttempts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Fix for Question.Options (List<string>)
        var stringListComparer = new ValueComparer<List<string>>(
            (c1, c2) => c1!.SequenceEqual(c2!),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList());

        modelBuilder.Entity<Question>()
            .Property(q => q.Options)
            .HasConversion(
                v => JsonConvert.SerializeObject(v),
                v => JsonConvert.DeserializeObject<List<string>>(v) ?? new List<string>())
            .Metadata.SetValueComparer(stringListComparer);

        // Fix for QuizAttempt.Answers (List<UserAnswer>)
        var answerListComparer = new ValueComparer<List<UserAnswer>>(
            (c1, c2) => JsonConvert.SerializeObject(c1) == JsonConvert.SerializeObject(c2),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
            c => c.ToList());

        modelBuilder.Entity<QuizAttempt>()
            .Property(a => a.Answers)
            .HasConversion(
                v => JsonConvert.SerializeObject(v),
                v => JsonConvert.DeserializeObject<List<UserAnswer>>(v) ?? new List<UserAnswer>())
            .Metadata.SetValueComparer(answerListComparer);

        // Ensure Guids are treated as Char(36) to prevent casting issues
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entity.GetProperties())
            {
                if (property.ClrType == typeof(Guid) || property.ClrType == typeof(Guid?))
                {
                    property.SetColumnType("char(36)");
                }
            }
        }
    }
}