import {Component} from "@angular/core";

@Component({
  selector: 'header-generic',
  standalone: true,
  imports: [],
  template: `

    <header class="p-3 bg-white text-center shadow">
      <span class="text-3xl text-primary font-bold" [innerText]="title">
      </span>
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
}
