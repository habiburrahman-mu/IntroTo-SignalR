using API.Models;

namespace API.Repositories
{
    public interface IAuctionRepository
    {
        IEnumerable<Auction> GetAll();
        void NewBid(int auctionId, int newBid);
    }

    public class AuctionRepository : IAuctionRepository
    {
        private readonly List<Auction> auctions = new List<Auction>();

        public AuctionRepository()
        {
            auctions.Add(new Auction { Id = 1, ItemName = "Sleek smart phone", CurrentBid = 200 });
            auctions.Add(new Auction { Id = 2, ItemName = "Vintage record player", CurrentBid = 50 });
            auctions.Add(new Auction { Id = 3, ItemName = "Ergonomic office chair", CurrentBid = 80 });
            auctions.Add(new Auction { Id = 4, ItemName = "High-definition projector", CurrentBid = 150 });
            auctions.Add(new Auction { Id = 5, ItemName = "Wireless gaming mouse", CurrentBid = 60 });

        }

        public IEnumerable<Auction> GetAll()
        {
            return auctions;
        }

        public void NewBid(int auctionId, int newBid)
        {
            var auction = auctions.Single(a => a.Id == auctionId);
            auction.CurrentBid = newBid;
        }
    }
}
