import {Component, inject} from "@angular/core";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatDialog} from "@angular/material/dialog";
import {CreateHistoryDialogComponent} from "./create-history-dialog/create-history-dialog.component";
import {HistoryService} from "../history.service";
import {DataService} from "../../../shared/services/data.service";
import {SnackbarService} from "../../../shared/services/snackbar";

@Component({
  selector: 'create-history',
  standalone: true,
  imports: [
    MatButton,
    MatIcon
  ],
  template: `

    <button mat-stroked-button (click)="open()">
      <mat-icon>add</mat-icon>
      <span>New history</span>
    </button>

  `
})
export class CreateHistoryComponent {
  //------------------------
  // @ Private
  private _dialog = inject(MatDialog);
  private _historyService = inject(HistoryService);
  private _dataService = inject(DataService);
  private _snackbarService = inject(SnackbarService);

  public open(): void {
    const dialogRef = this._dialog.open(CreateHistoryDialogComponent, {
      width: '900px',
    });

    dialogRef.afterClosed().subscribe({
      next: async (result: any) => {
        if (!result) return;
        await this._create(result.title, result.description)
      }
    });
  }


  private _create(
    title: string,
    description: string
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._dataService.post('history/1', {
        title,
        description
      }).subscribe({
        next: () => {
          this._historyService.status.set('reload');
          this._snackbarService.open('History created successfully');
          resolve();
        },
        error: (error) => {
          this._snackbarService.open('Error creating history', '', 5000, true);
          reject(error);
        }
      });
    });
  }
}
