using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VeloraCare.API.Data;
using VeloraCare.API.Models;
using Microsoft.AspNetCore.SignalR;

namespace VeloraCare.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly VeloraDbContext _db;
    private readonly VeloraCare.API.Services.IEmailService _emailService;
    private readonly IConfiguration _config;
    private readonly Microsoft.AspNetCore.SignalR.IHubContext<VeloraCare.API.Hubs.OrderHub> _hubContext;

    public OrdersController(VeloraDbContext db, VeloraCare.API.Services.IEmailService emailService, IConfiguration config, Microsoft.AspNetCore.SignalR.IHubContext<VeloraCare.API.Hubs.OrderHub> hubContext)
    {
        _db = db;
        _emailService = emailService;
        _config = config;
        _hubContext = hubContext;
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

        // Send Real-time notification to Admins
        try 
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNewOrder", order);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"SignalR Error: {ex.Message}");
        }

        var settings = await _db.StoreSettings.FirstOrDefaultAsync();
        var notificationEmail = settings?.NotificationEmails;
        if (string.IsNullOrEmpty(notificationEmail))
        {
            notificationEmail = _config["EmailSettings:NotificationEmail"];
        }

        // Send Email Notification
        _ = Task.Run(async () =>
        {
            try
            {
                if (!string.IsNullOrEmpty(notificationEmail))
                {
                    var itemsHtml = string.Join("", order.Items.Select(i => $@"
                        <div style='display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed #C5A059;'>
                            <span style='color: #EAD096; font-size: 14px;'>{i.ProductName} <span style='color: #888; font-size: 12px;'>(x{i.Quantity})</span></span>
                            <strong style='color: #C5A059; font-size: 15px;'>{i.TotalPrice} ج.م</strong>
                        </div>
                    "));
                    
                    var emailBody = $@"
                        <div dir='rtl' style='font-family: ""Segoe UI"", Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0D221A; border: 2px solid #C5A059; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.5);'>
                            <!-- Header -->
                            <div style='background: linear-gradient(135deg, #1A3C2F 0%, #0D221A 100%); padding: 30px 20px; text-align: center; border-bottom: 3px solid #C5A059;'>
                                <img src='https://veloracareeg.vercel.app/images/logo.png' alt='VELORA CARE' style='width: 150px; margin-bottom: 15px;' />
                                <h1 style='color: #EAD096; margin: 0; font-size: 24px; font-weight: bold;'>طلب جديد من متجر فيلورا! 🛍️</h1>
                                <p style='color: #C5A059; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 1px;'>رقم الطلب: <strong style='color: #FFF; font-family: monospace; font-size: 16px;'>{order.OrderNumber}</strong></p>
                            </div>
                            
                            <!-- Content -->
                            <div style='padding: 30px; background-color: #143529;'>
                                
                                <!-- Customer Details -->
                                <h3 style='color: #C5A059; margin-top: 0; border-bottom: 1px solid rgba(197, 160, 89, 0.3); padding-bottom: 8px; font-size: 18px;'>👤 بيانات العميل</h3>
                                <table style='width: 100%; color: #EAD096; font-size: 14px; margin-bottom: 25px; border-collapse: collapse;'>
                                    <tr><td style='padding: 6px 0; color: #A0B0A5; width: 100px;'>الاسم:</td><td style='padding: 6px 0; font-weight: bold;'>{order.FullName}</td></tr>
                                    <tr><td style='padding: 6px 0; color: #A0B0A5;'>الموبايل:</td><td style='padding: 6px 0; font-weight: bold;' dir='ltr' align='right'>{order.Phone}</td></tr>
                                    <tr><td style='padding: 6px 0; color: #A0B0A5;'>المحافظة:</td><td style='padding: 6px 0; font-weight: bold;'>{order.City}</td></tr>
                                    <tr><td style='padding: 6px 0; color: #A0B0A5;'>العنوان:</td><td style='padding: 6px 0; font-weight: bold;'>{order.Address}</td></tr>
                                </table>

                                <!-- Payment Details -->
                                <h3 style='color: #C5A059; margin-top: 0; border-bottom: 1px solid rgba(197, 160, 89, 0.3); padding-bottom: 8px; font-size: 18px;'>💳 تفاصيل الدفع</h3>
                                <div style='background-color: #0D221A; padding: 15px; border-radius: 10px; margin-bottom: 25px; border: 1px solid rgba(197, 160, 89, 0.3);'>
                                    <div style='display: flex; justify-content: space-between; margin-bottom: {(string.IsNullOrEmpty(order.PaymentReference) ? "0" : "10px")};'>
                                        <span style='color: #A0B0A5; font-size: 14px;'>طريقة الدفع:</span>
                                        <strong style='color: #EAD096;'>{(order.PaymentMethod == "cod" ? "الدفع عند الاستلام" : order.PaymentMethod == "vodafone" ? "فودافون كاش" : order.PaymentMethod == "instapay" ? "إنستاباي" : order.PaymentMethod)}</strong>
                                    </div>
                                    {(string.IsNullOrEmpty(order.PaymentReference) ? "" : $@"
                                    <div style='display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid rgba(255, 255, 255, 0.05);'>
                                        <span style='color: #FF6B6B; font-size: 14px; font-weight: bold;'>رقم التحويل (المرجع):</span>
                                        <span style='background-color: rgba(255, 107, 107, 0.1); color: #FF6B6B; padding: 4px 10px; border-radius: 6px; font-family: monospace; font-weight: bold; font-size: 15px;' dir='ltr'>{order.PaymentReference}</span>
                                    </div>")}
                                </div>

                                <!-- Order Items -->
                                <h3 style='color: #C5A059; margin-top: 0; border-bottom: 1px solid rgba(197, 160, 89, 0.3); padding-bottom: 8px; font-size: 18px;'>📦 المنتجات المطلوبة</h3>
                                <div style='margin-bottom: 25px;'>
                                    {itemsHtml}
                                </div>

                                <!-- Total -->
                                <div style='background: linear-gradient(90deg, #C5A059 0%, #EAD096 100%); padding: 15px 20px; border-radius: 10px; display: flex; justify-content: space-between; align-items: center;'>
                                    <span style='color: #0D221A; font-size: 18px; font-weight: bold;'>المجموع الكلي:</span>
                                    <strong style='color: #0D221A; font-size: 22px;'>{order.Total} ج.م</strong>
                                </div>
                                
                            </div>
                            
                            <!-- Footer -->
                            <div style='background-color: #0A1A14; padding: 15px; text-align: center;'>
                                <p style='color: #666; font-size: 12px; margin: 0;'>هذه رسالة تلقائية من نظام VELORA CARE. يرجى عدم الرد عليها.</p>
                            </div>
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
