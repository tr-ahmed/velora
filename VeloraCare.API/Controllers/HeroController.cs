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
            BadgeEn = "The First Royal Organic Care Store 👑",
            TitleHighlight = "إكسير النضارة",
            TitleHighlightEn = "Elixir of Radiance",
            TitleRest = "الزمردية والجمال الفاخر",
            TitleRestEn = "Emerald & Luxurious Beauty",
            Description = "اكتشفي تشكيلة VELORA CARE المستخلصة من أنقى العناصر النباتية وزيوت الزمرد العضوية. تركيبة دقيقة تمنحك إشراقة شبابية فورية ولمسة مخملية تليق بأناقتك.",
            DescriptionEn = "Discover the VELORA CARE collection, extracted from the purest botanical elements and organic emerald oils. A precise formula giving you an instant youthful glow and a velvety touch worthy of your elegance.",
            ProductImage = "/images/serum.png",
            ProductTitle = "سيروم الزمرد لإعادة إحياء الشباب",
            ProductTitleEn = "Emerald Youth Revival Serum",
            ProductSub = "إكسير نباتي مكثف لإشراقة ملكية",
            ProductSubEn = "Intensive botanical elixir for royal radiance",
            Rating = 4.9,
            MiniCardImage = "/images/cream.png",
            MiniCardTitle = "كريم الترطيب الفاخر",
            MiniCardTitleEn = "Luxury Hydration Cream",
            MiniCardOffer = "خصم 15% اليوم فقط",
            MiniCardOfferEn = "15% Off Today Only",
            Active = true
        },
        new HeroSlide
        {
            Id = 2,
            Badge = "ترطيب ملكي مخملي 🧴",
            BadgeEn = "Royal Velvety Hydration 🧴",
            TitleHighlight = "حماية وتنعيم",
            TitleHighlightEn = "Protect & Smooth",
            TitleRest = "يدوم 72 ساعة فائقة",
            TitleRestEn = "Lasts 72 Super Hours",
            Description = "كريم فاخر غني بزبدة الشيا العضوية والسيراميد النباتي وسيروم الزمرد المعصور بارداً لإصلاح حاجز البشرة الواقي ومنحها ملمس المخمل الحريري.",
            DescriptionEn = "A luxurious cream rich in organic shea butter, plant ceramides, and cold-pressed emerald serum to repair the skin's protective barrier and give it a silky velvet texture.",
            ProductImage = "/images/cream.png",
            ProductTitle = "كريم الترطيب الزمردي الفاخر",
            ProductTitleEn = "Luxury Emerald Hydration Cream",
            ProductSub = "ترطيب عميق وسيراميد نباتي",
            ProductSubEn = "Deep hydration & plant ceramides",
            Rating = 4.8,
            MiniCardImage = "/images/glow_oil.png",
            MiniCardTitle = "زيت فيلورا الذهبي",
            MiniCardTitleEn = "Velora Golden Oil",
            MiniCardOffer = "إشراقة الذهب النقي",
            MiniCardOfferEn = "Pure Gold Radiance",
            Active = true
        },
        new HeroSlide
        {
            Id = 3,
            Badge = "إصدار محدود بالذهب ✨",
            BadgeEn = "Limited Gold Edition ✨",
            TitleHighlight = "قطرات الذهب",
            TitleHighlightEn = "Drops of Gold",
            TitleRest = "وإشراقة ملكية متوهجة",
            TitleRestEn = "and a glowing royal radiance",
            Description = "مزيج ساحر من 7 زيوت بكر نادرة محقونة برقائق الذهب العضوي النقي. يغذي خلايا البشرة العميق ويمنحك إشراقة متوهجة كالجمال الإمبراطوري.",
            DescriptionEn = "An enchanting blend of 7 rare virgin oils infused with pure organic gold flakes. Deeply nourishes skin cells and gives you a glowing radiance like imperial beauty.",
            ProductImage = "/images/glow_oil.png",
            ProductTitle = "زيت فيلورا الذهبي للوجه والرقبة",
            ProductTitleEn = "Velora Golden Face & Neck Oil",
            ProductSub = "تغذية بالذهب والنباتات النادرة",
            ProductSubEn = "Nourishment with gold and rare botanicals",
            Rating = 5.0,
            MiniCardImage = "/images/candle.png",
            MiniCardTitle = "شمعة الاسترخاء",
            MiniCardTitleEn = "Relaxation Candle",
            MiniCardOffer = "عبير اللافندر الملكي",
            MiniCardOfferEn = "Royal Lavender Scent",
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
