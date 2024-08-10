import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserBackendService } from '../user-backend.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {



  username:string="";
  password:string="";

  loginResult:any=false;

  constructor(private userService:UserBackendService, private router:Router) {}

  verifyLogin() {
    this.userService.verifyUser(this.username, this.password).subscribe(data=>{
        this.loginResult = data;
        if (this.loginResult==true) {
            localStorage.setItem('username', this.username);
            this.router.navigate(['machines']);
        }
         
        else
          alert('login failed');
    });
  }

}
