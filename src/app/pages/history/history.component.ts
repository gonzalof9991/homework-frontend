import {Component, inject, OnInit} from "@angular/core";
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
import {TaskListComponent} from "./task-list/task-list.component";
import {TaskCreateComponent} from "./task-create/task-create.component";

@Component({
  selector: 'history',
  standalone: true,
  imports: [
    CdkDropListGroup, CdkDropList, DragDropModule, TaskListComponent, TaskCreateComponent,
  ],
  inputs: [
    {
      name: 'history',
      required: true
    }
  ],
  template: `

    @defer {
      <div class="flex w-full justify-center gap-x-4 my-10">
        <!-- Pending open/closed date options -->

        <div class="flex flex-col justify-center gap-y-2 items-center">
          <div class="flex p-3  text-center bg-gray-200 h-max">

            {{ history?.title }}

          </div>
          <task-create [history]="history"/>
        </div>
        <div cdkDropListGroup>
          <task-list [tasks]="new" [title]="'New'" [drop]="drop"/>
          <task-list [tasks]="active" [title]="'Active'" [drop]="drop"/>
          <task-list [tasks]="closed" [title]="'Closed'" [drop]="drop"/>
        </div>
      </div>
    } @placeholder (minimum 1000ms) {
      <div class="flex justify-center animate-pulse gap-x-4 my-10">

        @for (item of [1, 2, 3]; track [1, 2, 3]) {
          <div class="w-[400px] h-[200px] rounded bg-slate-200">

          </div>
        }
      </div>
    }

  `
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
  //------------------------
  // @ Private
  private _dataService = inject(DataService);

  async ngOnInit() {
    await this.getTasks();
  }

  public getTasks(): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = this.history?.tasks || [];
      this.new = data.filter((task) => task.type === 0);
      this.active = data.filter((task) => task.type === 1);
      this.closed = data.filter((task) => task.type === 2);
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
      this.filterTasks(event);
    }
  }


  public filterTasks(event: CdkDragDrop<ITask[]>): void {
    const typeClass = event.container.element.nativeElement.classList[1];
    const type = typeClass === 'New' ? 0 : typeClass === 'Active' ? 1 : 2;
    const tasks = event.container.data.filter((task) => task.type !== type);
    tasks.forEach(async (task) => {
      const copyTask = {...task};
      task.type = type;
      copyTask.type = type;
      // @ts-ignore
      copyTask.categories = copyTask.categories.map((category) => category.id);
      await this.updateTask(copyTask);
    });
  }


  public updateTask(task: ITask): Promise<void> {
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
}
