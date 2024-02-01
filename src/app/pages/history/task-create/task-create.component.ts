import {Component, inject} from "@angular/core";
import {IHistory} from "../../../app.interface";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import {TaskDialogComponent} from "../task-dialog/task-dialog.component";


@Component({
  selector: 'task-create',
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
export class TaskCreateComponent {
  //------------------------
  // @ Input
  public history: IHistory | null = null;
  //------------------------
  // @ Private
  private _dialog = inject(MatDialog);

  public open(): void {
    console.log('open');
    console.log(this.history);
    const dialogRef = this._dialog.open(TaskDialogComponent, {
      width: '800px',
      data: {history: this.history}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The task-dialog was closed');
    });
  }


  private _create(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  }
}
