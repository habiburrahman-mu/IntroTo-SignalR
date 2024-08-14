namespace API.Constants
{
    public class SignalRConstants
    {
        public static class HubMethod
        {
            public const string NotifyNewBid = "NotifyNewBid";
        }

        public static class CallBackMethod
        {
            public const string ReceivedNewBid = "ReceivedNewBid";
        }
    }
}
