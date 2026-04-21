import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserBackendService } from '../user-backend.service';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  username = '';
  email = '';
  password = '';
  confirmPassword = '';

  constructor(
    private userService: UserBackendService,
    private router: Router
  ) {}

  register() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    const payload = {
      username: this.username,
      email: this.email,
      password: this.password,
      role: ['user']  // always user, never admin
    };

    this.userService.register(payload).subscribe({
      next: () => {
        alert('Account created successfully!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Registration failed: ' + err);
      }
    });
  }
}