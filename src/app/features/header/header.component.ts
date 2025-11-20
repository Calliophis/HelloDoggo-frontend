import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router, RouterModule } from '@angular/router';
import { HeaderLinkComponent } from './header-link/header-link.component';
import { AuthenticationStateService } from '../../core/authentication/services/authentication-state.service';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    HeaderLinkComponent,
    RouterModule
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  #router = inject(Router);
  #authenticationStateService = inject(AuthenticationStateService);

  isAuthenticated = this.#authenticationStateService.isAuthenticated;

  role = this.#authenticationStateService.role;

  headerLinks = [
    {
      text: 'Dogs',
      url: '/dog/all'
    },
  ]

  onLogin() {
    this.#router.navigateByUrl('/auth/login')
  }

  onSignup() {
    this.#router.navigateByUrl('auth/signup')
  }

  onLogout() {
    this.#authenticationStateService.logout();
  }

  goToHomePage() {
    this.#router.navigateByUrl('/home');
  }
}
