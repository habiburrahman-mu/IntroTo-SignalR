import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpService } from './services/http.service';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import Auction from './models/Auction';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private httpService = inject(HttpService);

  title = 'SignalR';
  list$ = this.httpService.getAllAuctions().pipe(
    map(data => (
      {
        loading: false,
        data: data.map(x => ({...x, newBid: x.currentBid + 1} as AuctionExtended)),
        error: false
      })),
    startWith({ loading: true, data: undefined, error: false }),
    catchError(err => of({ loading: false, data: undefined, error: true })),
  );

  ngOnInit(): void {
  }

  onClickBid(data: AuctionExtended) {
    console.log('pressed for bid');
    console.table(data);
  }
}

interface AuctionExtended extends Auction {
  newBid: number;
}

