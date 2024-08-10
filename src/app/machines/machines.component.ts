import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { VMParam } from '../vmparam';
import { Router } from '@angular/router';
import { VmwareApiService } from '../vmware-api.service';
import { MachineBackendService } from '../machine-backend.service';
import { Machine } from '../machine';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [],
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.css'
})
export class MachinesComponent implements OnInit{

  
  listVm: any[]=[];
  showWait:boolean=false;
  username:string="";

  
  constructor(private httpClient:HttpClient, private router:Router, private vmApiService:VmwareApiService, private machineService:MachineBackendService){}

  
  getNameFromPath(path:string) {
    let filename = path.split('\\')[6];
    let vmName = filename.split('.')[0];
    return vmName;
  }

 

    onClickDelete(id:string) {
      this.showWait=true;
        this.vmApiService.deleteVm(id).subscribe(data=>{
            this.showWait=false;
             alert("Machine deleted successfully!");
             window.location.reload();
        });
    }

    onClickEdit(id:string) {
      this.router.navigateByUrl('/edit?id='+id);
  }

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

      let username=localStorage.getItem('username');
      if (username == null)
        this.router.navigate(['login']);      

      this.username = username==null?"":username;
      alert(this.username);
      this.machineService.getMachinesByOwner(this.username).subscribe(data=>{
        this.listVm = data;

        for (let i=0; i<this.listVm.length; i++) {
            // this.listVm[i].name = this.getNameFromPath(this.listVm[i].path);
            this.listVm[i].ip="unknown";
            this.vmApiService.getVmIp(this.listVm[i].id).subscribe(data=>{
              this.listVm[i].ip=data.ip;
            });
           this.vmApiService.getVmById(this.listVm[i].id).subscribe(data=>{
                let retour:VMParam;
                retour = data;
                let cpu = retour.cpu.processors;
                let ram = retour.memory;
                this.listVm[i].cpu = cpu;
                this.listVm[i].memory = ram;
                
            });

            
        }
      })
      
  }

}
