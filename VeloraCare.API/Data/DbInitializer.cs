using VeloraCare.API.Models;

namespace VeloraCare.API.Data;

public static class DbInitializer
{
    public static void Initialize(VeloraDbContext context)
    {
        // ALWAYS seed default Admin user if missing
        if (!context.Users.Any(u => u.Email == "admin@velora.com"))
        {
            context.Users.Add(new User
            {
                FullName = "مدير نظام VELORA",
                Email = "admin@velora.com",
                PasswordHash = "Admin123!",
                Role = "Admin"
            });
            context.SaveChanges();
        }

        // Seed Purifying Cleanser category if missing
        if (!context.Categories.Any(c => c.Code == "cleansers"))
        {
            context.Categories.Add(new Category
            {
                Code = "cleansers",
                Name = "منظفات وتنظيف البشرة",
                NameEn = "Cleansers & Purifiers",
                Icon = "💧",
                Description = "غسولات ومنظفات لطيفة تنظف البشرة بعمق دون تجريدها من رطوبتها",
                DescriptionEn = "Gentle cleansers and purifiers that deeply clean the skin without stripping its moisture"
            });
            context.SaveChanges();
        }

        // Seed Toners category if missing
        if (!context.Categories.Any(c => c.Code == "toners"))
        {
            context.Categories.Add(new Category
            {
                Code = "toners",
                Name = "تونرات التوازن والنضارة",
                NameEn = "Toners & Balance",
                Icon = "💦",
                Description = "تونرات تعيد للبشرة توازنها وترطيبها وتهيئها لامتصاص باقي خطوات العناية",
                DescriptionEn = "Toners that restore skin balance, hydrate, and prep it to absorb the rest of the care steps"
            });
            context.SaveChanges();
        }

        // Seed Serums category if missing
        if (!context.Categories.Any(c => c.Code == "serums"))
        {
            context.Categories.Add(new Category
            {
                Code = "serums",
                Name = "سيروم وإكسير النضارة",
                NameEn = "Serums & Elixirs",
                Icon = "✨",
                Description = "تركيزات فعالة تعالج البشرة وتمنحها الإشراقة والترطيب العميق",
                DescriptionEn = "Effective concentrations that treat the skin, providing radiance and deep hydration"
            });
            context.SaveChanges();
        }

        // Seed Body Splash category if missing
        if (!context.Categories.Any(c => c.Code == "body"))
        {
            context.Categories.Add(new Category
            {
                Code = "body",
                Name = "بخاخات الجسم والعطور",
                NameEn = "Body Splash & Fragrances",
                Icon = "🌸",
                Description = "بادي سبلاش خفيف بروائح فاخرة تدوم حتى 12 ساعة للاستخدام اليومي",
                DescriptionEn = "Light body splash with luxurious scents that last up to 12 hours for daily use"
            });
            context.SaveChanges();
        }

        // Seed Bundles category if missing
        if (!context.Categories.Any(c => c.Code == "bundles"))
        {
            context.Categories.Add(new Category
            {
                Code = "bundles",
                Name = "باندلات وعروض",
                NameEn = "Bundles & Offers",
                Icon = "🎁",
                Description = "باقات مجموعة من منتجات VELORA بسعر مميز",
                DescriptionEn = "Collection packages of VELORA products at a special price"
            });
            context.SaveChanges();
        }

        // Seed Purifying Cleanser product if missing (rename legacy name if present)
        var legacyCleanser = context.Products.FirstOrDefault(p => p.Name == "Velora Care Purifying Cleanser");
        if (legacyCleanser != null)
        {
            legacyCleanser.Name = "غسول للبشره الدهنيه والمختلطه";
            context.SaveChanges();
        }

        if (!context.Products.Any(p => p.Name == "غسول للبشره الدهنيه والمختلطه"))
        {
            context.Products.Add(new Product
            {
                Name = "غسول للبشره الدهنيه والمختلطه",
                NameEn = "Purifying Cleanser",
                Tagline = "بشرة نظيفة، متوازنة، ومشرقة... تبدأ من أول غسلة. ✨",
                TaglineEn = "Clean, balanced, and radiant skin... starts from the first wash. ✨",
                Description = "امنحي بشرتك العناية التي تستحقها مع Velora Care Purifying Cleanser، غسول يومي يجمع بين التنظيف العميق والعناية الفعالة دون أن يسبب جفافًا أو إحساسًا بالشد.\n\nتركيبته الذكية تعمل على إزالة الأوساخ، الزيوت الزائدة، بقايا المكياج وواقي الشمس، مع المساعدة على تنظيف المسام وتقليل مظهر الرؤوس السوداء والحبوب، ليترك بشرتك ناعمة، منتعشة وأكثر صفاءً بعد كل استخدام.\n\nبفضل احتوائه على Niacinamide وSalicylic Acid وZinc PCA، يساعد الغسول على التحكم في لمعان البشرة، تحسين مظهر المسام، ودعم توحيد لون البشرة. كما يعزز Hyaluronic Acid وAllantoin ترطيب البشرة وتهدئتها، لتحصلي على تنظيف عميق دون فقدان رطوبتها الطبيعية.",
                DescriptionEn = "Give your skin the care it deserves with Velora Care Purifying Cleanser, a daily cleanser that combines deep cleansing with effective care without causing dryness or tightness.\n\nIts smart formula works to remove dirt, excess oils, makeup residue, and sunscreen, while helping to clean pores and reduce the appearance of blackheads and pimples, leaving your skin soft, refreshed, and clearer after every use.\n\nThanks to Niacinamide, Salicylic Acid, and Zinc PCA, the cleanser helps control skin shine, improve pore appearance, and support skin tone evening. Hyaluronic Acid and Allantoin also boost skin hydration and soothing, for a deep clean without losing natural moisture.",
                Price = 250m,
                OriginalPrice = 360m,
                Category = "cleansers",
                Image = "/images/cleanser.jpg",
                Badge = "خصم 30%",
                BadgeEn = "30% Off",
                Rating = 5.0,
                ReviewsCount = 12,
                Stock = 60,
                Ingredients = "Niacinamide لتوحيد اللون وتقليل مظهر المسام.\nSalicylic Acid لتنظيف المسام وتقليل الحبوب والرؤوس السوداء.\nZinc PCA للتحكم في إفراز الدهون.\nHyaluronic Acid لترطيب البشرة ومنع الجفاف.\nAllantoin لتهدئة البشرة وتقليل الاحمرار.\nمع منظفات لطيفة مثل Decyl Glucoside لتنظيف فعال بدون تجريد البشرة من رطوبتها.",
                IngredientsEn = "Niacinamide to even skin tone and reduce pore appearance.\nSalicylic Acid to clean pores and reduce pimples and blackheads.\nZinc PCA to control sebum production.\nHyaluronic Acid to hydrate skin and prevent dryness.\nAllantoin to soothe skin and reduce redness.\nWith gentle cleansers like Decyl Glucoside for effective cleaning without stripping skin moisture.",
                Benefits = "ينظف البشرة بعمق دون تجفيفها.\nيساعد على تقليل الحبوب والرؤوس السوداء.\nيوازن إفراز الدهون ويقلل اللمعان.\nيمنح البشرة ترطيبًا وانتعاشًا يدومان طوال اليوم.\nيهدئ البشرة ويتركها أكثر نعومة ونقاءً.\nمناسب للاستخدام اليومي صباحًا ومساءً.",
                BenefitsEn = "Deeply cleanses the skin without drying it out.\nHelps reduce pimples and blackheads.\nBalances sebum production and reduces shine.\nProvides hydration and freshness that lasts all day.\nSoothes the skin leaving it softer and clearer.\nSuitable for daily use morning and evening.",
                HowToUse = "استخدمي الغسول يوميًا صباحًا ومساءً على بشرة مبللة، دلكي بلطف بحركات دائرية ثم اشطفي جيدًا بالماء الفاتر.",
                HowToUseEn = "Use the cleanser daily morning and evening on wet skin, massage gently in circular motions then rinse thoroughly with lukewarm water.",
                Volume = "150ml",
                SkinType = "جميع أنواع البشرة",
                SkinTypeEn = "All Skin Types"
            });
            context.SaveChanges();
        }

        // Seed Purifying & Hydrating Toner product if missing (rename legacy name if present)
        var legacyToner = context.Products.FirstOrDefault(p => p.Name == "Velora Care Purifying & Hydrating Toner");
        if (legacyToner != null)
        {
            legacyToner.Name = "Cica toner";
            context.SaveChanges();
        }

        if (!context.Products.Any(p => p.Name == "Cica toner"))
        {
            context.Products.Add(new Product
            {
                Name = "Cica toner",
                NameEn = "Cica toner",
                Tagline = "Because healthy skin starts with the right balance.",
                TaglineEn = "Because healthy skin starts with the right balance.",
                Description = "امنحي بشرتك الانتعاش والعناية التي تستحقها مع تونر Velora Care المصمم ليكون أكثر من مجرد تونر... بل خطوة يومية تعيد لبشرتك توازنها، ترطيبها، ونضارتها الطبيعية.\n\nتركيبته المتطورة تجمع بين مكونات فعالة تعمل معًا لتنظيف البشرة بلطف من بقايا الشوائب والدهون، مع الحفاظ على حاجز البشرة الطبيعي دون التسبب في الجفاف.\n\nالنتيجة؟ بشرة أنقى، أكثر توازنًا، بملمس ناعم، ومظهر صحي ومشرق من أول استخدام، ومع الاستمرار ستلاحظين مسامًا أنعم، ودهونًا أقل، وبشرة أكثر صفاءً واستعدادًا لاستقبال باقي خطوات العناية.",
                DescriptionEn = "Give your skin the freshness and care it deserves with Velora Care toner, designed to be more than just a toner... but a daily step that restores your skin's balance, hydration, and natural freshness.\n\nIts advanced formula combines effective ingredients that work together to gently clean the skin from impurities and excess oils, while preserving the natural skin barrier without causing dryness.\n\nResult? Clearer, more balanced skin, with a soft texture, and a healthy radiant look from the first use.",
                Price = 250m,
                OriginalPrice = 350m,
                Category = "toners",
                Image = "/images/toner.png",
                Badge = "خصم 28%",
                BadgeEn = "28% Off",
                Rating = 5.0,
                ReviewsCount = 8,
                Stock = 50,
                Ingredients = "Niacinamide: لتوحيد اللون ودعم حاجز البشرة.\nSalicylic Acid: لتنظيف المسام وتقليل الرؤوس السوداء والحبوب.\nCentella Asiatica Extract: لتهدئة البشرة وتقليل الاحمرار.\nHyaluronic Acid: لترطيب عميق يمنح البشرة مظهرًا ممتلئًا ونضرًا.\nTea Tree Oil: للمساعدة في مقاومة البكتيريا المسببة للحبوب.\nZinc PCA: للتحكم في إفراز الدهون وتقليل اللمعان.\nAllantoin: لتهدئة البشرة ومنحها نعومة وراحة.",
                IngredientsEn = "Niacinamide: to even skin tone and support skin barrier.\nSalicylic Acid: to clean pores and reduce blackheads and pimples.\nCentella Asiatica Extract: to soothe skin and reduce redness.\nHyaluronic Acid: for deep hydration giving skin a plump and fresh look.\nTea Tree Oil: to help resist acne-causing bacteria.\nZinc PCA: to control sebum and reduce shine.\nAllantoin: to soothe skin and provide softness and comfort.",
                Benefits = "ينظف المسام بعمق ويقلل تراكم الزيوت بفضل Salicylic Acid.\nيساعد على تهدئة البشرة وتقليل الاحمرار بفضل Centella Asiatica وAllantoin.\nيمنح البشرة ترطيبًا يدوم بفضل Hyaluronic Acid وBetaine.\nيدعم توحيد لون البشرة ويمنحها إشراقة صحية مع Niacinamide.\nيساعد على تقليل مظهر المسام والتحكم في اللمعان.\nيساهم في الحد من ظهور الحبوب بفضل Tea Tree Oil وZinc PCA.\nيهيئ البشرة لامتصاص السيروم والكريمات بشكل أفضل، ليحقق روتين العناية أفضل نتائجه.",
                BenefitsEn = "Deeply cleans pores and reduces oil buildup thanks to Salicylic Acid.\nHelps soothe skin and reduce redness thanks to Centella Asiatica and Allantoin.\nProvides lasting hydration thanks to Hyaluronic Acid and Betaine.\nSupports even skin tone and gives it a healthy glow with Niacinamide.\nHelps reduce pore appearance and control shine.\nContributes to reducing breakouts thanks to Tea Tree Oil and Zinc PCA.\nPreps the skin to absorb serums and creams better, for the best routine results.",
                HowToUse = "بعد تنظيف البشرة، ضعي كمية مناسبة من التونر على قطنة نظيفة وامسحي بها وجهك وعنقك بلطف، ثم انتظري حتى يجف قبل تطبيق السيروم والمرطب. استخدميه يوميًا صباحًا ومساءً.",
                HowToUseEn = "After cleansing, apply an appropriate amount of toner on a clean cotton pad and gently wipe your face and neck, then wait for it to dry before applying serum and moisturizer. Use daily morning and evening.",
                Volume = "200ml",
                SkinType = "البشرة الدهنية والمختلطة والمعرضة للحبوب",
                SkinTypeEn = "Oily, Combination, and Acne-prone Skin"
            });
            context.SaveChanges();
        }

        // Seed Hydro Glow Serum product if missing
        if (!context.Products.Any(p => p.Name == "Hydro Glow serum"))
        {
            context.Products.Add(new Product
            {
                Name = "Hydro Glow serum",
                NameEn = "Hydro Glow serum",
                Tagline = "ترطيب عميق ولمعان يشبه الفيلر لبشرة ناعمة ومشرقة 🤍",
                TaglineEn = "Deep hydration and filler-like shine for soft and radiant skin 🤍",
                Description = "سيروم Hydro Glow يجمع بين أعمق مرطبات البشرة وأقوى مكونات الإشراقة في تركيبة واحدة، ليمنحكِ بشرة ممتلئة، ناعمة، ومشرقة بمظهر صحي.\n\nحمض الهيالورونيك يمنح ترطيبًا عميقًا وامتلاءً يشبه الفيلر، بينما يعمل Niacinamide على تحسين ملمس البشرة وشد المسام، بينما يفتح Alpha Arbutin البقع الداكنة ويوحد لون البشرة، ويعمل فيتامين E كمضاد قوي للأكسدة يحمي البشرة من الشوارد الحرة.\n\nمع الاستخدام المنتظم ستحصلين على ترطيب يدوم طويلاً، وبشرة ناعمة، مشرقة، وصحية المظهر من أول أسبوع.",
                DescriptionEn = "Hydro Glow serum combines the deepest skin moisturizers with the strongest radiance ingredients in one formula, giving you plump, soft, and radiant skin with a healthy look.\n\nHyaluronic Acid provides deep hydration and a filler-like plumpness, while Niacinamide improves skin texture and tightens pores. Alpha Arbutin lightens dark spots and evens skin tone, and Vitamin E acts as a powerful antioxidant protecting the skin from free radicals.\n\nWith regular use, you will get long-lasting hydration, and soft, radiant, healthy-looking skin from the first week.",
                Price = 330m,
                OriginalPrice = 450m,
                Category = "serums",
                Image = "/images/hydro_glow.png",
                Badge = "خصم 26%",
                BadgeEn = "26% Off",
                Rating = 5.0,
                ReviewsCount = 15,
                Stock = 45,
                Ingredients = "Hyaluronic Acid: ترطيب عميق وامتلاء بمظهر الفيلر ولمعان صحي.\nNiacinamide: مسام أدق وملمس بشرة أكثر نعومة.\nAlpha Arbutin: يفتح البقع الداكنة ويوحد لون البشرة.\nVitamin E: مضاد قوي للأكسدة يحمي البشرة من الشوارد الحرة.",
                IngredientsEn = "Hyaluronic Acid: Deep hydration and filler-like plumpness with a healthy shine.\nNiacinamide: Finer pores and smoother skin texture.\nAlpha Arbutin: Lightens dark spots and evens skin tone.\nVitamin E: Powerful antioxidant protecting the skin from free radicals.",
                Benefits = "يمنح ترطيبًا عميقًا وامتلاءً يشبه الفيلر.\nيحسّن ملمس البشرة ويدق مظهر المسام.\nيفتح البقع الداكنة ويوحد لون البشرة.\nيحمي البشرة من الأكسدة والشوارد الحرة.\nيترك البشرة ناعمة، مشرقة، وصحية طوال اليوم.",
                BenefitsEn = "Provides deep hydration and filler-like plumpness.\nImproves skin texture and minimizes pore appearance.\nLightens dark spots and evens skin tone.\nProtects skin from oxidation and free radicals.\nLeaves skin soft, radiant, and healthy all day.",
                HowToUse = "ضعي 3-4 قطرات صباحًا ومساءً على بشرة نظيفة قبل المرطب، ودلكي بلطف بحركات دائرية حتى الامتصاص الكامل.",
                HowToUseEn = "Apply 3-4 drops morning and evening on clean skin before moisturizer, massage gently in circular motions until fully absorbed.",
                Volume = "30ml",
                SkinType = "جميع أنواع البشرة",
                SkinTypeEn = "All Skin Types"
            });
            context.SaveChanges();
        }

        // Seed Velora Bloom body splash if missing
        if (!context.Products.Any(p => p.Name == "Velora Bloom"))
        {
            context.Products.Add(new Product
            {
                Name = "Velora Bloom",
                NameEn = "Velora Bloom",
                Tagline = "نفحات منعشة وهوائية بلمسة نهائية نظيفة وأنيقة ✨",
                TaglineEn = "Fresh and airy notes with a clean and elegant finish ✨",
                Description = "بادي سبلاش خفيف بنفحات منعشة وهوائية تنتهي بلمسة نظيفة وأنيقة.\n\nخفيف، منعش، وجذاب بلا مجهود — العطر اليومي المثالي لإحساس فاخر وناعم يليق بكِ في كل لحظة.\n\nتركيبته خفيفة وآمنة على البشرة للاستخدام اليومي، تمنحكِ ثقة وأنوثة راقية من أول رشة.",
                DescriptionEn = "A light body splash with fresh and airy notes ending with a clean and elegant finish.\n\nLight, refreshing, and effortlessly attractive — the perfect daily fragrance for a luxurious and soft feeling worthy of you at every moment.\n\nIts formula is light and safe on the skin for daily use, giving you confidence and refined femininity from the first spray.",
                Price = 350m,
                OriginalPrice = 420m,
                Category = "body",
                Image = "/images/bloom.png",
                Badge = "خصم 17%",
                BadgeEn = "17% Off",
                Rating = 5.0,
                ReviewsCount = 9,
                Stock = 40,
                Ingredients = "نفحات منعشة وهوائية.\nلمسة نهائية نظيفة وأنيقة.\nتركيبة خفيفة وآمنة على البشرة للاستخدام اليومي.\nنفحات عطر تدوم حتى 12 ساعة.",
                IngredientsEn = "Fresh and airy notes.\nClean and elegant finish.\nLight and skin-safe formula for daily use.\nFragrance notes lasting up to 12 hours.",
                Benefits = "رائحة تدوم طويلاً بفوحان قوي وواضح.\nتوليفة فريدة أنيقة لتجربة أنثوية راقية.\nخفيف وآمن على البشرة للاستخدام اليومي.\nانتعاش ونعومة وثقة حتى 12 ساعة.",
                BenefitsEn = "Long-lasting scent with strong and clear projection.\nUnique and elegant blend for a refined feminine experience.\nLight and safe on the skin for daily use.\nFreshness, softness, and confidence for up to 12 hours.",
                HowToUse = "رشي البادي سبلاش على مناطق النبض (الرقبة، الرسغين، وخلف الأذنين) من مسافة 15 سم، أو على الجسم بالكامل بعد الاستحمام لانتعاش يدوم طوال اليوم.",
                HowToUseEn = "Spray the body splash on pulse points (neck, wrists, behind the ears) from a 15 cm distance, or all over the body after showering for all-day freshness.",
                Volume = "200ml",
                SkinType = "جميع أنواع البشرة",
                SkinTypeEn = "All Skin Types"
            });
            context.SaveChanges();
        }

        // Seed Velora Velvet body splash if missing
        if (!context.Products.Any(p => p.Name == "Velora Velvet"))
        {
            context.Products.Add(new Product
            {
                Name = "Velora Velvet",
                NameEn = "Velora Velvet",
                Tagline = "فانيليا دافئة بلمسة ناعمة وجذابة تليق بكِ كل يوم 🤍",
                TaglineEn = "Warm vanilla with a soft and attractive touch worthy of you every day 🤍",
                Description = "عطر فانيليا دافئ بملمس حسي ناعم، كريمي ويسبب الإدمان، أنثوي بلا مجهود.\n\nعطر توقيع مميز يمنحكِ إحساسًا بالأناقة والدفء والراحة لا يُنسى.\n\nتركيبة خفيفة وآمنة على البشرة، تناسب الاستخدام اليومي وتمنحكِ إحساسًا بالفخامة والثقة طوال اليوم.",
                DescriptionEn = "A warm vanilla fragrance with a soft, creamy, addictive, effortlessly feminine sensual touch.\n\nA signature scent that gives you an unforgettable feeling of elegance, warmth, and comfort.\n\nLight and skin-safe formula, suitable for daily use and gives you a feeling of luxury and confidence all day long.",
                Price = 350m,
                OriginalPrice = 420m,
                Category = "body",
                Image = "/images/velvet.png",
                Badge = "خصم 17%",
                BadgeEn = "17% Off",
                Rating = 5.0,
                ReviewsCount = 11,
                Stock = 40,
                Ingredients = "فانيليا دافئة بلمسة حسية ناعمة.\nقوام كريمي جذاب وأنثوي.\nتركيبة خفيفة وآمنة على البشرة للاستخدام اليومي.\nنفحات عطر تدوم حتى 12 ساعة.",
                IngredientsEn = "Warm vanilla with a soft sensual touch.\nAttractive and feminine creamy texture.\nLight and skin-safe formula for daily use.\nFragrance notes lasting up to 12 hours.",
                Benefits = "رائحة تدوم طويلاً بفوحان قوي وواضح.\nتوليفة فريدة أنيقة لتجربة أنثوية راقية.\nخفيف وآمن على البشرة للاستخدام اليومي.\nانتعاش ونعومة وثقة حتى 12 ساعة.",
                BenefitsEn = "Long-lasting scent with strong and clear projection.\nUnique and elegant blend for a refined feminine experience.\nLight and safe on the skin for daily use.\nFreshness, softness, and confidence for up to 12 hours.",
                HowToUse = "رشي البادي سبلاش على مناطق النبض (الرقبة، الرسغين، وخلف الأذنين) من مسافة 15 سم، أو على الجسم بالكامل بعد الاستحمام لانتعاش يدوم طوال اليوم.",
                HowToUseEn = "Spray the body splash on pulse points (neck, wrists, behind the ears) from a 15 cm distance, or all over the body after showering for all-day freshness.",
                Volume = "200ml",
                SkinType = "جميع أنواع البشرة",
                SkinTypeEn = "All Skin Types"
            });
            context.SaveChanges();
        }

        // Seed VELORA Bundle product if missing
        if (!context.Products.Any(p => p.Name == "باندل VELORA"))
        {
            context.Products.Add(new Product
            {
                Name = "باندل VELORA",
                NameEn = "VELORA Bundle",
                Tagline = "ثلاثي روتين العناية الكامل — غسول + تونر + سيروم ✨",
                TaglineEn = "The complete care routine trio — Cleanser + Toner + Serum ✨",
                Description = "باندل VELORA يجمع لكِ ثلاثي روتين البشرة المثالي في باقة واحدة اقتصادية:\n\n• غسول للبشره الدهنيه والمختلطه — تنظيف عميق دون تجفيف\n• Cica toner — توازن وترطيب وتهيئة البشرة\n• Hydro Glow serum — ترطيب عميق وإشراقة تشبه الفيلر\n\nاشتري الثلاثة معًا بسعر الباندل المميز، ووفّري وابدئي روتينًا كاملاً لبشرة نظيفة، متوازنة، ومشرقة ✨",
                DescriptionEn = "The VELORA Bundle brings you the perfect skin routine trio in one economical package:\n\n• Purifying Cleanser — deep cleansing without drying\n• Cica toner — balancing, hydrating, and prepping the skin\n• Hydro Glow serum — deep hydration and filler-like radiance\n\nBuy all three together at the special bundle price, save, and start a complete routine for clean, balanced, and radiant skin ✨",
                Price = 830m,
                OriginalPrice = 1050m,
                Category = "bundles",
                Image = "/images/bundle.jpg",
                Badge = "خصم 21%",
                BadgeEn = "21% Off",
                Rating = 5.0,
                ReviewsCount = 6,
                Stock = 25,
                Ingredients = "غسول للبشره الدهنيه والمختلطه (150ml).\nCica toner (200ml).\nHydro Glow serum (30ml).",
                IngredientsEn = "Purifying Cleanser (150ml).\nCica toner (200ml).\nHydro Glow serum (30ml).",
                Benefits = "روتين عناية كامل في باقة واحدة بسعر مميز.\nتنظيف عميق وتوازن وترطيب وإشراقة معًا.\nتوفر مقابل شراء كل منتج على حدة.\nبشرة نظيفة، متوازنة، ومشرقة من أول أسبوع.",
                BenefitsEn = "A complete care routine in one package at a special price.\nDeep cleansing, balance, hydration, and radiance together.\nSavings compared to buying each product separately.\nClean, balanced, and radiant skin from the first week.",
                HowToUse = "ابدئي بالغسول على بشرة مبللة صباحًا ومساءً، ثم مرري التونر على قطنة، وانتهي ببضع قطرات من السيروم قبل المرطب.",
                HowToUseEn = "Start with the cleanser on wet skin morning and evening, then wipe the toner on a cotton pad, and finish with a few drops of serum before moisturizer.",
                Volume = "3 قطع",
                SkinType = "جميع أنواع البشرة",
                SkinTypeEn = "All Skin Types"
            });
            context.SaveChanges();
        }

        // Seed Hero slides with new product images if empty
        if (!context.HeroSlides.Any())
        {
            context.HeroSlides.AddRange(
                new HeroSlide
                {
                    Badge = "عرض الباندل المميز 🎁",
                    BadgeEn = "Special Bundle Offer 🎁",
                    TitleHighlight = "روتين كامل",
                    TitleHighlightEn = "Complete Routine",
                    TitleRest = "بسعر مميز",
                    TitleRestEn = "at a special price",
                    Description = "ثلاثي VELORA الكامل — غسول، تونر، وسيروم في باقة واحدة اقتصادية مع خصم يصل إلى 21%.",
                    DescriptionEn = "The complete VELORA trio — cleanser, toner, and serum in one economical bundle with up to 21% off.",
                    ProductImage = "/images/bundle.jpg",
                    ProductTitle = "باندل VELORA",
                    ProductTitleEn = "VELORA Bundle",
                    ProductSub = "غسول + تونر + سيروم",
                    ProductSubEn = "Cleanser + Toner + Serum",
                    Rating = 5.0,
                    MiniCardImage = "/images/hydro_glow.png",
                    MiniCardTitle = "Hydro Glow serum",
                    MiniCardTitleEn = "Hydro Glow serum",
                    MiniCardOffer = "خصم 26% اليوم",
                    MiniCardOfferEn = "26% Off Today",
                    Active = true,
                    DisplayOrder = 0
                },
                new HeroSlide
                {
                    Badge = "ترطيب يشبه الفيلر ✨",
                    BadgeEn = "Filler-like Hydration ✨",
                    TitleHighlight = "إشراقة",
                    TitleHighlightEn = "Radiance",
                    TitleRest = "ونعومة فورية",
                    TitleRestEn = "and instant softness",
                    Description = "سيروم الهيالورونيك والإشراقة — ترطيب عميق، مسام أدق، وتوحيد مذهل للون البشرة مع Niacinamide وAlpha Arbutin.",
                    DescriptionEn = "Hyaluronic and radiance serum — deep hydration, finer pores, and amazing skin tone evening with Niacinamide and Alpha Arbutin.",
                    ProductImage = "/images/hydro_glow.png",
                    ProductTitle = "Hydro Glow serum",
                    ProductTitleEn = "Hydro Glow serum",
                    ProductSub = "ترطيب عميق وإشراقة",
                    ProductSubEn = "Deep hydration and radiance",
                    Rating = 5.0,
                    MiniCardImage = "/images/toner.png",
                    MiniCardTitle = "Cica toner",
                    MiniCardTitleEn = "Cica toner",
                    MiniCardOffer = "خصم 28% اليوم",
                    MiniCardOfferEn = "28% Off Today",
                    Active = true,
                    DisplayOrder = 1
                },
                new HeroSlide
                {
                    Badge = "توازن وترطيب 💦",
                    BadgeEn = "Balance & Hydration 💦",
                    TitleHighlight = "بشرة",
                    TitleHighlightEn = "Skin",
                    TitleRest = "متوازنة ونضرة",
                    TitleRestEn = "balanced and fresh",
                    Description = "تونر Cica يوازن بشرتك ويهدئها ويهيئها لامتصاص السيروم والكريمات — سر الروتين الصحي بفضل Centella Asiatica.",
                    DescriptionEn = "Cica toner balances, soothes, and preps your skin to absorb serums and creams — the secret to a healthy routine thanks to Centella Asiatica.",
                    ProductImage = "/images/toner.png",
                    ProductTitle = "Cica toner",
                    ProductTitleEn = "Cica toner",
                    ProductSub = "توازن وترطيب ونضارة",
                    ProductSubEn = "Balance, hydration and freshness",
                    Rating = 5.0,
                    MiniCardImage = "/images/cleanser.jpg",
                    MiniCardTitle = "الغسول المنظف",
                    MiniCardTitleEn = "Purifying Cleanser",
                    MiniCardOffer = "خصم 30% اليوم",
                    MiniCardOfferEn = "30% Off Today",
                    Active = true,
                    DisplayOrder = 2
                }
            );
            context.SaveChanges();
        }
    }
}
