import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from "./shared/components/header/header.component";
import {HistoryComponent} from "./pages/history/history.component";
import {DataService} from "./shared/services/data.service";
import {IHistory} from "./app.interface";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, HistoryComponent],
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
        }
      })
    });
  }

}
