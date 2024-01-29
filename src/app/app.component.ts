import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {MatButton} from "@angular/material/button";
import {HeaderComponent} from "./shared/components/header/header.component";
import {DataService} from "./shared/services/data.service";
import {
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  DragDropModule,
  moveItemInArray,
  transferArrayItem
} from "@angular/cdk/drag-drop";
import {ITask} from "./app.interface";
import {ListGroupComponent} from "./shared/components/list-group/list-group.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButton, HeaderComponent, CdkDropListGroup, CdkDropList, DragDropModule, ListGroupComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'frontend';
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
      this._dataService.get<ITask[]>('tasks').subscribe({
        next: (data) => {
          this.new = data.filter((task) => task.type === 0);
          this.active = data.filter((task) => task.type === 1);
          this.closed = data.filter((task) => task.type === 2);
        },
        error: (err) => reject(err),
        complete: () => resolve()
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
    }
    this.filterTasks(event);
    // Improve performance to update only the task that was moved
    this.getTasks();
  }


  public filterTasks(event: CdkDragDrop<ITask[]>): void {
    const type = event.container.id === 'cdk-drop-list-0' ? 0 : event.container.id === 'cdk-drop-list-1' ? 1 : 2;
    const tasks = event.container.data.filter((task) => task.type !== type);
    console.log('init')
    tasks.forEach(async (task) => {
      task.type = type;
      // @ts-ignore
      task.categories = task.categories.map((category) => category.id);
      await this.updateTask(task);
    });
    console.log('end')
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
