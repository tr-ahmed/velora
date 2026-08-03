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
                Icon = "💧",
                Description = "غسولات ومنظفات لطيفة تنظف البشرة بعمق دون تجريدها من رطوبتها"
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
                Icon = "💦",
                Description = "تونرات تعيد للبشرة توازنها وترطيبها وتهيئها لامتصاص باقي خطوات العناية"
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
                Icon = "✨",
                Description = "تركيزات فعالة تعالج البشرة وتمنحها الإشراقة والترطيب العميق"
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
                Icon = "🌸",
                Description = "بادي سبلاش خفيف بروائح فاخرة تدوم حتى 12 ساعة للاستخدام اليومي"
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
                Icon = "🎁",
                Description = "باقات مجموعة من منتجات VELORA بسعر مميز"
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
                Tagline = "بشرة نظيفة، متوازنة، ومشرقة... تبدأ من أول غسلة. ✨",
                Description = "امنحي بشرتك العناية التي تستحقها مع Velora Care Purifying Cleanser، غسول يومي يجمع بين التنظيف العميق والعناية الفعالة دون أن يسبب جفافًا أو إحساسًا بالشد.\n\nتركيبته الذكية تعمل على إزالة الأوساخ، الزيوت الزائدة، بقايا المكياج وواقي الشمس، مع المساعدة على تنظيف المسام وتقليل مظهر الرؤوس السوداء والحبوب، ليترك بشرتك ناعمة، منتعشة وأكثر صفاءً بعد كل استخدام.\n\nبفضل احتوائه على Niacinamide وSalicylic Acid وZinc PCA، يساعد الغسول على التحكم في لمعان البشرة، تحسين مظهر المسام، ودعم توحيد لون البشرة. كما يعزز Hyaluronic Acid وAllantoin ترطيب البشرة وتهدئتها، لتحصلي على تنظيف عميق دون فقدان رطوبتها الطبيعية.",
                Price = 250m,
                OriginalPrice = 360m,
                Category = "cleansers",
                Image = "/images/cleanser.jpg",
                Badge = "خصم 30%",
                Rating = 5.0,
                ReviewsCount = 12,
                Stock = 60,
                Ingredients = "Niacinamide لتوحيد اللون وتقليل مظهر المسام.\nSalicylic Acid لتنظيف المسام وتقليل الحبوب والرؤوس السوداء.\nZinc PCA للتحكم في إفراز الدهون.\nHyaluronic Acid لترطيب البشرة ومنع الجفاف.\nAllantoin لتهدئة البشرة وتقليل الاحمرار.\nمع منظفات لطيفة مثل Decyl Glucoside لتنظيف فعال بدون تجريد البشرة من رطوبتها.",
                Benefits = "ينظف البشرة بعمق دون تجفيفها.\nيساعد على تقليل الحبوب والرؤوس السوداء.\nيوازن إفراز الدهون ويقلل اللمعان.\nيمنح البشرة ترطيبًا وانتعاشًا يدومان طوال اليوم.\nيهدئ البشرة ويتركها أكثر نعومة ونقاءً.\nمناسب للاستخدام اليومي صباحًا ومساءً.",
                HowToUse = "استخدمي الغسول يوميًا صباحًا ومساءً على بشرة مبللة، دلكي بلطف بحركات دائرية ثم اشطفي جيدًا بالماء الفاتر.",
                Volume = "150ml",
                SkinType = "جميع أنواع البشرة"
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
                Tagline = "Because healthy skin starts with the right balance.",
                Description = "امنحي بشرتك الانتعاش والعناية التي تستحقها مع تونر Velora Care المصمم ليكون أكثر من مجرد تونر... بل خطوة يومية تعيد لبشرتك توازنها، ترطيبها، ونضارتها الطبيعية.\n\nتركيبته المتطورة تجمع بين مكونات فعالة تعمل معًا لتنظيف البشرة بلطف من بقايا الشوائب والدهون، مع الحفاظ على حاجز البشرة الطبيعي دون التسبب في الجفاف.\n\nالنتيجة؟ بشرة أنقى، أكثر توازنًا، بملمس ناعم، ومظهر صحي ومشرق من أول استخدام، ومع الاستمرار ستلاحظين مسامًا أنعم، ودهونًا أقل، وبشرة أكثر صفاءً واستعدادًا لاستقبال باقي خطوات العناية.",
                Price = 250m,
                OriginalPrice = 350m,
                Category = "toners",
                Image = "/images/toner.png",
                Badge = "خصم 28%",
                Rating = 5.0,
                ReviewsCount = 8,
                Stock = 50,
                Ingredients = "Niacinamide: لتوحيد اللون ودعم حاجز البشرة.\nSalicylic Acid: لتنظيف المسام وتقليل الرؤوس السوداء والحبوب.\nCentella Asiatica Extract: لتهدئة البشرة وتقليل الاحمرار.\nHyaluronic Acid: لترطيب عميق يمنح البشرة مظهرًا ممتلئًا ونضرًا.\nTea Tree Oil: للمساعدة في مقاومة البكتيريا المسببة للحبوب.\nZinc PCA: للتحكم في إفراز الدهون وتقليل اللمعان.\nAllantoin: لتهدئة البشرة ومنحها نعومة وراحة.",
                Benefits = "ينظف المسام بعمق ويقلل تراكم الزيوت بفضل Salicylic Acid.\nيساعد على تهدئة البشرة وتقليل الاحمرار بفضل Centella Asiatica وAllantoin.\nيمنح البشرة ترطيبًا يدوم بفضل Hyaluronic Acid وBetaine.\nيدعم توحيد لون البشرة ويمنحها إشراقة صحية مع Niacinamide.\nيساعد على تقليل مظهر المسام والتحكم في اللمعان.\nيساهم في الحد من ظهور الحبوب بفضل Tea Tree Oil وZinc PCA.\nيهيئ البشرة لامتصاص السيروم والكريمات بشكل أفضل، ليحقق روتين العناية أفضل نتائجه.",
                HowToUse = "بعد تنظيف البشرة، ضعي كمية مناسبة من التونر على قطنة نظيفة وامسحي بها وجهك وعنقك بلطف، ثم انتظري حتى يجف قبل تطبيق السيروم والمرطب. استخدميه يوميًا صباحًا ومساءً.",
                Volume = "200ml",
                SkinType = "البشرة الدهنية والمختلطة والمعرضة للحبوب"
            });
            context.SaveChanges();
        }

        // Seed Hydro Glow Serum product if missing
        if (!context.Products.Any(p => p.Name == "Hydro Glow serum"))
        {
            context.Products.Add(new Product
            {
                Name = "Hydro Glow serum",
                Tagline = "ترطيب عميق ولمعان يشبه الفيلر لبشرة ناعمة ومشرقة 🤍",
                Description = "سيروم Hydro Glow يجمع بين أعمق مرطبات البشرة وأقوى مكونات الإشراقة في تركيبة واحدة، ليمنحكِ بشرة ممتلئة، ناعمة، ومشرقة بمظهر صحي.\n\nحمض الهيالورونيك يمنح ترطيبًا عميقًا وامتلاءً يشبه الفيلر، بينما يعمل Niacinamide على تحسين ملمس البشرة وشد المسام، بينما يفتح Alpha Arbutin البقع الداكنة ويوحد لون البشرة، ويعمل فيتامين E كمضاد قوي للأكسدة يحمي البشرة من الشوارد الحرة.\n\nمع الاستخدام المنتظم ستحصلين على ترطيب يدوم طويلاً، وبشرة ناعمة، مشرقة، وصحية المظهر من أول أسبوع.",
                Price = 330m,
                OriginalPrice = 450m,
                Category = "serums",
                Image = "/images/hydro_glow.png",
                Badge = "خصم 26%",
                Rating = 5.0,
                ReviewsCount = 15,
                Stock = 45,
                Ingredients = "Hyaluronic Acid: ترطيب عميق وامتلاء بمظهر الفيلر ولمعان صحي.\nNiacinamide: مسام أدق وملمس بشرة أكثر نعومة.\nAlpha Arbutin: يفتح البقع الداكنة ويوحد لون البشرة.\nVitamin E: مضاد قوي للأكسدة يحمي البشرة من الشوارد الحرة.",
                Benefits = "يمنح ترطيبًا عميقًا وامتلاءً يشبه الفيلر.\nيحسّن ملمس البشرة ويدق مظهر المسام.\nيفتح البقع الداكنة ويوحد لون البشرة.\nيحمي البشرة من الأكسدة والشوارد الحرة.\nيترك البشرة ناعمة، مشرقة، وصحية طوال اليوم.",
                HowToUse = "ضعي 3-4 قطرات صباحًا ومساءً على بشرة نظيفة قبل المرطب، ودلكي بلطف بحركات دائرية حتى الامتصاص الكامل.",
                Volume = "30ml",
                SkinType = "جميع أنواع البشرة"
            });
            context.SaveChanges();
        }

        // Seed Velora Bloom body splash if missing
        if (!context.Products.Any(p => p.Name == "Velora Bloom"))
        {
            context.Products.Add(new Product
            {
                Name = "Velora Bloom",
                Tagline = "نفحات منعشة وهوائية بلمسة نهائية نظيفة وأنيقة ✨",
                Description = "بادي سبلاش خفيف بنفحات منعشة وهوائية تنتهي بلمسة نظيفة وأنيقة.\n\nخفيف، منعش، وجذاب بلا مجهود — العطر اليومي المثالي لإحساس فاخر وناعم يليق بكِ في كل لحظة.\n\nتركيبته خفيفة وآمنة على البشرة للاستخدام اليومي، تمنحكِ ثقة وأنوثة راقية من أول رشة.",
                Price = 350m,
                OriginalPrice = 490m,
                Category = "body",
                Image = "/images/bloom.png",
                Badge = "خصم 28%",
                Rating = 5.0,
                ReviewsCount = 9,
                Stock = 40,
                Ingredients = "نفحات منعشة وهوائية.\nلمسة نهائية نظيفة وأنيقة.\nتركيبة خفيفة وآمنة على البشرة للاستخدام اليومي.\nنفحات عطر تدوم حتى 12 ساعة.",
                Benefits = "رائحة تدوم طويلاً بفوحان قوي وواضح.\nتوليفة فريدة أنيقة لتجربة أنثوية راقية.\nخفيف وآمن على البشرة للاستخدام اليومي.\nانتعاش ونعومة وثقة حتى 12 ساعة.",
                HowToUse = "رشي البادي سبلاش على مناطق النبض (الرقبة، الرسغين، وخلف الأذنين) من مسافة 15 سم، أو على الجسم بالكامل بعد الاستحمام لانتعاش يدوم طوال اليوم.",
                Volume = "200ml",
                SkinType = "جميع أنواع البشرة"
            });
            context.SaveChanges();
        }

        // Seed Velora Velvet body splash if missing
        if (!context.Products.Any(p => p.Name == "Velora Velvet"))
        {
            context.Products.Add(new Product
            {
                Name = "Velora Velvet",
                Tagline = "فانيليا دافئة بلمسة ناعمة وجذابة تليق بكِ كل يوم 🤍",
                Description = "عطر فانيليا دافئ بملمس حسي ناعم، كريمي ويسبب الإدمان، أنثوي بلا مجهود.\n\nعطر توقيع مميز يمنحكِ إحساسًا بالأناقة والدفء والراحة لا يُنسى.\n\nتركيبة خفيفة وآمنة على البشرة، تناسب الاستخدام اليومي وتمنحكِ إحساسًا بالفخامة والثقة طوال اليوم.",
                Price = 350m,
                OriginalPrice = 490m,
                Category = "body",
                Image = "/images/velvet.png",
                Badge = "خصم 28%",
                Rating = 5.0,
                ReviewsCount = 11,
                Stock = 40,
                Ingredients = "فانيليا دافئة بلمسة حسية ناعمة.\nقوام كريمي جذاب وأنثوي.\nتركيبة خفيفة وآمنة على البشرة للاستخدام اليومي.\nنفحات عطر تدوم حتى 12 ساعة.",
                Benefits = "رائحة تدوم طويلاً بفوحان قوي وواضح.\nتوليفة فريدة أنيقة لتجربة أنثوية راقية.\nخفيف وآمن على البشرة للاستخدام اليومي.\nانتعاش ونعومة وثقة حتى 12 ساعة.",
                HowToUse = "رشي البادي سبلاش على مناطق النبض (الرقبة، الرسغين، وخلف الأذنين) من مسافة 15 سم، أو على الجسم بالكامل بعد الاستحمام لانتعاش يدوم طوال اليوم.",
                Volume = "200ml",
                SkinType = "جميع أنواع البشرة"
            });
            context.SaveChanges();
        }

        // Seed VELORA Bundle product if missing
        if (!context.Products.Any(p => p.Name == "باندل VELORA"))
        {
            context.Products.Add(new Product
            {
                Name = "باندل VELORA",
                Tagline = "ثلاثي روتين العناية الكامل — غسول + تونر + سيروم ✨",
                Description = "باندل VELORA يجمع لكِ ثلاثي روتين البشرة المثالي في باقة واحدة اقتصادية:\n\n• غسول للبشره الدهنيه والمختلطه — تنظيف عميق دون تجفيف\n• Cica toner — توازن وترطيب وتهيئة البشرة\n• Hydro Glow serum — ترطيب عميق وإشراقة تشبه الفيلر\n\nاشتري الثلاثة معًا بسعر الباندل المميز، ووفّري وابدئي روتينًا كاملاً لبشرة نظيفة، متوازنة، ومشرقة ✨",
                Price = 830m,
                OriginalPrice = 1050m,
                Category = "bundles",
                Image = "/images/bundle.jpg",
                Badge = "خصم 21%",
                Rating = 5.0,
                ReviewsCount = 6,
                Stock = 25,
                Ingredients = "غسول للبشره الدهنيه والمختلطه (150ml).\nCica toner (200ml).\nHydro Glow serum (30ml).",
                Benefits = "روتين عناية كامل في باقة واحدة بسعر مميز.\nتنظيف عميق وتوازن وترطيب وإشراقة معًا.\nتوفر مقابل شراء كل منتج على حدة.\nبشرة نظيفة، متوازنة، ومشرقة من أول أسبوع.",
                HowToUse = "ابدئي بالغسول على بشرة مبللة صباحًا ومساءً، ثم مرري التونر على قطنة، وانتهي ببضع قطرات من السيروم قبل المرطب.",
                Volume = "3 قطع",
                SkinType = "جميع أنواع البشرة"
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
                    TitleHighlight = "روتين كامل",
                    TitleRest = "بسعر مميز",
                    Description = "ثلاثي VELORA الكامل — غسول، تونر، وسيروم في باقة واحدة اقتصادية مع خصم يصل إلى 21%.",
                    ProductImage = "/images/bundle.jpg",
                    ProductTitle = "باندل VELORA",
                    ProductSub = "غسول + تونر + سيروم",
                    Rating = "★ 5.0",
                    MiniCardImage = "/images/hydro_glow.png",
                    MiniCardTitle = "Hydro Glow serum",
                    MiniCardOffer = "خصم 26% اليوم",
                    Active = true,
                    DisplayOrder = 0
                },
                new HeroSlide
                {
                    Badge = "ترطيب يشبه الفيلر ✨",
                    TitleHighlight = "إشراقة",
                    TitleRest = "ونعومة فورية",
                    Description = "سيروم الهيالورونيك والإشراقة — ترطيب عميق، مسام أدق، وتوحيد مذهل للون البشرة مع Niacinamide وAlpha Arbutin.",
                    ProductImage = "/images/hydro_glow.png",
                    ProductTitle = "Hydro Glow serum",
                    ProductSub = "ترطيب عميق وإشراقة",
                    Rating = "★ 5.0",
                    MiniCardImage = "/images/toner.png",
                    MiniCardTitle = "Cica toner",
                    MiniCardOffer = "خصم 28% اليوم",
                    Active = true,
                    DisplayOrder = 1
                },
                new HeroSlide
                {
                    Badge = "توازن وترطيب 💦",
                    TitleHighlight = "بشرة",
                    TitleRest = "متوازنة ونضرة",
                    Description = "تونر Cica يوازن بشرتك ويهدئها ويهيئها لامتصاص السيروم والكريمات — سر الروتين الصحي بفضل Centella Asiatica.",
                    ProductImage = "/images/toner.png",
                    ProductTitle = "Cica toner",
                    ProductSub = "توازن وترطيب ونضارة",
                    Rating = "★ 5.0",
                    MiniCardImage = "/images/cleanser.jpg",
                    MiniCardTitle = "الغسول المنظف",
                    MiniCardOffer = "خصم 30% اليوم",
                    Active = true,
                    DisplayOrder = 2
                }
            );
            context.SaveChanges();
        }
    }
}
