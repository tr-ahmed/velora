using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OffersController : ControllerBase
{
    private readonly VeloraDbContext _db;

    public OffersController(VeloraDbContext db)
    {
        _db = db;
    }

    // GET /api/offers - Active offer for client banner
    [HttpGet]
    public async Task<IActionResult> GetActiveOffers()
    {
        var activeOffers = await _db.Offers
            .Where(o => o.IsActive)
            .OrderByDescending(o => o.Id)
            .ToListAsync();

        return Ok(activeOffers);
    }

    // GET /api/offers/admin - All offers for admin dashboard
    [HttpGet("admin")]
    public async Task<IActionResult> GetAllOffersForAdmin()
    {
        var allOffers = await _db.Offers
            .OrderByDescending(o => o.Id)
            .ToListAsync();

        return Ok(allOffers);
    }

    // POST /api/offers - Create offer
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Offer offer)
    {
        if (string.IsNullOrWhiteSpace(offer.Title))
        {
            return BadRequest(new { message = "عنوان العرض مطلوب" });
        }

        _db.Offers.Add(offer);
        await _db.SaveChangesAsync();
        return Ok(offer);
    }

    // PUT /api/offers/{id} - Update offer
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Offer updated)
    {
        var offer = await _db.Offers.FindAsync(id);
        if (offer == null) return NotFound(new { message = "العرض غير موجود" });

        offer.Title = updated.Title;
        offer.Subtitle = updated.Subtitle;
        offer.CouponCode = updated.CouponCode;
        offer.DiscountPercentage = updated.DiscountPercentage;
        offer.EndTime = updated.EndTime;
        offer.IsActive = updated.IsActive;

        await _db.SaveChangesAsync();
        return Ok(offer);
    }

    // PUT /api/offers/{id}/toggle - Toggle active state
    [HttpPut("{id}/toggle")]
    public async Task<IActionResult> Toggle(int id)
    {
        var offer = await _db.Offers.FindAsync(id);
        if (offer == null) return NotFound(new { message = "العرض غير موجود" });

        offer.IsActive = !offer.IsActive;
        await _db.SaveChangesAsync();
        return Ok(offer);
    }

    // DELETE /api/offers/{id} - Delete offer
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var offer = await _db.Offers.FindAsync(id);
        if (offer == null) return NotFound(new { message = "العرض غير موجود" });

        _db.Offers.Remove(offer);
        await _db.SaveChangesAsync();
        return Ok(new { message = "تم حذف العرض بنجاح" });
    }
}
