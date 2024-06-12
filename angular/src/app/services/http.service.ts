import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import Auction from '../models/Auction';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private readonly baseAddress = "https://localhost:7221" as const;
  private readonly apiAddress = this.baseAddress + "/Auction";

  constructor(private httpClient: HttpClient) { }

  getAllAuctions(): Observable<Auction[]> {
    return this.httpClient.get<Auction[]>(this.apiAddress);
  }

  placeBid(auctionId: number, newBid: number): Observable<void> {
    return this.httpClient.post<void>(this.apiAddress, { auctionId, newBid });
  }
}
