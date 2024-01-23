import {Component} from "@angular/core";
import {ITask} from "../../../../app.interface";
import {CdkDrag} from "@angular/cdk/drag-drop";

@Component({
  selector: 'list-group-item',
  standalone: true,
  imports: [
    CdkDrag
  ],
  template: `

    <div class="example-box" cdkDrag>
      <span>
        {{ task.title }}
      </span>
      @for (category of task.categories; track category) {
        <span class="px-2 w-max py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-bold">
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
