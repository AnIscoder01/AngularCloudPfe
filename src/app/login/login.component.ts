import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserBackendService } from '../user-backend.service';
import { Router, RouterLink } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {



  username:string="";
  password:string="";

  loginResult:any=false;

  constructor(private userService:UserBackendService, private router:Router) {}
verifyLogin() {
  this.userService.login(this.username, this.password).subscribe({
    next: (data) => {

      console.log("LOGIN RESPONSE:", data);

      const token = data.token || data.accessToken || data.jwt;

      // ✅ FIX HERE
      localStorage.setItem('token', token);

      localStorage.setItem('username', data.username);

      console.log("Saved token:", token);

      this.router.navigate(['machines']);
    },
    error: (err) => {
      console.error(err);
      alert('Login failed');
    }
  });
}
 
}
