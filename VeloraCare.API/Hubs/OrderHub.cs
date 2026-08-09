using Microsoft.AspNetCore.SignalR;

namespace VeloraCare.API.Hubs;

public class OrderHub : Hub
{
    // The Hub will be used by the OrdersController to broadcast messages to all connected admins
    // Admins can connect to this hub and listen for "ReceiveNewOrder" events
}
