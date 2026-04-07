import { Component, inject, signal } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { HeaderLinkComponent } from './header-link/header-link.component';
import { AuthenticationStateService } from '../../core/authentication/services/authentication-state.service';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    HeaderLinkComponent,
    RouterModule
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  #authenticationStateService = inject(AuthenticationStateService);

  isAuthenticated = this.#authenticationStateService.isAuthenticated;

  role = this.#authenticationStateService.role;

  isMobileMenuOpen = signal(false);

  headerLinks = [
    {
      text: 'Dogs',
      url: '/dog/all'
    },
  ]

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(value => !value);
  }

  onLogout() {
    this.#authenticationStateService.logout();
  }
}
