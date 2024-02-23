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
            @for (keyword of keywords; track keyword) {
              <mat-chip-row (removed)="removeKeyword(keyword)">
                {{ keyword }}
                <button matChipRemove aria-label="'remove ' + keyword">
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
  public keywords: string[] = [];
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
    console.log(data);
  }

  async ngOnInit() {
    await this._getCategories();
  }

  public async removeKeyword(keyword: string) {
    const index = this.keywords.indexOf(keyword);
    if (index >= 0) {
      this.keywords.splice(index, 1);

      await this.announcer.announce(`removed ${keyword}`);
    }
  }

  public async add(event: MatChipInputEvent): Promise<void> {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.push(value);
      await this._createCategory(value);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  private _getCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dataService.get<any[]>('categories').subscribe({
        next: (categories) => {
          categories.forEach((category) => {
            this.keywords.push(category.name);
          });
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
}
