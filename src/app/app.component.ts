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
  public tasks: ITask[] = [];
  public progress: ITask[] = [];
  public done: ITask[] = [];
  public skeletons: number[] = [1, 2, 3];
  //------------------------
  // @ Private
  private _dataService = inject(DataService);

  ngOnInit() {
    this._dataService.get<ITask[]>('tasks').subscribe((data) => {
      console.log(data);
      this.tasks = data;
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
  }
}
