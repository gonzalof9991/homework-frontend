import {Component, effect, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./shared/components/header/header.component";
import {HistoryComponent} from "./pages/history/history.component";
import {DataService} from "./shared/services/data.service";
import {IHistory} from "./app.interface";
import {CategoryComponent} from "./pages/category/category.component";
import {HistoryService} from "./pages/history/history.service";
import {CreateHistoryComponent} from "./pages/history/create-history/create-history.component";
import {SnackbarService} from "./shared/services/snackbar/snackbar.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, HistoryComponent, CategoryComponent, CreateHistoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';
  //------------------------
  // @ Public
  public histories: IHistory[] = [];
  //------------------------
  // @ Private
  private _dataService = inject(DataService);
  private _historyService = inject(HistoryService);
  private _snackbarService = inject(SnackbarService);

  constructor() {
    effect(async () => {
      const status = this._historyService.status();
      if (status === 'reload') {
        await this.getHistories();
      }
    });
  }

  async ngOnInit() {
    await this.getHistories();
  }

  public getHistories(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._dataService.get<IHistory[]>('histories').subscribe({
        next: (histories) => {
          this.histories = histories;
          resolve();
        },
        error: (error) => {
          reject(error);
        },
        complete: () => {
          this._historyService.status.set('');
          this._snackbarService.open('Histories loaded successfully');
        }
      })
    });
  }

}
