using API.Models;
using API.Repositories;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuctionController : ControllerBase
    {
        private readonly IAuctionRepository auctionRepository;

        public AuctionController(IAuctionRepository auctionRepository)
        {
            this.auctionRepository = auctionRepository;
        }

        [HttpGet]
        public IActionResult Get()
        {
            var list = auctionRepository.GetAll();
            return Ok(list);
        }

        [HttpPost]
        public IActionResult Get(int auctionId, int newBid)
        {
            auctionRepository.NewBid(auctionId, newBid);
            return Ok();
        }
    }
}
