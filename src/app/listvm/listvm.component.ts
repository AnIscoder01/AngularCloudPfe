import { Component, OnInit } from '@angular/core';
import { VmwareApiService } from '../vmware-api.service';
import { Machine } from '../machine';
import { MachineBackendService } from '../machine-backend.service';

@Component({
  selector: 'app-listvm',
  standalone: true,
  imports: [],
  templateUrl: './listvm.component.html',
  styleUrl: './listvm.component.css'
})
export class ListvmComponent implements OnInit {
  listvm:any[]=[]
  showWait=false
  username:string="";

  


  constructor(private vmservice:VmwareApiService,private vmApiService:VmwareApiService,private machineService:MachineBackendService){}
  
 
  onClickClone(id:string) {
    let name = prompt("Please give new Vm Name :") ;
    name = name==null ? "NewName" : name;
    this.showWait=true;
    this.vmApiService.addVm(name, id).subscribe(data=>{
         this.showWait=false;
         alert("Machine cloned successfully!");
         let desc = prompt("Please give a description (optional) :") ;
         desc = desc==null ? "" : desc;
         let machine:Machine={"id":id, "name":name, "owner":this.username, "description":desc};
         this.machineService.addMachine(machine).subscribe(data=>{
            alert("machine data is now saved");
         })
         window.location.reload();
    });
}


ngOnInit(): void {

  this.vmApiService.getVmList().subscribe(data=>{
    this.listvm=data
    console.log(this.listvm);
    
  })



}


}
