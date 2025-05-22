import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { Router } from '@angular/router';
import { HeaderLinkComponent } from '../header-link/header-link.component';
import { AuthService } from '../auth/service/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    ButtonModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    HeaderLinkComponent
  ],
  templateUrl: './header.component.html'
})
export class HeaderComponent {

  private router = inject(Router);
  private authService = inject(AuthService);

  isAuthenticated = this.authService.isAuthenticated;

  headerLinks = [
    {
      text: 'Home',
      url: '/home'
    },
    {
      text: 'Adopt',
      url: '/dogs'
    },
    {
      text: 'Volunteer',
      url: '/volunteer'
    },
    {
      text: 'About us',
      url: '/about'
    },
    {
      text: 'Contact',
      url: '/contact'
    }
  ]

  onLogin() {
    this.router.navigateByUrl('/auth/login')
  }

  onSignup() {
    this.router.navigateByUrl('auth/signup')
  }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('');
  }
}
