import {Component, Inject} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatOption, MatSelect} from "@angular/material/select";
import {MatDivider} from "@angular/material/divider";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ICategory} from "../../../app.interface";

@Component({
  selector: 'task-dialog',
  standalone: true,
  template: `
    <form [formGroup]="form">
      <h1 mat-dialog-title>Historia</h1>
      <div mat-dialog-content class="grid grid-cols-2 gap-2">
        <mat-form-field appearance="outline">
          <input matInput placeholder="Title" formControlName="title">
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
            <mat-option [value]="0">Every day</mat-option>
            <mat-option [value]="1">Every week</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-select placeholder="Categories" multiple formControlName="categories">
            <mat-option [value]="0">New</mat-option>
            <mat-option [value]="1">Active</mat-option>
            <mat-option [value]="2">Closed</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <input matInput type="number" formControlName="minutesExpected" placeholder="Minutes expected">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <input matInput type="number" formControlName="minutesCompleted" placeholder="Minutes completed">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-select placeholder="Priority" formControlName="priority">
            <mat-option [value]="0">Low</mat-option>
            <mat-option [value]="1">Medium</mat-option>
            <mat-option [value]="2">High</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-select placeholder="Alert" formControlName="alert">
            <mat-option>Done</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div mat-dialog-actions class="!flex !justify-end">
        <button mat-stroked-button (click)="dialogRef.close()">Cerrar</button>
        <button mat-stroked-button color="primary" [mat-dialog-close]="true">Aceptar</button>
      </div>
    </form>
  `,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatFormField,
    MatInput,
    MatLabel,
    MatSelect,
    MatOption,
    MatDivider,
    ReactiveFormsModule
  ],
})
export class TaskDialogComponent {
  //------------------------
  // @ Public
  public form!: FormGroup;
  public categories: ICategory[] = []

  constructor(
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    console.log(data);
    this.buildForm();
  }


  public buildForm(): void {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      expirationDate: new FormControl('', [Validators.required]),
      type: new FormControl('', [Validators.required]),
      repeat: new FormControl('', []),
      minutesExpected: new FormControl('', [Validators.required]),
      minutesCompleted: new FormControl('', []),
      priority: new FormControl('', [Validators.required]),
      alert: new FormControl('', [Validators.required]),
      categories: new FormControl('', [Validators.required])
    })
  }


  public getCategories(): Promise<void> {
    return new Promise((resolve, reject) => {
      resolve();
    })
  }

}
