import {Component} from "@angular/core";
import {CdkDrag, CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";
import {ITask} from "../../../app.interface";
import {ItemTaskComponent} from "./item-task/item-task.component";

@Component({
  selector: 'list-task',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    DragDropModule,
    ItemTaskComponent
  ],
  template: `

    <div class="example-container">
      <h2>{{ title }}</h2>

      <div
        cdkDropList
        [class]="'example-list ' + title"
        [cdkDropListData]="tasks"
        (cdkDropListDropped)="drop($event)">
        @for (task of tasks; track task) {
          <item-task #task [task]="task" [historyTitle]="historyTitle"/>
        } @empty {
          <div class="flex justify-center  my-4">
                      <span class="w-max border bg-gray-50 text-gray-800 p-1 text-sm rounded border-gray-800">
                        No tasks
                      </span>
          </div>
        }
      </div>
    </div>

  `,
  inputs: [
    {
      name: 'title',
      required: true
    },
    {
      name: 'historyTitle',
      required: true
    },
    {
      name: 'tasks',
      required: true
    },
    {
      name: 'drop',
      required: true
    }
  ]
})
export class ListTaskComponent {
  //------------------------
  // @ Inputs
  public title: string = '';
  public historyTitle: string = '';
  public tasks: ITask[] = [];
  public drop!: (event: any) => void;
}
