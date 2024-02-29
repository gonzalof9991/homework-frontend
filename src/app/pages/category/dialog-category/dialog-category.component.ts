import {Component, inject, Inject, OnInit} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {DataService} from "../../../shared/services/data.service";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {NgIf} from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatDivider} from "@angular/material/divider";
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {ICategory} from "../../../app.interface";

@Component({
  selector: 'dialog-category',
  standalone: true,
  imports: [
    MatFormField,
    MatInput,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    NgIf,
    ReactiveFormsModule,
    MatDivider,
    MatChipGrid,
    MatChipInput,
    MatIcon,
    MatChipRemove,
    MatChipRow,
    MatLabel
  ],
  template: `
    <div>
      <span mat-dialog-title>
          Detail categories
      </span>
      <div mat-dialog-content>
        <mat-form-field class="w-full">
          <mat-label>Categories</mat-label>
          <mat-chip-grid #chipGrid aria-label="Enter keywords" [formControl]="formControl">
            @for (category of categories; track categories) {
              <mat-chip-row (removed)="removeCategory(category)">
                {{ category.name }}
                <button matChipRemove aria-label="'remove ' + category">
                  <mat-icon>cancel</mat-icon>
                </button>
              </mat-chip-row>
            }
          </mat-chip-grid>
          <input placeholder="New category..."
                 [matChipInputFor]="chipGrid"
                 (matChipInputTokenEnd)="add($event)"/>
        </mat-form-field>
      </div>
      <div mat-dialog-actions class="!flex !justify-end">
        <button mat-stroked-button
                (click)="dialogRef.close()">
          Close
        </button>
      </div>
    </div>
  `
})
export class DialogCategoryComponent implements OnInit {
  //------------------------
  // @ Public
  public categories: ICategory[] = [];
  public formControl = new FormControl([]);
  public form!: FormGroup;
  public announcer = inject(LiveAnnouncer);
  //------------------------
  // @ Private
  private _dataService = inject(DataService);

  constructor(
    public dialogRef: MatDialogRef<DialogCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = new FormGroup({});
  }

  async ngOnInit() {
    await this._getCategories();
  }

  public async removeCategory(category: ICategory) {
    const index = this.categories.indexOf(category);
    if (index >= 0) {
      await this._deleteCategory(category.id);
      this.categories.splice(index, 1);
      await this.announcer.announce(`removed ${category.name}`);
    }
  }

  public async add(event: MatChipInputEvent): Promise<void> {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.categories.push({id: 0, name: value} as ICategory);
      await this._createCategory(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  private _getCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dataService.get<ICategory[]>('categories').subscribe({
        next: (categories) => {
          this.categories = categories;
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  private _createCategory(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dataService.post('category', {name: name}).subscribe({
        next: (category) => {
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }

  private _deleteCategory(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dataService.delete(`category/${id}`).subscribe({
        next: (category) => {
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
}
