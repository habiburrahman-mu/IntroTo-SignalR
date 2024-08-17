export namespace HubMessageConstants {
  export class HubMethod {
    public static NotifyNewBid = "NotifyNewBid" as const;
    public static NotifyNewItem = "NotifyNewItem" as const;
  }

  export class CallBackMethod {
    public static ReceivedNewBid = "ReceivedNewBid" as const;
    public static ReceivedNewItem = "ReceivedNewItem" as const;
  }
}
