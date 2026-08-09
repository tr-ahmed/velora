using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SocialReviewsController : ControllerBase
{
    private readonly VeloraDbContext _context;

    public SocialReviewsController(VeloraDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SocialReview>>> GetSocialReviews([FromQuery] bool activeOnly = false)
    {
        var query = _context.SocialReviews.AsQueryable();

        if (activeOnly)
        {
            query = query.Where(r => r.IsActive);
        }

        return await query.OrderBy(r => r.DisplayOrder).ToListAsync();
    }

    [HttpPost]
    public async Task<ActionResult<SocialReview>> CreateSocialReview(SocialReview review)
    {
        review.CreatedAt = DateTime.UtcNow;
        _context.SocialReviews.Add(review);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetSocialReviews), new { id = review.Id }, review);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateSocialReview(int id, SocialReview review)
    {
        if (id != review.Id) return BadRequest();

        var existing = await _context.SocialReviews.FindAsync(id);
        if (existing == null) return NotFound();

        existing.ImageUrl = review.ImageUrl;
        existing.IsActive = review.IsActive;
        existing.DisplayOrder = review.DisplayOrder;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteSocialReview(int id)
    {
        var review = await _context.SocialReviews.FindAsync(id);
        if (review == null) return NotFound();

        _context.SocialReviews.Remove(review);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}
