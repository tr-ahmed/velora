using VeloraCare.API.Models;

namespace VeloraCare.API.Data;

public static class DbInitializer
{
    public static void Initialize(VeloraDbContext context)
    {
        if (context.Products.Any()) return;

        var categories = new List<Category>
        {
            new Category { Code = "all", Name = "كافة التشكيلات", Icon = "✨" },
            new Category { Code = "serum", Name = "السيروم والإكسير", Icon = "🧪" },
            new Category { Code = "moisturizer", Name = "الترطيب الفاخر", Icon = "🧴" },
            new Category { Code = "oils", Name = "زيوت البشرة الزمردية", Icon = "🌿" },
            new Category { Code = "candles", Name = "شموع الاسترخاء الملكية", Icon = "🕯️" }
        };
        context.Categories.AddRange(categories);

        var products = new List<Product>
        {
            new Product
            {
                Name = "سيروم الزمرد لإعادة إحياء الشباب",
                Tagline = "إكسير نباتي مكثف لإعادة مرونة ونضارة البشرة الفورية",
                Description = "تركيبة فاخرة تمزج بين زيت الزمرد النادر وحمض الهيالورونيك الثلاثي ومستخلصات الشاي الأخضر العضوي لإعادة تحفيز الكولاجين الطبيعي وتنعيم الخطوط الدقيقة.",
                Price = 650,
                OriginalPrice = 780,
                Category = "serum",
                Image = "/images/serum.png",
                Badge = "الأكثر مبيعاً 👑",
                Rating = 4.9,
                ReviewsCount = 124,
                Stock = 45,
                Ingredients = "زيت الزمرد المستخلص ناهيك عن حمض الهيالورونيك، فيتامين C، مستخلص الورد الجوري العضوي، والببتيدات النباتية.",
                Benefits = "ترطيب عميق يدوم 72 ساعة، تحفيز الكولاجين، إشراقة وتوحيد لون البشرة، حماية من التجاعيد المبكرة.",
                HowToUse = "ضعي 3 إلى 4 قطرات على بشرة نظيفة وجافة صباحاً ومساءً مع تدليك ناعم بحركات دائرية لأعلى.",
                Volume = "30ml",
                SkinType = "جميع أنواع البشرة (بما فيها الحساسة)"
            },
            new Product
            {
                Name = "كريم الترطيب الزمردي الفاخر",
                Tagline = "ترطيب ملكي مخملي بحمض الهيالورونيك وزبدة الشيا العضوية",
                Description = "كريم فاخر خفيف الوزن ينغمس داخل خلايا البشرة ليمنحها نعومة المخمل وترطيباً مكثفاً بدون أي أثر زيتي. يحمي البشرة من العوامل الجوية الضارة.",
                Price = 520,
                OriginalPrice = 620,
                Category = "moisturizer",
                Image = "/images/cream.png",
                Badge = "عناية فائقة 🌿",
                Rating = 4.8,
                ReviewsCount = 89,
                Stock = 30,
                Ingredients = "زبدة الشيا العضوية، مستخلص الصبار النقي، فيتامين E، زيت الجوجوبا السائل، وسيراميد نباتي مكثف.",
                Benefits = "ترميم حاجز البشرة الواقي، نعومة مخملية فورية، تهدئة الاحمرار، وحماية من الجفاف الشديد.",
                HowToUse = "يوزع قدر مناسب على الوجه والرقبة بعد السيروم صباحاً ومساءً مع الطبطبة الخفيفة.",
                Volume = "50ml",
                SkinType = "البشرة الجافة والعادية والمختلطة"
            },
            new Product
            {
                Name = "زيت فيلورا الذهبي للوجه والرقبة",
                Tagline = "قطرات من الذهب والنباتات النادرة لإشراقة ملكية أخاذة",
                Description = "مزيج ساحر من 7 زيوت بكر معصورة على البارد ومزودة ببريق الذهب العضوي. يغذي خلايا البشرة ويمنحك إشراقة متوهجة كالذهب.",
                Price = 780,
                OriginalPrice = 900,
                Category = "oils",
                Image = "/images/glow_oil.png",
                Badge = "إصدار محدود ✨",
                Rating = 5.0,
                ReviewsCount = 67,
                Stock = 20,
                Ingredients = "زيت الارجان البكر، زيت الأرجان المعصور بارداً، رقائق الذهب النقي، زيت اللوز الحلو، وزيت اللافندر العطري.",
                Benefits = "إشراقة متوهجة فورية، تغذية مكثفة للبشرة الباهتة، تجديد الخلايا أثناء النوم.",
                HowToUse = "يستخدم مساءً قبل النوم: ضعي قطرتين على كف اليد وربتي بلطف على الوجه والرقبة.",
                Volume = "50ml",
                SkinType = "جميع أنواع البشرة"
            },
            new Product
            {
                Name = "شمعة VELORA العطرية بالزيوت الزمردية",
                Tagline = "عبر عبير اللافندر واللافندر الفاخر لأجواء استرخاء ملكية",
                Description = "مصنوعة من شمع الصويا العضوي 100% المحقون بزيوت عطريّة نادرة تمنح غرفتك عبق الاسترخاء والهدوء النفسي.",
                Price = 390,
                OriginalPrice = 450,
                Category = "candles",
                Image = "/images/candle.png",
                Badge = "استرخاء 🕯️",
                Rating = 4.7,
                ReviewsCount = 42,
                Stock = 15,
                Ingredients = "شمع صويا طبيعي 100%، فتيل قطني نقي، زيوت لافندر وخشب الصندل الزمردي العضوية.",
                Benefits = "تهدئة الأعصاب وتحسين المزاج، إخفاء الطاقات السلبية، وإشاعة عبير ملكي يدوم لساعات.",
                HowToUse = "أشعلي الفتيل لمدة ساعة على الأقل في كل استخدام لضمان ذوبان الشمع بالتساوي.",
                Volume = "250g",
                SkinType = "مناسب لأجواء المنزل والسبا"
            }
        };
        context.Products.AddRange(products);
        context.SaveChanges();

        var coupons = new List<Coupon>
        {
            new Coupon { Code = "VELORA15", DiscountPercentage = 15, IsActive = true },
            new Coupon { Code = "SUMMER20", DiscountPercentage = 20, IsActive = true }
        };
        context.Coupons.AddRange(coupons);

        var users = new List<User>
        {
            new User
            {
                FullName = "مدير نظام VELORA",
                Email = "admin@velora.com",
                PasswordHash = "Admin123!",
                Role = "Admin"
            }
        };
        context.Users.AddRange(users);

        var random = new Random(42);
        var customerNames = new[] { "مريم الجندي", "أحمد محمود", "سارة فؤاد", "نورة الشراكي", "ياسمين عبده", "خالد إبراهيم", "هدى سمير", "عمر حسن", "فاطمة الزهراء", "محمد عبد الله", "ريم سعيد", "كريم مصطفى", "دانا عبد الرحمن", "طارق ناصر", "نادين حسين", "إسماعيل عادل" };
        var cities = new[] { "القاهرة", "القاهرة", "القاهرة", "القاهرة", "الإسكندرية", "الإسكندرية", "الجيزة", "الجيزة", "المنصورة", "المنصورة", "طنطا", "طنطا", "الشرقية", "أسيوط", "الأقصر", "أسوان" };
        var statuses = new[] { "تم التوصيل", "تم التوصيل", "تم التوصيل", "تم التوصيل", "تم الشحن", "جاري التجهيز", "جاري التجهيز", "قيد الانتظار", "ملغي" };
        var paymentMethods = new[] { "cod", "card", "vodafone", "cod", "card", "cod", "vodafone", "cod", "card" };

        var orders = new List<Order>();
        var orderDate = DateTime.UtcNow.AddDays(-30);

        for (int i = 0; i < 28; i++)
        {
            orderDate = orderDate.AddHours(random.Next(4, 36));

            var productIndex = random.Next(0, 4);
            var qty1 = random.Next(1, 3);
            var qty2 = random.Next(0, 3);
            var p1 = products[productIndex];
            var p2 = products[(productIndex + 1) % 4];

            var items = new List<OrderItem>
            {
                new OrderItem { ProductId = p1.Id, ProductName = p1.Name, Quantity = qty1, UnitPrice = p1.Price, TotalPrice = p1.Price * qty1 }
            };
            if (qty2 > 0)
            {
                items.Add(new OrderItem { ProductId = p2.Id, ProductName = p2.Name, Quantity = qty2, UnitPrice = p2.Price, TotalPrice = p2.Price * qty2 });
            }

            var subtotal = items.Sum(it => it.TotalPrice);
            var shippingFee = subtotal >= 1000 ? 0 : 60;
            var customerIdx = i % customerNames.Length;

            orders.Add(new Order
            {
                OrderNumber = $"VEL-EG-{random.Next(100000, 999999)}",
                FullName = customerNames[customerIdx],
                Phone = $"01{random.Next(10, 12)}{random.Next(10000000, 99999999)}",
                City = cities[customerIdx],
                Address = $"شارع {random.Next(1, 50)}، الحي {random.Next(1, 15)}",
                Subtotal = subtotal,
                ShippingFee = shippingFee,
                Total = subtotal + shippingFee,
                Status = statuses[random.Next(0, statuses.Length)],
                PaymentMethod = paymentMethods[random.Next(0, paymentMethods.Length)],
                CreatedAt = orderDate,
                Items = items
            });
        }

        context.Orders.AddRange(orders);

        if (!context.Offers.Any())
        {
            context.Offers.Add(new Offer
            {
                Title = "عروض الفلاش السريعة ✨",
                Subtitle = "خصم ملكي حصري 15% على كافة السيرومات والزيوت الزمردية في مصر",
                CouponCode = "VELORA15",
                DiscountPercentage = 15,
                EndTime = DateTime.UtcNow.AddDays(2),
                IsActive = true
            });
        }

        context.SaveChanges();
    }
}
