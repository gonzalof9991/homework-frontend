import {Component, signal} from "@angular/core";
import {MatIcon} from "@angular/material/icon";
import {MatIconButton} from "@angular/material/button";

@Component({
  selector: 'header-generic',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton
  ],
  template: `

    <header
      class="p-3 flex justify-center items-center gap-x-4">
      <span class="text-3xl  font-bold" [innerText]="title">
      </span>
      <div [hidden]="false">
        <button mat-icon-button (click)="changeTheme()">
          <mat-icon

          >{{
              theme() === 'light' ? 'dark_mode' : 'light_mode'
            }}
          </mat-icon>
        </button>
      </div>
    </header>

  `,
  inputs: [
    {
      name: 'title',
      required: true
    }
  ]
})
export class HeaderComponent {
  //------------------------
  // @ Inputs
  public title: string = '';
  //------------------------
  // @ Public
  public theme = signal<string>('light');

  public changeTheme(): void {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
    const body = document.querySelector('body');
    body?.classList.toggle('dark');
  }
}
