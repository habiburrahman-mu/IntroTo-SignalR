using API.Models;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
    public class AuctionHub : Hub
    {
        public async Task NotifyNewBid(ActionNotify actionNotify)
        {
            await Clients.All.SendAsync("ReceiveNewBid", actionNotify);
        }
    }
}
