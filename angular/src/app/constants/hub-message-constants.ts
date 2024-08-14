export namespace HubMessageConstants {
  export class HubMethod {
    public static NotifyNewBid = "NotifyNewBid" as const;
  }

  export class CallBackMethod {
    public static ReceivedNewBid = "ReceivedNewBid" as const;
  }
}
