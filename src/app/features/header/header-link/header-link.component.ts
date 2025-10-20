import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header-link',
  imports: [RouterLink],
  templateUrl: './header-link.component.html'
})
export class HeaderLinkComponent {
  url = input<string>('');
  text = input<string>('');
}
