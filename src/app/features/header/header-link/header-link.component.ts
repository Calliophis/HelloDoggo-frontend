import { Component, input } from '@angular/core';

@Component({
  selector: 'app-header-link',
  imports: [],
  templateUrl: './header-link.component.html'
})
export class HeaderLinkComponent {
  url = input<string>('');
  text = input<string>('');
}
