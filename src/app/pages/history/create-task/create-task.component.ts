import {Component, inject} from "@angular/core";
import {IHistory, ITaskCreate} from "../../../app.interface";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import {DialogTaskComponent} from "../dialog-task/dialog-task.component";
import {DataService} from "../../../shared/services/data.service";
import {HistoryService} from "../history.service";
import {SnackbarService} from "../../../shared/services/snackbar";


@Component({
  selector: 'create-task',
  standalone: true,
  template: `

    <button mat-stroked-button class="flex justify-center items-center" [matTooltip]="'New task'"
            (click)="open()">
      <mat-icon class="m-0" color="primary">add</mat-icon>
    </button>

  `,
  imports: [
    MatIcon,
    MatButton,
    MatTooltip
  ],
  inputs: [
    {
      name: 'history',
      required: true
    }
  ]
})
export class CreateTaskComponent {
  //------------------------
  // @ Input
  public history: IHistory | null = null;
  //------------------------
  // @ Private
  private _dialog = inject(MatDialog);
  private _dataService = inject(DataService);
  private _historyService = inject(HistoryService);
  private _snackbarService = inject(SnackbarService);

  public open(): void {
    const dialogRef = this._dialog.open(DialogTaskComponent, {
      width: '900px',
      data: {
        type: 'create',
        history: this.history
      }
    });

    dialogRef.afterClosed().subscribe({
      next: async (result: any) => {
        if (!result) return;
        await this._create(result.task);
        // Notify event to re load tasks
        this._historyService.status.set(`${this.history?.title}`);
      }
    });
  }


  private _create(task: ITaskCreate): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._dataService.post<ITaskCreate>(`histories/${this.history?.id}/tasks`, task).subscribe({
        next: (task) => {
          this._snackbarService.open('Task created successfully');
          resolve();
        },
        error: (error) => {
          this._snackbarService.open('Error creating task', '', 5000, true);
          reject(error);
        }
      });
    });
  }
}
