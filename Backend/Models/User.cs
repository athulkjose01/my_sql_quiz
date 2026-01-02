using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class User
{
    [Key]
    public Guid Id { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public required string Name { get; set; }
    public string Role { get; set; } = "user";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}