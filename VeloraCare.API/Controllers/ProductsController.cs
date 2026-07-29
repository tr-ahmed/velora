using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly VeloraDbContext _db;

    public ProductsController(VeloraDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] string? category)
    {
        var query = _db.Products.AsQueryable();

        if (!string.IsNullOrEmpty(category) && category.ToLower() != "all")
        {
            query = query.Where(p => p.Category.ToLower() == category.ToLower());
        }

        var products = await query.ToListAsync();
        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound(new { message = "المنتج غير موجود" });
        return Ok(product);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] Product product)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        _db.Products.Add(product);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] Product product)
    {
        var existing = await _db.Products.FindAsync(id);
        if (existing == null) return NotFound(new { message = "المنتج غير موجود" });

        existing.Name = product.Name;
        existing.Tagline = product.Tagline;
        existing.Description = product.Description;
        existing.Price = product.Price;
        existing.OriginalPrice = product.OriginalPrice;
        existing.Category = product.Category;
        existing.Image = product.Image;
        existing.Badge = product.Badge;
        existing.Stock = product.Stock;
        existing.Ingredients = product.Ingredients;
        existing.Benefits = product.Benefits;
        existing.HowToUse = product.HowToUse;
        existing.Volume = product.Volume;
        existing.SkinType = product.SkinType;

        await _db.SaveChangesAsync();
        return Ok(existing);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var product = await _db.Products.FindAsync(id);
        if (product == null) return NotFound(new { message = "المنتج غير موجود" });

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
