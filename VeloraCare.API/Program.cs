using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using VeloraCare.API.Data;

var builder = WebApplication.CreateBuilder(args);

// 1. Add Controllers
builder.Services.AddControllers();

// Register EmailService
builder.Services.AddScoped<VeloraCare.API.Services.IEmailService, VeloraCare.API.Services.EmailService>();

// 2. Configure SQL Server DbContext with Warning Suppression for Pending Changes
builder.Services.AddDbContext<VeloraDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.ConfigureWarnings(w => w.Ignore(RelationalEventId.PendingModelChangesWarning));
});

// 3. Configure CORS Policy for React Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// 4. Apply Migrations & Seed Data safely
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<VeloraDbContext>();
    try
    {
        dbContext.Database.Migrate();
    }
    catch (Exception ex)
    {
        Console.WriteLine($"DB Migration Note: {ex.Message}");
    }
    DbInitializer.Initialize(dbContext);
}

// 5. Middleware Pipeline
app.UseCors("AllowAll");
app.UseStaticFiles();
app.UseAuthorization();
app.MapControllers();

app.Run();
