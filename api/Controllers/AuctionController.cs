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
        public async Task<IActionResult> Get()
        {
            var list = await auctionRepository.GetAll();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> PlaceBid([FromBody] NewBidRequest newBidRequest)
        {
            await auctionRepository.NewBid(newBidRequest.AuctionId, newBidRequest.NewBid);
            return Ok();
        }

        [HttpPost("AddNewItem")]
        public async Task<ActionResult<int>> AddNewItem([FromBody] Auction auction)
        {
            var id = await auctionRepository.AddNewItem(auction);
            return Ok(id);
        }
    }
}
