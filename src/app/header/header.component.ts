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
  constructor(private router:Router){}

  getUser(){
    let username=localStorage.getItem('username');
    return username;
  }
  logOut(){
    localStorage.setItem('username', "");
    //window.location.href="/home";
   this.router.navigate(['home']);
  }
}
