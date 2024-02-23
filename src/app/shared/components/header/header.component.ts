import {Component, OnInit, signal} from "@angular/core";
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
export class HeaderComponent implements OnInit {
  //------------------------
  // @ Inputs
  public title: string = '';
  //------------------------
  // @ Public
  public theme = signal<string>('light');
  public body: HTMLBodyElement | null = null;

  ngOnInit(): void {
    this.body = document.querySelector('body');
    this.checkTheme();
  }

  public changeTheme(): void {
    this.body?.classList.remove(this.theme());
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
    this.body?.classList.add(this.theme());
    window.localStorage.setItem('theme', this.theme());
  }

  public checkTheme(): void {
    const theme = window.localStorage.getItem('theme');
    if (theme) {
      this.theme.set(theme);
      this.body?.classList.add(this.theme());
      return;
    }
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    this.theme.set(prefersDarkScheme.matches ? 'dark' : 'light');
    this.body?.classList.add(this.theme());
  }
}
