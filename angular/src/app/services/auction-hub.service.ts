import { Injectable } from '@angular/core';
import * as SignalR from '@microsoft/signalr';
import APIConstants from '../constants/api-constants';
import AuctionNotify from '../models/AuctionNotify';
import HubMessageConstants from '../constants/hub-message-constants';

@Injectable({
  providedIn: 'root'
})
export class AuctionHubService {

  private hubConnection: SignalR.HubConnection | undefined;

  public startConnection() {
    this.hubConnection = new SignalR.HubConnectionBuilder()
      .withUrl(APIConstants.BaseAddress + APIConstants.AuctionHubAddress)
      .build();

    this.hubConnection.start()
      .then(_ => console.log("connected to auction hub"))
      .catch(err => console.log("error while connecting to auction hub", err));
  }

  public onReceivedNewBid(callBack: (auctionNotify: AuctionNotify) => void) {
    this.hubConnection?.on(HubMessageConstants.ReceiveNewBid, (auctionNotify: AuctionNotify) => {
      callBack(auctionNotify);
    });
  }
}
