import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpService } from './services/http.service';
import { Observable, catchError, map, of, startWith } from 'rxjs';
import Auction from './models/Auction';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  private httpService = inject(HttpService);

  title = 'SignalR';
  list$ = this.httpService.getAllAuctions().pipe(
    map(x => ({loading: false, data: x, error: false})),
    startWith({loading: true, data: undefined, error: false}),
    catchError(err => of({loading: false, data: undefined, error: true}))
  );


  ngOnInit(): void {
  }
}
