using API.Models;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
    public class AuctionHub : Hub
    {
        public async Task NotifyNewBid(AuctionNotify auctionNotify)
        {
            await Clients.All.SendAsync("ReceiveNewBid", auctionNotify);
        }
    }
}
