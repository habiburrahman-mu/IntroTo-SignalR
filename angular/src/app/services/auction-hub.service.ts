import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import APIConstants from '../constants/api-constants';
import AuctionNotify from '../models/AuctionNotify';
import { HubMessageConstants } from '../constants/hub-message-constants';
import Auction from '../models/Auction';

@Injectable({
  providedIn: 'root'
})
export class AuctionHubService {

  private hubConnection: SignalR.HubConnection | undefined;

  public startConnection() {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(APIConstants.BaseAddress + APIConstants.AuctionHubAddress,
        {
          withCredentials: false,
        })
        .withAutomaticReconnect()
        .build();

    this.hubConnection.start()
      .then(_ => console.log("connected to auction hub"))
      .catch(err => console.log("error while connecting to auction hub", err));
  }

  public onReceivedNewBid(callBack: (auctionNotify: AuctionNotify) => void) {
    this.hubConnection?.on(HubMessageConstants.CallBackMethod.ReceivedNewBid, (auctionNotify: AuctionNotify) => {
      callBack(auctionNotify);
    });
  }

  public notifyNewBid(auctionNotify: AuctionNotify) {
    this.hubConnection?.send(HubMessageConstants.HubMethod.NotifyNewBid, auctionNotify)
      .then(_ => console.log("Notified Successfully."))
      .catch(err => console.log(err));
  }

  public onReceivedNewItem(callBack: (auction: Auction) => void) {
    this.hubConnection?.on(HubMessageConstants.CallBackMethod.ReceivedNewItem, (auction: Auction) => {
      callBack(auction);
    });
  }

  public notifyNewItem(auction: Auction) {
    this.hubConnection?.send(HubMessageConstants.HubMethod.NotifyNewItem, auction)
      .then(_ => console.log("Notified New Item Successfully."))
      .catch(err => console.log(err));
  }
}
