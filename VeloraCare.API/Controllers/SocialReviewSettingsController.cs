using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SocialReviewSettingsController : ControllerBase
{
    private readonly VeloraDbContext _context;

    public SocialReviewSettingsController(VeloraDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<SocialReviewSettings>> GetSettings()
    {
        var settings = await _context.SocialReviewSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            settings = new SocialReviewSettings();
            _context.SocialReviewSettings.Add(settings);
            await _context.SaveChangesAsync();
        }
        return settings;
    }

    [HttpPut]
    public async Task<IActionResult> UpdateSettings(SocialReviewSettings updatedSettings)
    {
        var settings = await _context.SocialReviewSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            _context.SocialReviewSettings.Add(updatedSettings);
        }
        else
        {
            settings.IsVisible = updatedSettings.IsVisible;
            settings.SectionTitle = updatedSettings.SectionTitle;
            settings.SectionTitleEn = updatedSettings.SectionTitleEn;
            settings.SectionSubtitle = updatedSettings.SectionSubtitle;
            settings.SectionSubtitleEn = updatedSettings.SectionSubtitleEn;
            settings.AutoPlay = updatedSettings.AutoPlay;
            settings.AutoPlayInterval = updatedSettings.AutoPlayInterval;
        }

        await _context.SaveChangesAsync();
        return NoContent();
    }
}
