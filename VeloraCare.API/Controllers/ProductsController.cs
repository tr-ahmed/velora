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
        existing.NameEn = product.NameEn;
        existing.Tagline = product.Tagline;
        existing.TaglineEn = product.TaglineEn;
        existing.Description = product.Description;
        existing.DescriptionEn = product.DescriptionEn;
        existing.Price = product.Price;
        existing.OriginalPrice = product.OriginalPrice;
        existing.CostPrice = product.CostPrice;
        existing.Category = product.Category;
        existing.Image = product.Image;
        existing.Badge = product.Badge;
        existing.BadgeEn = product.BadgeEn;
        existing.Stock = product.Stock;
        existing.Ingredients = product.Ingredients;
        existing.IngredientsEn = product.IngredientsEn;
        existing.Benefits = product.Benefits;
        existing.BenefitsEn = product.BenefitsEn;
        existing.HowToUse = product.HowToUse;
        existing.HowToUseEn = product.HowToUseEn;
        existing.Volume = product.Volume;
        existing.SkinType = product.SkinType;
        existing.SkinTypeEn = product.SkinTypeEn;

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

    [HttpGet("seed-english")]
    public async Task<IActionResult> SeedEnglish()
    {
        VeloraCare.API.Data.DbInitializer.Initialize(_db);
        
        // Update categories
        var cat = _db.Categories.FirstOrDefault(c => c.Code == "cleansers");
        if (cat != null) { cat.NameEn = "Cleansers & Purifiers"; cat.DescriptionEn = "Gentle cleansers and purifiers that deeply clean the skin without stripping its moisture"; }
        cat = _db.Categories.FirstOrDefault(c => c.Code == "toners");
        if (cat != null) { cat.NameEn = "Toners & Balance"; cat.DescriptionEn = "Toners that restore skin balance, hydrate, and prep it to absorb the rest of the care steps"; }
        cat = _db.Categories.FirstOrDefault(c => c.Code == "serums");
        if (cat != null) { cat.NameEn = "Serums & Elixirs"; cat.DescriptionEn = "Effective concentrations that treat the skin, providing radiance and deep hydration"; }
        cat = _db.Categories.FirstOrDefault(c => c.Code == "body");
        if (cat != null) { cat.NameEn = "Body Splash & Fragrances"; cat.DescriptionEn = "Light body splash with luxurious scents that last up to 12 hours for daily use"; }
        cat = _db.Categories.FirstOrDefault(c => c.Code == "bundles");
        if (cat != null) { cat.NameEn = "Bundles & Offers"; cat.DescriptionEn = "Collection packages of VELORA products at a special price"; }

        // Update Products
        var p = _db.Products.FirstOrDefault(p => p.Category == "cleansers");
        if (p != null) { p.NameEn = "Purifying Cleanser"; p.TaglineEn = "Clean, balanced, and radiant skin... starts from the first wash. ✨"; p.BadgeEn = "30% Off"; p.SkinTypeEn = "All Skin Types"; p.DescriptionEn = "Give your skin the care it deserves with Velora Care Purifying Cleanser, a daily cleanser that combines deep cleansing with effective care without causing dryness or tightness.\n\nIts smart formula works to remove dirt, excess oils, makeup residue, and sunscreen, while helping to clean pores and reduce the appearance of blackheads and pimples, leaving your skin soft, refreshed, and clearer after every use.\n\nThanks to Niacinamide, Salicylic Acid, and Zinc PCA, the cleanser helps control skin shine, improve pore appearance, and support skin tone evening. Hyaluronic Acid and Allantoin also boost skin hydration and soothing, for a deep clean without losing natural moisture."; p.IngredientsEn = "Niacinamide to even skin tone and reduce pore appearance.\nSalicylic Acid to clean pores and reduce pimples and blackheads.\nZinc PCA to control sebum production.\nHyaluronic Acid to hydrate skin and prevent dryness.\nAllantoin to soothe skin and reduce redness.\nWith gentle cleansers like Decyl Glucoside for effective cleaning without stripping skin moisture."; p.BenefitsEn = "Deeply cleanses the skin without drying it out.\nHelps reduce pimples and blackheads.\nBalances sebum production and reduces shine.\nProvides hydration and freshness that lasts all day.\nSoothes the skin leaving it softer and clearer.\nSuitable for daily use morning and evening."; p.HowToUseEn = "Use the cleanser daily morning and evening on wet skin, massage gently in circular motions then rinse thoroughly with lukewarm water."; }

        p = _db.Products.FirstOrDefault(p => p.Category == "toners");
        if (p != null) { p.NameEn = "Cica toner"; p.TaglineEn = "Because healthy skin starts with the right balance."; p.BadgeEn = "28% Off"; p.SkinTypeEn = "Oily, Combination, and Acne-prone Skin"; p.DescriptionEn = "Give your skin the freshness and care it deserves with Velora Care toner, designed to be more than just a toner... but a daily step that restores your skin's balance, hydration, and natural freshness.\n\nIts advanced formula combines effective ingredients that work together to gently clean the skin from impurities and excess oils, while preserving the natural skin barrier without causing dryness.\n\nResult? Clearer, more balanced skin, with a soft texture, and a healthy radiant look from the first use."; p.IngredientsEn = "Niacinamide: to even skin tone and support skin barrier.\nSalicylic Acid: to clean pores and reduce blackheads and pimples.\nCentella Asiatica Extract: to soothe skin and reduce redness.\nHyaluronic Acid: for deep hydration giving skin a plump and fresh look.\nTea Tree Oil: to help resist acne-causing bacteria.\nZinc PCA: to control sebum and reduce shine.\nAllantoin: to soothe skin and provide softness and comfort."; p.BenefitsEn = "Deeply cleans pores and reduces oil buildup thanks to Salicylic Acid.\nHelps soothe skin and reduce redness thanks to Centella Asiatica and Allantoin.\nProvides lasting hydration thanks to Hyaluronic Acid and Betaine.\nSupports even skin tone and gives it a healthy glow with Niacinamide.\nHelps reduce pore appearance and control shine.\nContributes to reducing breakouts thanks to Tea Tree Oil and Zinc PCA.\nPreps the skin to absorb serums and creams better, for the best routine results."; p.HowToUseEn = "After cleansing, apply an appropriate amount of toner on a clean cotton pad and gently wipe your face and neck, then wait for it to dry before applying serum and moisturizer. Use daily morning and evening."; }

        p = _db.Products.FirstOrDefault(p => p.Category == "serums");
        if (p != null) { p.NameEn = "Hydro Glow serum"; p.TaglineEn = "Deep hydration and filler-like shine for soft and radiant skin 🤍"; p.BadgeEn = "26% Off"; p.SkinTypeEn = "All Skin Types"; p.DescriptionEn = "Hydro Glow serum combines the deepest skin moisturizers with the strongest radiance ingredients in one formula, giving you plump, soft, and radiant skin with a healthy look.\n\nHyaluronic Acid provides deep hydration and a filler-like plumpness, while Niacinamide improves skin texture and tightens pores. Alpha Arbutin lightens dark spots and evens skin tone, and Vitamin E acts as a powerful antioxidant protecting the skin from free radicals.\n\nWith regular use, you will get long-lasting hydration, and soft, radiant, healthy-looking skin from the first week."; p.IngredientsEn = "Hyaluronic Acid: Deep hydration and filler-like plumpness with a healthy shine.\nNiacinamide: Finer pores and smoother skin texture.\nAlpha Arbutin: Lightens dark spots and evens skin tone.\nVitamin E: Powerful antioxidant protecting the skin from free radicals."; p.BenefitsEn = "Provides deep hydration and filler-like plumpness.\nImproves skin texture and minimizes pore appearance.\nLightens dark spots and evens skin tone.\nProtects skin from oxidation and free radicals.\nLeaves skin soft, radiant, and healthy all day."; p.HowToUseEn = "Apply 3-4 drops morning and evening on clean skin before moisturizer, massage gently in circular motions until fully absorbed."; }

        p = _db.Products.FirstOrDefault(p => p.Name == "Velora Bloom");
        if (p != null) { p.NameEn = "Velora Bloom"; p.TaglineEn = "Fresh and airy notes with a clean and elegant finish ✨"; p.BadgeEn = "17% Off"; p.SkinTypeEn = "All Skin Types"; p.DescriptionEn = "A light body splash with fresh and airy notes ending with a clean and elegant finish.\n\nLight, refreshing, and effortlessly attractive — the perfect daily fragrance for a luxurious and soft feeling worthy of you at every moment.\n\nIts formula is light and safe on the skin for daily use, giving you confidence and refined femininity from the first spray."; p.IngredientsEn = "Fresh and airy notes.\nClean and elegant finish.\nLight and skin-safe formula for daily use.\nFragrance notes lasting up to 12 hours."; p.BenefitsEn = "Long-lasting scent with strong and clear projection.\nUnique and elegant blend for a refined feminine experience.\nLight and safe on the skin for daily use.\nFreshness, softness, and confidence for up to 12 hours."; p.HowToUseEn = "Spray the body splash on pulse points (neck, wrists, behind the ears) from a 15 cm distance, or all over the body after showering for all-day freshness."; }

        p = _db.Products.FirstOrDefault(p => p.Name == "Velora Velvet");
        if (p != null) { p.NameEn = "Velora Velvet"; p.TaglineEn = "Warm vanilla with a soft and attractive touch worthy of you every day 🤍"; p.BadgeEn = "17% Off"; p.SkinTypeEn = "All Skin Types"; p.DescriptionEn = "A warm vanilla fragrance with a soft, creamy, addictive, effortlessly feminine sensual touch.\n\nA signature scent that gives you an unforgettable feeling of elegance, warmth, and comfort.\n\nLight and skin-safe formula, suitable for daily use and gives you a feeling of luxury and confidence all day long."; p.IngredientsEn = "Warm vanilla with a soft sensual touch.\nAttractive and feminine creamy texture.\nLight and skin-safe formula for daily use.\nFragrance notes lasting up to 12 hours."; p.BenefitsEn = "Long-lasting scent with strong and clear projection.\nUnique and elegant blend for a refined feminine experience.\nLight and safe on the skin for daily use.\nFreshness, softness, and confidence for up to 12 hours."; p.HowToUseEn = "Spray the body splash on pulse points (neck, wrists, behind the ears) from a 15 cm distance, or all over the body after showering for all-day freshness."; }

        p = _db.Products.FirstOrDefault(p => p.Category == "bundles");
        if (p != null) { p.NameEn = "VELORA Bundle"; p.TaglineEn = "The complete care routine trio — Cleanser + Toner + Serum ✨"; p.BadgeEn = "21% Off"; p.SkinTypeEn = "All Skin Types"; p.DescriptionEn = "The VELORA Bundle brings you the perfect skin routine trio in one economical package:\n\n• Purifying Cleanser — deep cleansing without drying\n• Cica toner — balancing, hydrating, and prepping the skin\n• Hydro Glow serum — deep hydration and filler-like radiance\n\nBuy all three together at the special bundle price, save, and start a complete routine for clean, balanced, and radiant skin ✨"; p.IngredientsEn = "Purifying Cleanser (150ml).\nCica toner (200ml).\nHydro Glow serum (30ml)."; p.BenefitsEn = "A complete care routine in one package at a special price.\nDeep cleansing, balance, hydration, and radiance together.\nSavings compared to buying each product separately.\nClean, balanced, and radiant skin from the first week."; p.HowToUseEn = "Start with the cleanser on wet skin morning and evening, then wipe the toner on a cotton pad, and finish with a few drops of serum before moisturizer."; }

        var h1 = _db.HeroSlides.FirstOrDefault(s => s.DisplayOrder == 0);
        if (h1 != null) { h1.BadgeEn = "Special Bundle Offer 🎁"; h1.TitleHighlightEn = "Complete Routine"; h1.TitleRestEn = "at a special price"; h1.DescriptionEn = "The complete VELORA trio — cleanser, toner, and serum in one economical bundle with up to 21% off."; h1.ProductTitleEn = "VELORA Bundle"; h1.ProductSubEn = "Cleanser + Toner + Serum"; h1.MiniCardTitleEn = "Hydro Glow serum"; h1.MiniCardOfferEn = "26% Off Today"; }
        var h2 = _db.HeroSlides.FirstOrDefault(s => s.DisplayOrder == 1);
        if (h2 != null) { h2.BadgeEn = "Filler-like Hydration ✨"; h2.TitleHighlightEn = "Radiance"; h2.TitleRestEn = "and instant softness"; h2.DescriptionEn = "Hyaluronic and radiance serum — deep hydration, finer pores, and amazing skin tone evening with Niacinamide and Alpha Arbutin."; h2.ProductTitleEn = "Hydro Glow serum"; h2.ProductSubEn = "Deep hydration and radiance"; h2.MiniCardTitleEn = "Cica toner"; h2.MiniCardOfferEn = "28% Off Today"; }
        var h3 = _db.HeroSlides.FirstOrDefault(s => s.DisplayOrder == 2);
        if (h3 != null) { h3.BadgeEn = "Balance & Hydration 💦"; h3.TitleHighlightEn = "Skin"; h3.TitleRestEn = "balanced and fresh"; h3.DescriptionEn = "Cica toner balances, soothes, and preps your skin to absorb serums and creams — the secret to a healthy routine thanks to Centella Asiatica."; h3.ProductTitleEn = "Cica toner"; h3.ProductSubEn = "Balance, hydration and freshness"; h3.MiniCardTitleEn = "Purifying Cleanser"; h3.MiniCardOfferEn = "30% Off Today"; }

        await _db.SaveChangesAsync();
        return Ok(new { message = "Seeded successfully" });
    }
}
