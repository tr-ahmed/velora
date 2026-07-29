using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewsController : ControllerBase
{
    private readonly VeloraDbContext _db;

    public ReviewsController(VeloraDbContext db)
    {
        _db = db;
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProduct(int productId)
    {
        var reviews = await _db.Reviews
            .Where(r => r.ProductId == productId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var product = await _db.Products.FindAsync(productId);
        if (product == null) return NotFound(new { message = "المنتج غير موجود" });

        var avgRating = reviews.Any() ? Math.Round(reviews.Average(r => r.Rating), 1) : 0;

        return Ok(new
        {
            reviews,
            totalReviews = reviews.Count,
            averageRating = avgRating
        });
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateReviewDto dto)
    {
        if (dto.Rating < 1 || dto.Rating > 5)
            return BadRequest(new { message = "التقييم يجب أن يكون بين 1 و 5" });

        var product = await _db.Products.FindAsync(dto.ProductId);
        if (product == null) return NotFound(new { message = "المنتج غير موجود" });

        var review = new Review
        {
            ProductId = dto.ProductId,
            UserId = dto.UserId,
            UserName = dto.UserName,
            Rating = dto.Rating,
            Comment = dto.Comment,
            CreatedAt = DateTime.UtcNow
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();

        var allReviews = await _db.Reviews.Where(r => r.ProductId == dto.ProductId).ToListAsync();
        product.ReviewsCount = allReviews.Count;
        product.Rating = Math.Round(allReviews.Average(r => r.Rating), 1);
        await _db.SaveChangesAsync();

        return Ok(review);
    }
}

public class CreateReviewDto
{
    public int ProductId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
}
