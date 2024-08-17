using API.Constants;
using API.Models;
using Microsoft.AspNetCore.SignalR;

namespace API.Hubs
{
    public class AuctionHub : Hub
    {
        [HubMethodName(SignalRConstants.HubMethod.NotifyNewBid)]
        public async Task NotifyNewBid(AuctionNotify auctionNotify)
        {
            await Clients.All.SendAsync(SignalRConstants.CallBackMethod.ReceivedNewBid, auctionNotify);
        }

        [HubMethodName(SignalRConstants.HubMethod.NotifyNewItem)]
        public async Task NotifyNewItem(Auction auction)
        {
            await Clients.All.SendAsync(SignalRConstants.CallBackMethod.ReceivedNewItem, auction);
        }
    }
}
