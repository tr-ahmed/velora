using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TestimonialsController : ControllerBase
{
    private readonly VeloraDbContext _context;

    public TestimonialsController(VeloraDbContext context)
    {
        _context = context;
    }

    // GET: api/testimonials
    [HttpGet]
    public async Task<IActionResult> GetTestimonials([FromQuery] bool activeOnly = true)
    {
        var query = _context.Testimonials.AsQueryable();

        if (activeOnly)
        {
            query = query.Where(t => t.IsActive);
        }

        var testimonials = await query.OrderByDescending(t => t.CreatedAt).ToListAsync();
        return Ok(testimonials);
    }

    // POST: api/testimonials
    [HttpPost]
    public async Task<IActionResult> CreateTestimonial([FromBody] Testimonial testimonial)
    {
        testimonial.CreatedAt = DateTime.UtcNow;
        _context.Testimonials.Add(testimonial);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTestimonials), new { id = testimonial.Id }, testimonial);
    }

    // PUT: api/testimonials/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTestimonial(int id, [FromBody] Testimonial updated)
    {
        if (id != updated.Id) return BadRequest("ID mismatch");

        var existing = await _context.Testimonials.FindAsync(id);
        if (existing == null) return NotFound("Testimonial not found");

        existing.Name = updated.Name;
        existing.NameEn = updated.NameEn;
        existing.Role = updated.Role;
        existing.RoleEn = updated.RoleEn;
        existing.Avatar = updated.Avatar;
        existing.Comment = updated.Comment;
        existing.CommentEn = updated.CommentEn;
        existing.Rating = updated.Rating;
        existing.Product = updated.Product;
        existing.IsActive = updated.IsActive;

        await _context.SaveChangesAsync();
        return Ok(existing);
    }

    // DELETE: api/testimonials/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTestimonial(int id)
    {
        var existing = await _context.Testimonials.FindAsync(id);
        if (existing == null) return NotFound();

        _context.Testimonials.Remove(existing);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}
