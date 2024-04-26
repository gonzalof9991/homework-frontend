import {inject, Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  private _snackbar = inject(MatSnackBar);


  open(message: string, action: string = '', duration: number = 5000, error: boolean = false) {
    const text = error ? `🔴 ${message}` : `🟢 ${message}`;
    this._snackbar.open(text, action, {
      duration
    });
  }
}
