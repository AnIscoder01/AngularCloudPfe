import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MachinesComponent } from './machines/machines.component';
import { ElementSchemaRegistry } from '@angular/compiler';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'cni-app';

  constructor(private router:Router) {

  }

  ngOnInit(): void {
      let username=localStorage.getItem('username');
      if (username == null)
        this.router.navigate(['login']);
      else
        this.router.navigate(['machines']);
  }
}
