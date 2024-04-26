import {Component, inject} from "@angular/core";
import {MatIcon} from "@angular/material/icon";
import {MatButton} from "@angular/material/button";
import {MatDialog} from "@angular/material/dialog";
import {DialogCategoryComponent} from "./dialog-category/dialog-category.component";

@Component({
  selector: 'category',
  standalone: true,
  template: `
    <button mat-stroked-button (click)="open()">
      <mat-icon>add</mat-icon>
      <span>New categories</span>
    </button>
  `,
  imports: [
    MatIcon,
    MatButton
  ]
})
export class CategoryComponent {

  //------------------------
  // @ Private
  private _dialog = inject(MatDialog);


  public open(): void {
    const dialogRef = this._dialog.open(DialogCategoryComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe({
      next: (result: any) => {

      }
    });
  }

}
