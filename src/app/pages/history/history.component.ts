import {Component, effect, inject, OnInit, signal} from "@angular/core";
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

@Component({
  selector: 'history',
  standalone: true,
  imports: [
    CdkDropListGroup, CdkDropList, DragDropModule, ListTaskComponent, CreateTaskComponent, MatIcon, NgClass, NgIf
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
          class="flex flex-col justify-center gap-y-2 ease-in duration-300 items-center"
          [ngClass]="{
              'w-full': !show()
          }"
        >
          <div
            class="flex flex-col justify-center  cursor-pointer items-center p-3  text-center bg-primary-50 rounded border border-primary h-max"
            [ngClass]="{
              'w-1/4': !show()
            }"
            (click)="showHistory()"
          >

            <div class="flex justify-center items-center gap-x-2">
              <span class="text-primary font-medium text-sm">
              {{ history?.title }}
            </span>

              <mat-icon class="text-primary">
                {{ show() ? 'expand_less' : 'expand_more' }}
              </mat-icon>
            </div>

            <!-- Detail History -->
            <div *ngIf="!show()" class="flex justify-center items-center gap-x-2">
              <mat-icon class="text-primary">
                task
              </mat-icon>
              <span class="text-primary font-medium text-sm">
                 {{
                  history?.tasks?.length
                }}
              </span>
            </div>
          </div>

          <create-task [history]="history" [hidden]="!show()"/>
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
  //------------------------
  // @ Private
  private _dataService = inject(DataService);
  private _historyService = inject(HistoryService);

  constructor() {

    effect(async () => {
      const status = this._historyService.status();
      if (status === this.history?.title) {
        await this.reloadTaskHistory();
      }
    });
  }

  async ngOnInit() {
    await this.fetchTasks();
  }

  public fetchTasks(): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = this.history?.tasks || [];
      this.new = data.filter((task) => task.type === 0);
      this.active = data.filter((task) => task.type === 1);
      this.closed = data.filter((task) => task.type === 2);
    });
  }

  public reloadTaskHistory(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dataService.get<IHistory>(`history/${this.history?.id}`).subscribe({
        next: async (history) => {
          this.history!.tasks = history.tasks;
          await this.fetchTasks();
          resolve();
        },
        error: (error) => {
          reject(error);
        },
        complete: () => {
          this._historyService.status.set('');
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
      const copyTask = {...task};
      task.type = type;
      copyTask.type = type;
      // @ts-ignore
      copyTask.categories = copyTask.categories.map((category) => category.id);
      await this.updateTaskType(copyTask);
    });
  }


  public updateTaskType(task: ITask): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dataService.put(`task/${task.id}`, task)
        .subscribe({
          next: () => {
          },
          error: (err) => reject(err),
          complete: () => resolve()
        })
    });
  }


  public showHistory(): void {
    console.log(this.history);
    this.show.set(!this.show());
  }
}
