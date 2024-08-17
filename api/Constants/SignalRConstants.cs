namespace API.Constants
{
    public class SignalRConstants
    {
        public static class HubMethod
        {
            public const string NotifyNewBid = "NotifyNewBid";
            public const string NotifyNewItem = "NotifyNewItem";
        }

        public static class CallBackMethod
        {
            public const string ReceivedNewBid = "ReceivedNewBid";
            public const string ReceivedNewItem = "ReceivedNewItem";
        }
    }
}
