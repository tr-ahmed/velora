namespace VeloraCare.API.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string Tagline { get; set; } = string.Empty;
    public string TaglineEn { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public decimal? OriginalPrice { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Image { get; set; } = string.Empty;
    public string? Badge { get; set; }
    public string? BadgeEn { get; set; }
    public double Rating { get; set; } = 5.0;
    public int ReviewsCount { get; set; } = 48;
    public int Stock { get; set; } = 50;

    // Full detailed fields
    public string Ingredients { get; set; } = string.Empty;
    public string IngredientsEn { get; set; } = string.Empty;
    public string Benefits { get; set; } = string.Empty;
    public string BenefitsEn { get; set; } = string.Empty;
    public string HowToUse { get; set; } = string.Empty;
    public string HowToUseEn { get; set; } = string.Empty;
    public string Volume { get; set; } = "50ml";
    public string SkinType { get; set; } = "جميع أنواع البشرة";
    public string SkinTypeEn { get; set; } = "All Skin Types";
}

public class Category
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string NameEn { get; set; } = string.Empty;
    public string Icon { get; set; } = "✨";
    public string? Description { get; set; }
    public string? DescriptionEn { get; set; }
}

public class Order
{
    public int Id { get; set; }
    public string OrderNumber { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }
    public string Status { get; set; } = "قيد الانتظار";
    public string PaymentMethod { get; set; } = "cod";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<OrderItem> Items { get; set; } = new();
}

public class OrderItem
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
}

public class User
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "Customer"; // Customer | Admin
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string? Avatar { get; set; }
}

public class Coupon
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public int DiscountPercentage { get; set; }
    public bool IsActive { get; set; } = true;
}

public class Review
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int Rating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

public class HeroSlide
{
    public int Id { get; set; }
    public string Badge { get; set; } = string.Empty;
    public string BadgeEn { get; set; } = string.Empty;
    public string TitleHighlight { get; set; } = string.Empty;
    public string TitleHighlightEn { get; set; } = string.Empty;
    public string TitleRest { get; set; } = string.Empty;
    public string TitleRestEn { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string DescriptionEn { get; set; } = string.Empty;
    
    // Feature Product Card Data
    public string ProductTitle { get; set; } = string.Empty;
    public string ProductTitleEn { get; set; } = string.Empty;
    public string ProductSub { get; set; } = string.Empty;
    public string ProductSubEn { get; set; } = string.Empty;
    public string ProductImage { get; set; } = string.Empty;
    public double Rating { get; set; }
    
    // Bottom Mini Cards Data (Assuming single mini card per slide for simplicity in current design)
    public string MiniCardTitle { get; set; } = string.Empty;
    public string MiniCardTitleEn { get; set; } = string.Empty;
    public string MiniCardOffer { get; set; } = string.Empty;
    public string MiniCardOfferEn { get; set; } = string.Empty;
    public string MiniCardImage { get; set; } = string.Empty;
    
    // Control
    public bool Active { get; set; } = true;
    public int DisplayOrder { get; set; } = 0;
}

public class HeroSettings
{
    public int Id { get; set; }
    public bool AutoPlay { get; set; } = true;
    public double AutoPlayInterval { get; set; } = 5.5;
    public bool ShowTrustHighlights { get; set; } = true;
}

public class Offer
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Subtitle { get; set; } = string.Empty;
    public string CouponCode { get; set; } = string.Empty;
    public int DiscountPercentage { get; set; } = 15;
    public DateTime EndTime { get; set; } = DateTime.UtcNow.AddDays(3);
    public bool IsActive { get; set; } = true;
}
