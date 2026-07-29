using Microsoft.AspNetCore.Mvc;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public UploadController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpPost("image")]
    public async Task<IActionResult> UploadImage(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "No file uploaded" });

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
        var ext = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(ext))
            return BadRequest(new { message = "Only JPG, PNG, WebP and GIF are allowed" });

        if (file.Length > 5 * 1024 * 1024)
            return BadRequest(new { message = "File size must be under 5MB" });

        var uploadsDir = Path.Combine(_env.WebRootPath, "images", "products");
        Directory.CreateDirectory(uploadsDir);

        var fileName = $"{Guid.NewGuid()}{ext}";
        var filePath = Path.Combine(uploadsDir, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var imageUrl = $"/images/products/{fileName}";
        var baseUrl = $"{Request.Scheme}://localhost:5095";
        return Ok(new { url = $"{baseUrl}{imageUrl}", fileName });
    }
}
