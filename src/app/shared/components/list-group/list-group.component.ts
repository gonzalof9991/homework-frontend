import {Component} from "@angular/core";
import {CdkDrag, CdkDropList, DragDropModule} from "@angular/cdk/drag-drop";
import {ITask} from "../../../app.interface";
import {ListGroupItemComponent} from "./list-group-item/list-group-item.component";

@Component({
  selector: 'list-group',
  standalone: true,
  imports: [
    CdkDrag,
    CdkDropList,
    ListGroupItemComponent,
    DragDropModule
  ],
  template: `

      <div class="example-container">
          <h2>{{ title }}</h2>

          <div
                  cdkDropList
                  class="example-list"
                  [cdkDropListData]="tasks"
                  (cdkDropListDropped)="drop($event)">
              @for (task of tasks; track task) {
                  <list-group-item #task [task]="task"/>
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
      name: 'tasks',
      required: true
    },
    {
      name: 'drop',
      required: true
    }
  ]
})
export class ListGroupComponent {
  //------------------------
  // @ Inputs
  public title: string = '';
  public tasks: ITask[] = [];
  public drop!: (event: any) => void;
}