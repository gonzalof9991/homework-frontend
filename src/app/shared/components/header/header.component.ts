import {Component} from "@angular/core";

@Component({
  selector: 'header-generic',
  standalone: true,
  imports: [],
  template: `

    <header class="p-3 bg-white text-center shadow">
      <span class="text-2xl text-primary font-medium">
            Homework's
      </span>
    </header>

  `
})
export class HeaderComponent {
}
