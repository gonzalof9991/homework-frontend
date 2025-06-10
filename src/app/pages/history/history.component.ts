import {Component, computed, effect, inject, OnInit, signal} from "@angular/core";
import {IHistory, ITask} from "../../app.interface";
import {DataService} from "../../shared/services/data.service";
import {
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {ListTaskComponent} from "./list-task/list-task.component";
import {CreateTaskComponent} from "./create-task/create-task.component";
import {HistoryService} from "./history.service";
import {MatIcon} from "@angular/material/icon";
import {NgClass, NgIf} from "@angular/common";
import {MatTooltip} from "@angular/material/tooltip";
import {MatButton} from "@angular/material/button";
import {SnackbarService} from "../../shared/services/snackbar";

@Component({
  selector: 'history',
  standalone: true,
  imports: [
    CdkDropListGroup, CdkDropList, DragDropModule, ListTaskComponent, CreateTaskComponent, MatIcon, NgClass, NgIf, MatTooltip, MatButton
  ],
  inputs: [
    {
      name: 'history',
      required: true
    }
  ],
  template: `

    @defer {
      <div class="flex w-full justify-center items-baseline gap-x-4 my-10">
        <!-- Pending open/closed date options -->
        <div
          class="flex flex-col justify-center gap-y-2  items-center"
          [ngClass]="{
              'w-full': !show()
          }"
        >
          <div
            class="flex flex-col justify-center  cursor-pointer items-center p-3  text-center rounded border border-primary  h-max"
            [ngClass]="{
              'w-1/4 gap-y-2 ': !show()
            }"
            (click)="showHistory()"
          >

            <div class="flex justify-center items-center gap-x-2">
              <span class=" font-medium text-sm">
              {{ history?.title }}
            </span>

              <mat-icon color="primary">
                {{ show() ? 'expand_less' : 'expand_more' }}
              </mat-icon>
            </div>
            <!-- Box Flex to Details -->
            <div class="flex gap-x-2">
              <!-- Total Task -->
              <div
                *ngIf="!show()"
                class="flex justify-center items-center gap-x-2"
                matTooltip="Total tasks"
              >
                <mat-icon color="primary">
                  task
                </mat-icon>
                <span class=" font-medium text-sm">
                 {{
                    history?.tasks?.length
                  }}
              </span>
              </div>
              <!-- Total Defeated -->
              <div
                *ngIf="!show()"
                class="flex justify-center items-center gap-x-2"
                matTooltip="Total defeated"
              >
                <mat-icon color="primary">
                  pending_actions
                </mat-icon>
                <span class="font-medium text-sm">
                 {{
                    totalDefeated()
                  }}
              </span>
              </div>
              <!-- Total Minutes -->
              <div
                *ngIf="!show()"
                class="flex justify-center items-center gap-x-2"
                matTooltip="Total minutes expected"
              >
                <mat-icon color="primary">
                  hourglass_top
                </mat-icon>
                <span class="font-medium text-sm">
                 {{
                    history?.added_minutes
                  }}
              </span>
              </div>
            </div>
          </div>
          <!-- Create Task | Dialog -->
          <create-task [history]="history" [hidden]="!show()"/>
          <!-- Delete History -->
          <button *ngIf="show()" mat-stroked-button color="warn" class="flex justify-center items-center"
                  [matTooltip]="'Delete history'"
                  (click)="delete()">
            <mat-icon class="m-0" color="warn">remove</mat-icon>
          </button>
        </div>
        <div cdkDropListGroup [hidden]="!show()">
          <list-task [tasks]="new" [title]="'New'" [drop]="drop" [historyTitle]="history!.title"/>
          <list-task [tasks]="active" [title]="'Active'" [drop]="drop" [historyTitle]="history!.title"/>
          <list-task [tasks]="closed" [title]="'Closed'" [drop]="drop" [historyTitle]="history!.title"/>
        </div>
      </div>
    } @placeholder (minimum 2000ms) {
      <div class="flex justify-center animate-pulse gap-x-4 my-10">

        @for (item of [1, 2, 3]; track [1, 2, 3]) {
          <div class="w-[400px] h-[200px] rounded bg-slate-200">

          </div>
        }
      </div>
    }

  `,
})
export class HistoryComponent implements OnInit {
  //------------------------
  // @ Inputs
  public history: IHistory | null = null;
  //------------------------
  // @ Public
  public new: ITask[] = [];
  public active: ITask[] = [];
  public closed: ITask[] = [];
  public skeletons: number[] = [1, 2, 3];
  public show = signal<boolean>(true);
  public totalDefeated = computed(() => this.history?.tasks?.filter((task) => task.defeated === 1).length || 0);
  //------------------------
  // @ Private
  private _dataService = inject(DataService);
  private _historyService = inject(HistoryService);
  private _snackbarService = inject(SnackbarService);

  constructor() {
    effect(async () => {
      const status = this._historyService.status();
      if (status === this.history?.title) {
        await this.reloadTaskHistory();
      }
    });
  }

  async ngOnInit() {
    this.fetchTasks();
  }

  public fetchTasks(): void {
    const data = this.history?.tasks || [];
    this.new = data.filter((task) => task.type === 0);
    this.active = data.filter((task) => task.type === 1);
    this.closed = data.filter((task) => task.type === 2);
  }

  public reloadTaskHistory(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dataService.get<IHistory>(`history/${this.history?.id}`).subscribe({
        next: (history) => {
          this.history!.tasks = history.tasks;
          this.fetchTasks();
          resolve();
        },
        error: (error) => {
          this._snackbarService.open('Error loading tasks', '', 5000, true);
          reject(error);
        },
        complete: () => {
          this._historyService.status.set('');
          this._snackbarService.open('Tasks loaded successfully');
        }
      });
    });
  }

  public drop = (event: CdkDragDrop<ITask[]>): void => {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
      this.filterTasksByType(event);
    }
  }


  public filterTasksByType(event: CdkDragDrop<ITask[]>): void {
    const typeClass = event.container.element.nativeElement.classList[1];
    const type = typeClass === 'New' ? 0 : typeClass === 'Active' ? 1 : 2;
    const tasks = event.container.data.filter((task) => task.type !== type);
    tasks.forEach(async (task) => {
      task.type = type;
      // @ts-ignore
      task.categories = task.categories.map((category) => category.id);
      await this.updateTaskType(task);
      await this.reloadTaskHistory();
    });
  }

  public updateTaskType(task: ITask): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dataService.put<ITask>(`task/${task.id}`, task)
        .subscribe({
          next: (res: ITask) => {
            this._snackbarService.open('Task updated successfully');
            resolve();
          },
          error: (err) => {
            this._snackbarService.open('Error updating task', '', 5000, true);
            reject(err)
          },
        })
    });
  }


  public showHistory(): void {
    this.show.set(!this.show());
  }


  public delete(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dataService.delete(`history/${this.history?.id}`).subscribe({
        error: (err) => {
          this._snackbarService.open('Error deleting history', '', 5000, true);
          reject(err);
        },
        complete: () => {
          this._historyService.status.set('reload');
          this._snackbarService.open('History deleted successfully');
          resolve();
        }
      });
    });
  }
}
