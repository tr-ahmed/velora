using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly VeloraDbContext _db;

    public AuthController(VeloraDbContext db)
    {
        _db = db;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == dto.Email.ToLower());
        if (user == null || user.PasswordHash != dto.Password)
        {
            return BadRequest(new { message = "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
        }

        return Ok(new
        {
            token = $"velora-jwt-token-{Guid.NewGuid()}",
            user = new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.Phone,
                user.City,
                user.Address
            }
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        if (await _db.Users.AnyAsync(u => u.Email.ToLower() == dto.Email.ToLower()))
        {
            return BadRequest(new { message = "هذا البريد الإلكتروني مسجل بالفعل" });
        }

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = dto.Password,
            Role = "Customer",
            Phone = dto.Phone ?? string.Empty,
            City = dto.City ?? string.Empty,
            Address = dto.Address ?? string.Empty
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            token = $"velora-jwt-token-{Guid.NewGuid()}",
            user = new
            {
                user.Id,
                user.FullName,
                user.Email,
                user.Role,
                user.Phone,
                user.City,
                user.Address
            }
        });
    }
}

public class LoginDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterDto
{
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string? Phone { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
}
