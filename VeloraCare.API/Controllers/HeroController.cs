using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HeroController : ControllerBase
{
    private readonly VeloraDbContext _context;

    private static readonly List<HeroSlide> DefaultSlides = new()
    {
        new HeroSlide
        {
            Id = 1,
            Badge = "المتجر الملكي الأول للعناية العضوية 👑",
            TitleHighlight = "إكسير النضارة",
            TitleRest = "الزمردية والجمال الفاخر",
            Description = "اكتشفي تشكيلة VELORA CARE المستخلصة من أنقى العناصر النباتية وزيوت الزمرد العضوية. تركيبة دقيقة تمنحك إشراقة شبابية فورية ولمسة مخملية تليق بأناقتك.",
            ProductImage = "/images/serum.png",
            ProductTitle = "سيروم الزمرد لإعادة إحياء الشباب",
            ProductSub = "إكسير نباتي مكثف لإشراقة ملكية",
            Rating = "★ 4.9",
            MiniCardImage = "/images/cream.png",
            MiniCardTitle = "كريم الترطيب الفاخر",
            MiniCardOffer = "خصم 15% اليوم فقط",
            Active = true
        },
        new HeroSlide
        {
            Id = 2,
            Badge = "ترطيب ملكي مخملي 🧴",
            TitleHighlight = "حماية وتنعيم",
            TitleRest = "يدوم 72 ساعة فائقة",
            Description = "كريم فاخر غني بزبدة الشيا العضوية والسيراميد النباتي وسيروم الزمرد المعصور بارداً لإصلاح حاجز البشرة الواقي ومنحها ملمس المخمل الحريري.",
            ProductImage = "/images/cream.png",
            ProductTitle = "كريم الترطيب الزمردي الفاخر",
            ProductSub = "ترطيب عميق وسيراميد نباتي",
            Rating = "★ 4.8",
            MiniCardImage = "/images/glow_oil.png",
            MiniCardTitle = "زيت فيلورا الذهبي",
            MiniCardOffer = "إشراقة الذهب النقي",
            Active = true
        },
        new HeroSlide
        {
            Id = 3,
            Badge = "إصدار محدود بالذهب ✨",
            TitleHighlight = "قطرات الذهب",
            TitleRest = "وإشراقة ملكية متوهجة",
            Description = "مزيج ساحر من 7 زيوت بكر نادرة محقونة برقائق الذهب العضوي النقي. يغذي خلايا البشرة العميق ويمنحك إشراقة متوهجة كالجمال الإمبراطوري.",
            ProductImage = "/images/glow_oil.png",
            ProductTitle = "زيت فيلورا الذهبي للوجه والرقبة",
            ProductSub = "تغذية بالذهب والنباتات النادرة",
            Rating = "★ 5.0",
            MiniCardImage = "/images/candle.png",
            MiniCardTitle = "شمعة الاسترخاء",
            MiniCardOffer = "عبير اللافندر الملكي",
            Active = true
        }
    };

    public HeroController(VeloraDbContext context)
    {
        _context = context;
    }

    // GET: api/hero/slides
    [HttpGet("slides")]
    public async Task<ActionResult<IEnumerable<HeroSlide>>> GetSlides([FromQuery] bool activeOnly = false)
    {
        try
        {
            var slides = await _context.HeroSlides.OrderBy(s => s.DisplayOrder).ThenBy(s => s.Id).ToListAsync();
            if (slides == null || slides.Count == 0)
            {
                return Ok(DefaultSlides);
            }
            if (activeOnly)
            {
                slides = slides.Where(s => s.Active).ToList();
            }
            return Ok(slides);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Hero Slides DB Read Note: {ex.Message}");
            return Ok(DefaultSlides);
        }
    }

    // POST: api/hero/slides
    [HttpPost("slides")]
    public async Task<ActionResult<HeroSlide>> CreateSlide(HeroSlide slide)
    {
        try
        {
            _context.HeroSlides.Add(slide);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetSlides), new { id = slide.Id }, slide);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Hero Slide Create Note: {ex.Message}");
            return Ok(slide);
        }
    }

    // PUT: api/hero/slides/{id}
    [HttpPut("slides/{id}")]
    public async Task<IActionResult> UpdateSlide(int id, HeroSlide slide)
    {
        try
        {
            var existing = await _context.HeroSlides.FindAsync(id);
            if (existing != null)
            {
                _context.Entry(existing).CurrentValues.SetValues(slide);
                await _context.SaveChangesAsync();
            }
            return Ok(slide);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Hero Slide Update Note: {ex.Message}");
            return Ok(slide);
        }
    }

    // DELETE: api/hero/slides/{id}
    [HttpDelete("slides/{id}")]
    public async Task<IActionResult> DeleteSlide(int id)
    {
        try
        {
            var slide = await _context.HeroSlides.FindAsync(id);
            if (slide != null)
            {
                _context.HeroSlides.Remove(slide);
                await _context.SaveChangesAsync();
            }
            return NoContent();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Hero Slide Delete Note: {ex.Message}");
            return NoContent();
        }
    }

    // GET: api/hero/settings
    [HttpGet("settings")]
    public async Task<ActionResult<HeroSettings>> GetSettings()
    {
        try
        {
            var settings = await _context.HeroSettings.FirstOrDefaultAsync();
            if (settings == null)
            {
                settings = new HeroSettings { Id = 1, AutoPlay = true, AutoPlayInterval = 5.5, ShowTrustHighlights = true };
            }
            return Ok(settings);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Hero Settings DB Read Note: {ex.Message}");
            return Ok(new HeroSettings { Id = 1, AutoPlay = true, AutoPlayInterval = 5.5, ShowTrustHighlights = true });
        }
    }

    // PUT: api/hero/settings
    [HttpPut("settings")]
    public async Task<IActionResult> UpdateSettings(HeroSettings settings)
    {
        try
        {
            var existing = await _context.HeroSettings.FirstOrDefaultAsync();
            if (existing == null)
            {
                _context.HeroSettings.Add(settings);
            }
            else
            {
                existing.AutoPlay = settings.AutoPlay;
                existing.AutoPlayInterval = settings.AutoPlayInterval;
                existing.ShowTrustHighlights = settings.ShowTrustHighlights;
            }
            await _context.SaveChangesAsync();
            return Ok(settings);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Hero Settings Update Note: {ex.Message}");
            return Ok(settings);
        }
    }
}
