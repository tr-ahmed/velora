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
        var product = await _db.Products.FindAsync(productId);
        if (product == null) return NotFound(new { message = "المنتج غير موجود" });

        var reviews = await _db.Reviews
            .Where(r => r.ProductId == productId && r.IsApproved)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var avgRating = reviews.Any() ? Math.Round(reviews.Average(r => r.Rating), 1) : 0;

        return Ok(new
        {
            reviews,
            totalReviews = reviews.Count,
            averageRating = avgRating
        });
    }

    [HttpGet("admin")]
    public async Task<IActionResult> GetAdminAll()
    {
        var reviews = await _db.Reviews
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        var productIds = reviews.Select(r => r.ProductId).Distinct().ToList();
        var products = await _db.Products
            .Where(p => productIds.Contains(p.Id))
            .ToDictionaryAsync(p => p.Id, p => p.Name);

        var ratingDistribution = Enumerable.Range(1, 5).ToDictionary(
            i => i,
            i => reviews.Count(r => r.Rating == i));

        return Ok(new
        {
            reviews = reviews.Select(r => new
            {
                r.Id,
                r.ProductId,
                productName = products.TryGetValue(r.ProductId, out var name) ? name : "منتج محذوف",
                r.UserId,
                r.UserName,
                r.Rating,
                r.Comment,
                r.IsApproved,
                r.CreatedAt
            }),
            stats = new
            {
                totalReviews = reviews.Count,
                pendingReviews = reviews.Count(r => !r.IsApproved),
                approvedReviews = reviews.Count(r => r.IsApproved),
                averageRating = reviews.Any() ? Math.Round(reviews.Average(r => r.Rating), 1) : 0,
                ratingDistribution
            }
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var review = await _db.Reviews.FindAsync(id);
        if (review == null) return NotFound(new { message = "التقييم غير موجود" });

        _db.Reviews.Remove(review);
        await _db.SaveChangesAsync();
        await RecomputeProductRating(review.ProductId);

        return Ok(new { message = "تم حذف التقييم" });
    }

    [HttpPatch("{id}/approval")]
    public async Task<IActionResult> ToggleApproval(int id, [FromBody] ToggleApprovalDto dto)
    {
        var review = await _db.Reviews.FindAsync(id);
        if (review == null) return NotFound(new { message = "التقييم غير موجود" });

        review.IsApproved = dto.IsApproved;
        await _db.SaveChangesAsync();
        await RecomputeProductRating(review.ProductId);

        return Ok(review);
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
            IsApproved = true,
            CreatedAt = DateTime.UtcNow
        };

        _db.Reviews.Add(review);
        await _db.SaveChangesAsync();
        await RecomputeProductRating(review.ProductId);

        return Ok(review);
    }

    private async Task RecomputeProductRating(int productId)
    {
        var product = await _db.Products.FindAsync(productId);
        if (product == null) return;

        var approvedReviews = await _db.Reviews
            .Where(r => r.ProductId == productId && r.IsApproved)
            .ToListAsync();

        product.ReviewsCount = approvedReviews.Count;
        product.Rating = approvedReviews.Any() ? Math.Round(approvedReviews.Average(r => r.Rating), 1) : 0;
        await _db.SaveChangesAsync();
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

public class ToggleApprovalDto
{
    public bool IsApproved { get; set; }
}
