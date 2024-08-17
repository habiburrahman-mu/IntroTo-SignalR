import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Auction from '../models/Auction';
import APIConstants from '../constants/api-constants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly baseAddress = APIConstants.BaseAddress;
  private readonly apiAddress = this.baseAddress + "/Auction";

  constructor(private httpClient: HttpClient) { }

  getAllAuctions(): Observable<Auction[]> {
    return this.httpClient.get<Auction[]>(this.apiAddress);
  }

  placeBid(auctionId: number, newBid: number): Observable<void> {
    return this.httpClient.post<void>(this.apiAddress, { auctionId, newBid });
  }

  addNewItem(itemName: string, startingBid: number): Observable<number> {
    const actionPath = APIConstants.AddNewItemPath;
    const requestBody: Auction = {
      id: 0,
      itemName,
      currentBid: startingBid
    };

    return this.httpClient.post<number>(this.apiAddress + actionPath, requestBody);
  }
}
