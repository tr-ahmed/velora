using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly VeloraDbContext _db;
    private readonly VeloraCare.API.Services.IEmailService _emailService;
    private readonly IConfiguration _config;

    public OrdersController(VeloraDbContext db, VeloraCare.API.Services.IEmailService emailService, IConfiguration config)
    {
        _db = db;
        _emailService = emailService;
        _config = config;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _db.Orders
            .Include(o => o.Items)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
        return Ok(orders);
    }

    [HttpGet("my")]
    public async Task<IActionResult> GetMyOrders([FromQuery] string phone, [FromQuery] string? fullName)
    {
        var query = _db.Orders.Include(o => o.Items).AsQueryable();

        if (!string.IsNullOrEmpty(phone))
            query = query.Where(o => o.Phone == phone);

        if (!string.IsNullOrEmpty(fullName))
            query = query.Where(o => o.FullName == fullName);

        var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
        return Ok(orders);
    }

    [HttpGet("track")]
    public async Task<IActionResult> TrackOrder([FromQuery] string orderNumber, [FromQuery] string phone)
    {
        if (string.IsNullOrWhiteSpace(orderNumber) || string.IsNullOrWhiteSpace(phone))
            return BadRequest(new { message = "رقم الطلب ورقم الهاتف مطلوبان" });

        var order = await _db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.OrderNumber == orderNumber && o.Phone == phone);

        if (order == null)
            return NotFound(new { message = "الطلب غير موجود أو البيانات غير متطابقة" });

        return Ok(order);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _db.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null) return NotFound(new { message = "الطلب غير موجود" });
        return Ok(order);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto dto)
    {
        var orderNumber = $"VEL-EG-{Random.Shared.Next(100000, 999999)}";

        var order = new Order
        {
            OrderNumber = orderNumber,
            FullName = dto.FullName,
            Phone = dto.Phone,
            City = dto.City,
            Address = dto.Address,
            Subtotal = dto.Subtotal,
            ShippingFee = dto.ShippingFee,
            Total = dto.Total,
            PaymentMethod = dto.PaymentMethod ?? "cod",
            PaymentReference = dto.PaymentReference,
            Status = "قيد الانتظار",
            CreatedAt = DateTime.UtcNow,
            Items = dto.Items.Select(i => new OrderItem
            {
                ProductId = i.ProductId,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TotalPrice = i.UnitPrice * i.Quantity
            }).ToList()
        };

        _db.Orders.Add(order);
        await _db.SaveChangesAsync();

        // Send Email Notification
        _ = Task.Run(async () =>
        {
            try
            {
                var notificationEmail = _config["EmailSettings:NotificationEmail"];
                if (!string.IsNullOrEmpty(notificationEmail))
                {
                    var itemsHtml = string.Join("", order.Items.Select(i => $"<li>{i.ProductName} (x{i.Quantity}) - {i.TotalPrice} ج.م</li>"));
                    
                    var emailBody = $@"
                        <div dir='rtl' style='font-family: Arial; padding: 20px; border: 1px solid #ddd; border-radius: 10px;'>
                            <h2 style='color: #0D221A;'>طلب جديد من متجر فيلورا! 🛍️</h2>
                            <p><strong>رقم الطلب:</strong> {order.OrderNumber}</p>
                            <p><strong>اسم العميل:</strong> {order.FullName}</p>
                            <p><strong>الموبايل:</strong> <span dir='ltr'>{order.Phone}</span></p>
                            <p><strong>المحافظة:</strong> {order.City}</p>
                            <p><strong>العنوان:</strong> {order.Address}</p>
                            <p><strong>طريقة الدفع:</strong> {order.PaymentMethod}</p>
                            {(string.IsNullOrEmpty(order.PaymentReference) ? "" : $"<p style='color: red;'><strong>رقم التحويل (المرجع):</strong> <span dir='ltr'>{order.PaymentReference}</span></p>")}
                            
                            <hr />
                            <h3>المنتجات المطلوبة:</h3>
                            <ul>
                                {itemsHtml}
                            </ul>
                            <hr />
                            <h3 style='color: #C5A059;'>المجموع الكلي: {order.Total} ج.م</h3>
                        </div>
                    ";

                    await _emailService.SendEmailAsync(notificationEmail, $"طلب جديد #{order.OrderNumber}", emailBody);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error sending email: {ex.Message}");
            }
        });

        return CreatedAtAction(nameof(GetById), new { id = order.Id }, order);
    }

    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateStatusDto dto)
    {
        var order = await _db.Orders.FindAsync(id);
        if (order == null) return NotFound(new { message = "الطلب غير موجود" });

        order.Status = dto.Status;
        await _db.SaveChangesAsync();
        return Ok(order);
    }
}

public class CreateOrderDto
{
    public string FullName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public decimal Subtotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }
    public string? PaymentMethod { get; set; }
    public string? PaymentReference { get; set; }
    public List<CreateOrderItemDto> Items { get; set; } = new();
}

public class CreateOrderItemDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
}

public class UpdateStatusDto
{
    public string Status { get; set; } = string.Empty;
}
