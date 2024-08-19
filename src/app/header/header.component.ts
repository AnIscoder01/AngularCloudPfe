import { Component } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule,MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  getUser(){
    let username=localStorage.getItem('username');
    return username;
  }
  logOut(){
    localStorage.setItem('username', "");
    window.location.reload();
  }
}
