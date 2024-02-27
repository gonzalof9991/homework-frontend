import {Component, Inject} from "@angular/core";
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatFormField} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'create-history-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogClose
  ],
  template: `

    <form [formGroup]="form">
      <h1 mat-dialog-title class="font-medium text-xl">Create history</h1>
      <div mat-dialog-content class="w-full flex flex-col gap-y-4">
        <mat-form-field appearance="outline">
          <input matInput placeholder="Title" formControlName="title">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <textarea matInput placeholder="Description" formControlName="description"></textarea>
        </mat-form-field>
      </div>
      <div mat-dialog-actions class="flex justify-end items-center gap-x-2">
        <button mat-stroked-button (click)="dialogRef.close()">Cancel</button>
        <button mat-stroked-button color="primary" [disabled]="form.invalid" (click)="save()">Create
        </button>
      </div>
    </form>

  `
})
export class CreateHistoryDialogComponent {
  //------------------------
  // @ Public
  public form!: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<CreateHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', []),
    });

  }


  public save(): void {
    this.dialogRef.close({
      ...this.form.value
    });
  }
}
