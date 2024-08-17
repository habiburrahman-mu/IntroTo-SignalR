using API.Models;

namespace API.Repositories
{
    public interface IAuctionRepository
    {
        Task<IEnumerable<Auction>> GetAll();
        Task NewBid(int auctionId, int newBid);
        Task<int> AddNewItem(Auction auction);
    }

    public class AuctionRepository : IAuctionRepository
    {
        private readonly List<Auction> auctions = new List<Auction>();
        private int nextId
        {
            get { return auctions.Count + 1; }
        }

        public AuctionRepository()
        {
            auctions.Add(new Auction { Id = 1, ItemName = "Sleek smart phone", CurrentBid = 200 });
            auctions.Add(new Auction { Id = 2, ItemName = "Vintage record player", CurrentBid = 50 });
            auctions.Add(new Auction { Id = 3, ItemName = "Ergonomic office chair", CurrentBid = 80 });
            auctions.Add(new Auction { Id = 4, ItemName = "High-definition projector", CurrentBid = 150 });
            auctions.Add(new Auction { Id = 5, ItemName = "Wireless gaming mouse", CurrentBid = 60 });
        }

        public async Task<IEnumerable<Auction>> GetAll()
        {
            return await Task.FromResult(auctions);
        }

        public async Task NewBid(int auctionId, int newBid)
        {
            var auction = auctions.Single(a => a.Id == auctionId);
            auction.CurrentBid = newBid;
            await Task.CompletedTask;
        }

        public async Task<int> AddNewItem(Auction auction)
        {
            auction.Id = nextId;
            auctions.Add(auction);
            return await Task.FromResult(auction.Id);
        }
    }
}
