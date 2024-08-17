import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpService } from './services/http.service';
import { BehaviorSubject, Observable, catchError, map, of, startWith } from 'rxjs';
import Auction from './models/Auction';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuctionHubService } from './services/auction-hub.service';
import AuctionNotify from './models/AuctionNotify';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private httpService = inject(HttpService);
  private auctionHubService = inject(AuctionHubService);
  private destroyRef = inject(DestroyRef);

  title = 'SignalR';
  newItemName: string | null = null;
  newItemStartingBid: number | null = null;
  bidId = signal(0);
  isLoading = signal(false);
  isNewItemSaveLoading = signal(false);
  private listSubject = new BehaviorSubject<{ loading: boolean; data?: AuctionExtended[]; error: boolean }>({ loading: true, data: undefined, error: false });
  list$ = this.listSubject.asObservable();

  ngOnInit(): void {
    this.loadData();
    this.auctionHubService.startConnection();
    this.auctionHubService.onReceivedNewBid(auction => {
      this.updateNewBid(auction);
      console.log(auction);
    });
  }

  private loadData() {
    this.httpService.getAllAuctions().pipe(
      map(data => (
        {
          loading: false,
          data: data.map(x => ({ ...x, newBid: x.currentBid + 1 } as AuctionExtended)),
          error: false
        })),
      startWith({ loading: true, data: undefined, error: false }),
      catchError(err => of({ loading: false, data: undefined, error: true }))
    ).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => this.listSubject.next(data));
  }

  onClickBid(data: AuctionExtended) {
    this.bidId.set(data.id);
    this.isLoading.set(true);
    this.httpService.placeBid(data.id, data.newBid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: _ => {
          this.auctionHubService.notifyNewBid({ id: data.id, currentBid: data.newBid })
          this.isLoading.set(false);
        },
        error: err => {
          this.isLoading.set(false);
        }
      });
  }

  updateNewBid(auction: AuctionNotify) {
    const currentState = this.listSubject.value;
    var list = this.listSubject.value.data;
    var auctionDataToUpdate = list?.find(x => x.id === auction.id);
    if (auctionDataToUpdate) {
      auctionDataToUpdate.currentBid = auction.currentBid;
      auctionDataToUpdate.newBid = auction.currentBid + 1;
      this.listSubject.next({
        ...currentState,
        data: list
      });
    }
  }

  onClickAddNewItem() {

  }
}

interface AuctionExtended extends Auction {
  newBid: number;
}

