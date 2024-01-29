import {Component} from "@angular/core";
import {ITask} from "../../../../app.interface";
import {CdkDrag} from "@angular/cdk/drag-drop";
import {NgClass, NgIf} from "@angular/common";
import {MatIcon} from "@angular/material/icon";
import {MatTooltip} from "@angular/material/tooltip";

@Component({
  selector: 'list-group-item',
  standalone: true,
  imports: [
    CdkDrag,
    NgClass,
    MatIcon,
    NgIf,
    MatTooltip
  ],
  template: `

    <div class="example-box dark:bg-slate-800" cdkDrag
    >
      <div class="flex flex-col gap-y-2">
        <!-- Priority + Title -->
        <div class="flex gap-x-2">
          <div class="w-[10px] h-[20px] border-2 rounded-full"
               [ngClass]="{
          'bg-green-100   border-green-600': task.priority === 0,
          'bg-yellow-100  border-yellow-600': task.priority === 1,
          'bg-red-100  border-red-600': task.priority === 2,
        }"
          >
          </div>
          <span class="dark:text-white">
        {{ task.title }}
      </span>
        </div>
        <!-- Details -->
        <div class="flex gap-x-2">
          <!-- Minutes expected -->
          <div class="flex items-center gap-x-2" [matTooltip]="'Minutes expected'">
            <mat-icon class="text-md text-primary">
              timelapse
            </mat-icon>
            <span class="text-md" [innerHTML]="task.minutes_expected + ' min'"></span>
          </div>
          <!-- Minutes completed -->
          <div *ngIf="task.minutes_completed" class="flex items-center gap-x-2" [matTooltip]="'Minutes completed'">
            <mat-icon class="text-md text-primary">
              check_circle
            </mat-icon>
            <span class="text-md" [innerHTML]="task.minutes_completed + ' min'"></span>
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

      @for (category of task.categories; track category) {
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
      required: true
    }
  ]
})
export class ListGroupItemComponent {
  //------------------------
  // @ Inputs
  public task!: ITask;
}
