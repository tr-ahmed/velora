using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly VeloraDbContext _db;

    public UsersController(VeloraDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? search)
    {
        var query = _db.Users.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            query = query.Where(u =>
                u.FullName.ToLower().Contains(s) ||
                u.Email.ToLower().Contains(s) ||
                u.Phone.Contains(s) ||
                u.City.ToLower().Contains(s)
            );
        }

        var users = await query
            .OrderBy(u => u.Role == "Admin" ? 0 : 1)
            .ThenBy(u => u.FullName)
            .Select(u => new
            {
                u.Id,
                u.FullName,
                u.Email,
                u.Role,
                u.Phone,
                u.City,
                u.Address,
                OrderCount = _db.Orders.Count(o => o.Phone == u.Phone || o.FullName == u.FullName),
                TotalSpent = _db.Orders.Where(o => o.Phone == u.Phone || o.FullName == u.FullName).Sum(o => (decimal?)o.Total) ?? 0
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "المستخدم غير موجود" });

        return Ok(new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.Role,
            user.Phone,
            user.City,
            user.Address,
            user.Avatar
        });
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto dto)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "المستخدم غير موجود" });

        user.FullName = dto.FullName ?? user.FullName;
        user.Email = dto.Email ?? user.Email;
        user.Phone = dto.Phone ?? user.Phone;
        user.City = dto.City ?? user.City;
        user.Address = dto.Address ?? user.Address;
        user.Avatar = dto.Avatar ?? user.Avatar;

        if (!string.IsNullOrWhiteSpace(dto.Password))
            user.PasswordHash = dto.Password;

        await _db.SaveChangesAsync();

        return Ok(new
        {
            user.Id,
            user.FullName,
            user.Email,
            user.Role,
            user.Phone,
            user.City,
            user.Address,
            user.Avatar
        });
    }

    [HttpPut("{id}/role")]
    public async Task<IActionResult> UpdateRole(int id, [FromBody] UpdateRoleDto dto)
    {
        if (dto.Role != "Admin" && dto.Role != "Customer")
            return BadRequest(new { message = "الصلاحية يجب أن تكون Admin أو Customer" });

        var user = await _db.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "المستخدم غير موجود" });

        var adminCount = await _db.Users.CountAsync(u => u.Role == "Admin");
        if (user.Role == "Admin" && dto.Role != "Admin" && adminCount <= 1)
            return BadRequest(new { message = "لا يمكن إزالة صلاحية الأدمن الوحيد. يجب أن يكون هناك أدمن واحد على الأقل" });

        user.Role = dto.Role;
        await _db.SaveChangesAsync();

        return Ok(new { message = "تم تحديث الصلاحية بنجاح", user.Id, user.Role });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var user = await _db.Users.FindAsync(id);
        if (user == null)
            return NotFound(new { message = "المستخدم غير موجود" });

        if (user.Role == "Admin")
        {
            var adminCount = await _db.Users.CountAsync(u => u.Role == "Admin");
            if (adminCount <= 1)
                return BadRequest(new { message = "لا يمكن حذف الأدمن الوحيد. يجب أن يكون هناك أدمن واحد على الأقل" });
        }

        _db.Users.Remove(user);
        await _db.SaveChangesAsync();

        return Ok(new { message = "تم حذف المستخدم بنجاح" });
    }
}

public class UpdateUserDto
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
    public string? Phone { get; set; }
    public string? City { get; set; }
    public string? Address { get; set; }
    public string? Avatar { get; set; }
}

public class UpdateRoleDto
{
    public string Role { get; set; } = "Customer";
}
