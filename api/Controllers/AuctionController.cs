using API.Hubs;
using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuctionController : ControllerBase
    {
        private readonly IAuctionRepository auctionRepository;
        private readonly IHubContext<AuctionHub> hubContext;

        public AuctionController(IAuctionRepository auctionRepository, IHubContext<AuctionHub> hubContext)
        {
            this.auctionRepository = auctionRepository;
            this.hubContext = hubContext;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var list = auctionRepository.GetAll();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> PlaceBid([FromBody] NewBidRequest newBidRequest)
        {
            auctionRepository.NewBid(newBidRequest.AuctionId, newBidRequest.NewBid);
            var auctionNotify = new AuctionNotify
            {
                Id = newBidRequest.AuctionId,
                CurrentBid = newBidRequest.NewBid,
            };
            //await hubContext.Clients.All.SendAsync("ReceiveNewBid", auctionNotify);
            return Ok();
        }
    }
}
