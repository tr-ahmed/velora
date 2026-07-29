using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CouponsController : ControllerBase
{
    private readonly VeloraDbContext _db;

    public CouponsController(VeloraDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var coupons = await _db.Coupons.ToListAsync();
        return Ok(coupons);
    }

    [HttpPost("validate")]
    public async Task<IActionResult> Validate([FromBody] ValidateCouponDto dto)
    {
        var coupon = await _db.Coupons.FirstOrDefaultAsync(c => c.Code.ToLower() == dto.Code.ToLower() && c.IsActive);
        if (coupon == null)
        {
            return BadRequest(new { message = "كود الخصم غير صحيح أو غير مفعل" });
        }
        return Ok(new { code = coupon.Code, discountPercentage = coupon.DiscountPercentage });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Coupon coupon)
    {
        if (await _db.Coupons.AnyAsync(c => c.Code.ToLower() == coupon.Code.ToLower()))
        {
            return BadRequest(new { message = "كود الخصم موجود بالفعل" });
        }

        _db.Coupons.Add(coupon);
        await _db.SaveChangesAsync();
        return Ok(coupon);
    }

    [HttpPut("{id}/toggle")]
    public async Task<IActionResult> Toggle(int id)
    {
        var coupon = await _db.Coupons.FindAsync(id);
        if (coupon == null) return NotFound();

        coupon.IsActive = !coupon.IsActive;
        await _db.SaveChangesAsync();
        return Ok(coupon);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var coupon = await _db.Coupons.FindAsync(id);
        if (coupon == null) return NotFound();

        _db.Coupons.Remove(coupon);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public class ValidateCouponDto
{
    public string Code { get; set; } = string.Empty;
}
