import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router, RouterModule } from '@angular/router';
import { HeaderLinkComponent } from './header-link/header-link.component';
import { AuthenticationService } from '../../core/authentication/services/authentication.service';

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

  private router = inject(Router);
  private authenticationService = inject(AuthenticationService);

  isAuthenticated = this.authenticationService.isAuthenticated;

  role = this.authenticationService.role;

  headerLinks = [
    {
      text: 'Dogs',
      url: '/dog/all'
    },
  ]

  onLogin() {
    this.router.navigateByUrl('/auth/login')
  }

  onSignup() {
    this.router.navigateByUrl('auth/signup')
  }

  onLogout() {
    this.authenticationService.logout();
  }

  goToHomePage() {
    this.router.navigateByUrl('/home');
  }
}
