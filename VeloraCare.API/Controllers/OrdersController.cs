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

    public OrdersController(VeloraDbContext db)
    {
        _db = db;
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
