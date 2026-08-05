using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SettingsController : ControllerBase
{
    private readonly VeloraDbContext _context;

    public SettingsController(VeloraDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetSettings()
    {
        var settings = await _context.StoreSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            settings = new StoreSettings();
            _context.StoreSettings.Add(settings);
            await _context.SaveChangesAsync();
        }
        return Ok(settings);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateSettings([FromBody] StoreSettings updated)
    {
        var settings = await _context.StoreSettings.FirstOrDefaultAsync();
        if (settings == null)
        {
            settings = new StoreSettings();
            _context.StoreSettings.Add(settings);
        }

        settings.ShippingFee = updated.ShippingFee;
        settings.WhatsAppNumber = updated.WhatsAppNumber;
        settings.MaintenanceMode = updated.MaintenanceMode;
        settings.StoreName = updated.StoreName;

        await _context.SaveChangesAsync();
        return Ok(settings);
    }
}
