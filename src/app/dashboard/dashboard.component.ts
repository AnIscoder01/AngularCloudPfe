import { Component, OnInit } from '@angular/core';
import { MachineBackendService } from '../machine-backend.service';
import { VmwareApiService } from '../vmware-api.service';
import { UserBackendService } from '../user-backend.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

nbrmachines=0;
nbrusers=0;

constructor (private machineservice:MachineBackendService,private vmservice:VmwareApiService, private usersservice:UserBackendService){}

getUser(){
  let username=localStorage.getItem("username");
  return username;
}



ngOnInit(){

this.machineservice.getMachinesNumber().subscribe(data=>{
  console.log(data)
  this.nbrmachines=data;
})

this.usersservice.getUsersNumber().subscribe(data=>{

  this.nbrusers=data;
})



}
}
