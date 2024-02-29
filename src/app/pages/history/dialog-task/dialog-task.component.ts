import {Component, inject, Inject, OnInit, signal} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose, MatDialogContainer,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDivider} from "@angular/material/divider";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import type {ICategory, ITask} from "../../../app.interface";
import {
  MatDatepickerModule
} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {DataService} from "../../../shared/services/data.service";
import moment from "moment";
import {NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'dialog-category-task',
  standalone: true,
  template: `

    <form [hidden]="hideContent()" [formGroup]="form">
      <h1 mat-dialog-title class="font-medium text-xl">{{
          data.type === 'create' ? 'Create' : 'View'
        }}</h1>
      <div mat-dialog-content class="grid grid-cols-3 gap-4">
        <mat-form-field appearance="outline">
          <input matInput placeholder="Title" formControlName="title">
        </mat-form-field>
        <!-- Date -->
        <mat-form-field appearance="outline">
          <input matInput [matDatepicker]="picker" formControlName="expiration_date" placeholder="Expiration date">
          <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-select placeholder="Type" formControlName="type">
            <mat-option [value]="0">New</mat-option>
            <mat-option [value]="1">Active</mat-option>
            <mat-option [value]="2">Closed</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-select placeholder="Repeat" formControlName="repeat">
            <mat-option [value]="0">None</mat-option>
            <mat-option [value]="1">Every day</mat-option>
            <mat-option [value]="2">Every week</mat-option>
            <mat-option [value]="3">Every month</mat-option>
          </mat-select>
        </mat-form-field>
        <!-- Categories -->
        <mat-form-field appearance="outline">
          <mat-select placeholder="Categories" multiple formControlName="categories">
            @for (category of categories; track category.id) {
              <mat-option [value]="category.id">{{ category.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-select placeholder="Priority" formControlName="priority">
            <mat-option [value]="0">Low</mat-option>
            <mat-option [value]="1">Medium</mat-option>
            <mat-option [value]="2">High</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <input matInput type="number" formControlName="minutes_expected" placeholder="Minutes expected">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <input matInput type="number" formControlName="minutes_completed" placeholder="Minutes completed">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-select placeholder="Alert" formControlName="alert_id">
            <mat-option [value]="1">Type 1</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div mat-dialog-actions class="!flex !justify-end">
        <button mat-stroked-button
                (click)="dialogRef.close()">
          Cancel
        </button>
        <button mat-stroked-button color="warn"
                *ngIf="['view'].includes(data.type)"
                (click)="save('delete')"
        >
          Delete
        </button>
        <button *ngIf="data.type === 'create'" mat-stroked-button color="primary"
                [disabled]="!form.valid"
                (click)="save('create')">
          Create
        </button>
        <button *ngIf="data.type === 'view'" mat-stroked-button color="primary"
                [disabled]="!form.valid"
                (click)="save('update')"
        >
          Update
        </button>

      </div>
    </form>
    <div *ngIf="hideContent()" class="flex justify-center my-8">
      <mat-spinner></mat-spinner>
    </div>
  `,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatDivider,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    NgIf,
    MatDialogContainer,
    MatProgressSpinner
  ]
})
export class DialogTaskComponent implements OnInit {
  //------------------------
  // @ Public
  public form!: FormGroup;
  public categories: ICategory[] = [];
  public hideContent = signal<boolean>(true);
  //------------------------
  // @ Private
  private _dataService = inject(DataService);

  constructor(
    public dialogRef: MatDialogRef<DialogTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.buildForm();
  }


  async ngOnInit() {
    await this.getCategories();
    await this.getAlerts();

    if (this.data.type === 'view') {
      this.loadForm(this.data.task)
    }
    setTimeout(() => {
      this.hideContent.set(false);
    }, 900);
  }


  public buildForm(): void {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      expiration_date: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      repeat: new FormControl('', []),
      description: new FormControl('', []),
      minutes_expected: new FormControl('', [Validators.required]),
      minutes_completed: new FormControl(null, []),
      priority: new FormControl('', [Validators.required]),
      alert_id: new FormControl('', [Validators.required]),
      categories: new FormControl('', [Validators.required])
    })
  }


  public loadForm(task: ITask): void {
    this.form.patchValue(task);
    this.form.get('categories')?.patchValue(task.categories.map((category) => category.id));
  }


  public save(type: string): void {
    this.dialogRef.close({
      type,
      task: {
        ...this.form.value,
        expiration_date: moment(this.form.value.expiration_date).format('YYYY-MM-DD')
      }
    })
  }


  public getCategories(): Promise<void> {
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
    })
  }


  public getAlerts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._dataService.get<any[]>('alert').subscribe({
        next: (alerts) => {
          resolve();
        },
        error: (error) => {
          reject(error);
        }
      })
    });
  }

}
