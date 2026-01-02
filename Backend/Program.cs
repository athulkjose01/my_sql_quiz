using System.Text;
using Backend.Data;
using Backend.Services;
using Backend.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using DotNetEnv;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

// 1. Configure MySQL Database
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<QuizDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Configure JWT settings
builder.Services.Configure<JwtSettings>(options =>
{
    options.SecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
        ?? builder.Configuration["Jwt:SecretKey"]!;
    options.Issuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
        ?? builder.Configuration["Jwt:Issuer"]!;
    options.Audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
        ?? builder.Configuration["Jwt:Audience"]!;
    options.ExpiryInHours = int.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRY_HOURS")
        ?? builder.Configuration["Jwt:ExpiryInHours"] ?? "24");
});

// 2. Remove MongoDBService, keep JwtService and SeedService
builder.Services.AddSingleton<JwtService>();
builder.Services.AddScoped<SeedService>();

// Configure JWT Authentication
var jwtSecretKey = Environment.GetEnvironmentVariable("JWT_SECRET_KEY")
    ?? builder.Configuration["Jwt:SecretKey"]!;
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")
    ?? builder.Configuration["Jwt:Issuer"]!;
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE")
    ?? builder.Configuration["Jwt:Audience"]!;

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddOpenApi();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// 3. Seed data
using (var scope = app.Services.CreateScope())
{
    var seedService = scope.ServiceProvider.GetRequiredService<SeedService>();
    await seedService.SeedDataAsync();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();