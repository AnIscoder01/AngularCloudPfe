import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  constructor(private router: Router) {}

  getUser(): string {
    return localStorage.getItem('username') ?? '';
  }

  isAdmin(): boolean {
    try {
      const roles: string[] = JSON.parse(localStorage.getItem('roles') || '[]');
      return roles.includes('ROLE_ADMIN');
    } catch {
      return false;
    }
  }

  isLoggedIn(): boolean {
    return this.getUser() !== '' && this.getUser() !== null;
  }

  logOut() {
    localStorage.clear(); // ← clear everything including roles and token
    this.router.navigate(['home']);
  }
}