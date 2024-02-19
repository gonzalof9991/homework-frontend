import {Component, inject, signal} from "@angular/core";
import {ITask} from "../../../../app.interface";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {NgClass, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";
import {MatDialog} from "@angular/material/dialog";
import {DialogTaskComponent} from "../../dialog-task/dialog-task.component";
import {DataService} from "../../../../shared/services/data.service";
import {HistoryService} from "../../history.service";

@Component({
  selector: 'item-task',
  standalone: true,
  imports: [
    CdkDrag,
    NgClass,
    MatIcon,
    NgIf,
    MatTooltip
  ],
  template: `

    <div
      class="example-box dark:bg-slate-800"
      cdkDrag
      (click)="view()"
    >
      <div class="flex flex-col gap-y-2">
        <!-- Priority + Title -->
        <div class="flex gap-x-2">
          <div class="w-[10px] h-[20px] border-2 rounded-full"
               [ngClass]="{
          'bg-green-100   border-green-600': task().priority === 0,
          'bg-yellow-100  border-yellow-600': task().priority === 1,
          'bg-red-100  border-red-600': task().priority === 2,
        }"
          >
          </div>
          <span class="dark:text-white">
            {{ task().title }}
          </span>
          <span
            *ngIf="task().defeated === 1"
            class="border p-1 border-yellow-400 bg-yellow-50 rounded text-yellow-500 text-xs font-medium">
            Defeated
          </span>
        </div>
        <!-- Details -->
        <div class="flex gap-x-2">
          <!-- Minutes expected -->
          <div class="flex items-center gap-x-2" [matTooltip]="'Minutes expected'">
            <mat-icon class="text-md text-primary">
              timelapse
            </mat-icon>
            <span class="text-md" [innerHTML]="task().minutes_expected + ' min'"></span>
          </div>
          <!-- Minutes completed -->
          <div *ngIf="task().minutes_completed" class="flex items-center gap-x-2" [matTooltip]="'Minutes completed'">
            <mat-icon class="text-md text-primary">
              check_circle
            </mat-icon>
            <span class="text-md" [innerHTML]="task().minutes_completed + ' min'"></span>
          </div>
          <!-- Days completed -->
          <div class="flex items-center gap-x-2" [matTooltip]="'Days completed'">
            <mat-icon class="text-md text-primary">
              fact_check
            </mat-icon>
            <span class="text-md" [innerHTML]="1 + '/3'"></span>
          </div>

        </div>

      </div>
      <!-- Categories -->
      @for (category of task().categories; track category) {
        <span class="px-2 w-max py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-bold"
        >
          {{ category.name }}
        </span>
      }
    </div>

  `,
  inputs: [
    {
      name: 'task',
      required: true,
      transform: (task: ITask) => signal(task)
    },
    {
      name: 'historyTitle',
      required: true
    }
  ]
})
export class ItemTaskComponent {
  //------------------------
  // @ Inputs
  public task = signal<ITask>({} as ITask);
  public historyTitle!: string;
  //------------------------
  // @ Private
  private _dialog = inject(MatDialog);
  private _dataService = inject(DataService);
  private _historyService = inject(HistoryService);

  public view(): void {
    const dialogRef = this._dialog.open(DialogTaskComponent, {
      width: '900px',
      data: {
        type: 'view',
        task: this.task
      }
    });
    dialogRef.afterClosed().subscribe({
      next: async (result: any) => {
        if (!result) return;
        // update
        if (result.type === 'update') {
          await this._update(result.task);
        }
        // delete
        if (result.type === 'delete') {
          await this._delete();
        }
        // Notify event to re load tasks
        this._historyService.status.set(`${this.historyTitle}`);
      }
    });
  }

  private _delete(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._dataService.delete<ITask>(`task/${this.task().id}`).subscribe({
        next: (task) => {
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  private _update(task: ITask): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const newTask = {
        ...task,
        categories: task.categories.map((category) => category.id)
      };
      this._dataService.put<ITask>(`task/${this.task().id}`, newTask).subscribe({
        next: (task) => {
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
}
