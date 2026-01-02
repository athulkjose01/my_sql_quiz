using Backend.Models;
using Backend.Services;
using Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly QuizDbContext _context;
    private readonly JwtService _jwtService;

    public AuthController(QuizDbContext context, JwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
        if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
        {
            return BadRequest(new { message = "Email already exists" });
        }

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = dto.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Name = dto.Name,
            Role = "user"
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var token = _jwtService.GenerateToken(user);

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

        var token = _jwtService.GenerateToken(user);

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

        var token = _jwtService.GenerateToken(user);

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