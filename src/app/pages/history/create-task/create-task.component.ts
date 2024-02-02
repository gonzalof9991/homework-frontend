import {Component, inject} from "@angular/core";
import {IHistory, ITaskCreate} from "../../../app.interface";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import {DialogTaskComponent} from "../dialog-task/dialog-task.component";
import {DataService} from "../../../shared/services/data.service";


@Component({
  selector: 'create-task',
  standalone: true,
  template: `

    <button mat-stroked-button class="flex justify-center items-center" [matTooltip]="'Nueva tarea'" (click)="open()">
      <mat-icon class="text-primary m-0">add</mat-icon>
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

  public open(): void {
    const dialogRef = this._dialog.open(DialogTaskComponent, {
      width: '900px',
      data: {history: this.history}
    });

    dialogRef.afterClosed().subscribe({
      next: async (result: any) => {
        if (!result) return;
        console.log('The task-dialog was closed');
        console.log(result);
        await this._create(result.task);
      }
    });
  }


  private _create(task: ITaskCreate): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._dataService.post<ITaskCreate>(`histories/${this.history?.id}/tasks`, task).subscribe({
        next: (task) => {
          console.log(task, 'created');
          resolve();
        },
        error: (error) => {
          console.log(error);
          reject(error);
        }
      });
    });
  }
}
