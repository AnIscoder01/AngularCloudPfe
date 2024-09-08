import { Component, OnInit } from '@angular/core';
import { MachineBackendService } from '../machine-backend.service';
import { VmwareApiService } from '../vmware-api.service';
import { HttpClient } from '@angular/common/http';
import { VMParam } from '../vmparam';
import { Machine } from '../machine';

@Component({
  selector: 'app-noclonedlist',
  standalone: true,
  imports: [],
  templateUrl: './noclonedlist.component.html',
  styleUrl: './noclonedlist.component.css'
})
export class NoclonedlistComponent implements OnInit {



  constructor(private httpClient: HttpClient, private machineservice: MachineBackendService, private vmapiservice: VmwareApiService) { }


  listvm: any[] = []
  bdlist: any[] = []
  exist: boolean = true
  newlist: any[] = []
  k: any = 0

  getNameFromPath(path: string) {
    let filename = path.split('\\')[6];
    let vmName = filename.split('.')[0];
    return vmName;
  }
  onClickClone(id: string) {
    let name = prompt("Please give new Vm Name :");
    name = name == null ? "NewName" : name;
    this.showWait = true;
    this.vmapiservice.addVm(name, id).subscribe((data:any)=> {
      console.log(data);
      
      this.showWait = false;
      alert("Machine cloned successfully!");
      let desc = prompt("Please give a description (optional) :");
      desc = desc == null ? "" : desc;
      let machine: Machine = { "id": data.id, "name": name, "owner": this.username, "description": desc };
      this.machineservice.addMachine(machine).subscribe(data => {
        alert("machine data is now saved");
      })
      window.location.reload();
    });
  }
  showWait: boolean = false;
  username: string = "";

  ngOnInit(): void {
    let username = localStorage.getItem('username');

    this.username = username == null ? "" : username;





// get local machine  from api
    this.vmapiservice.getVmList().subscribe(data => {
      this.listvm = data
      //get from database
      this.machineservice.getAllMachines().subscribe(data => {

        this.bdlist = data

        // Boucle à travers les éléments de listvm
        for (let i = 0; i < this.listvm.length; i++) {
          let exist = false;

          // Boucle à travers les éléments de bdlist
          for (let j = 0; j < this.bdlist.length; j++) {
            if (this.bdlist[j].id === this.listvm[i].id) {
              exist = true;
              break; // Sortir de la boucle dès que l'élément est trouvé


            }
          }
          // Si l'élément n'existe pas dans bdlist, l'ajouter à newlist
          if (!exist) {
            this.newlist.push(this.listvm[i]);
          }





          for (let i = 0; i < this.newlist.length; i++) {
            // this.listVm[i].name = this.getNameFromPath(this.listVm[i].path);
            this.newlist[i].ip = "unknown";
            this.vmapiservice.getVmIp(this.newlist[i].id).subscribe(data => {
              this.newlist[i].ip = data.ip;
            });
            this.vmapiservice.getVmById(this.newlist[i].id).subscribe(data => {
              console.log(data);

              let retour: VMParam;
              retour = data;
              let cpu = retour.cpu.processors;
              let ram = retour.memory;
              this.newlist[i].path = this.listvm[i].name = this.getNameFromPath(this.listvm[i].path);
              this.newlist[i].cpu = cpu;
              this.newlist[i].memory = ram;

            });
          }

        }
      }, (error) =>{
 // Boucle à travers les éléments de listvm
 for (let i = 0; i < this.listvm.length; i++) {
  let exist = false;

  // Boucle à travers les éléments de bdlist
  for (let j = 0; j < this.bdlist.length; j++) {
    if (this.bdlist[j].id === this.listvm[i].id) {
      exist = true;
      break; // Sortir de la boucle dès que l'élément est trouvé


    }
  }
  // Si l'élément n'existe pas dans bdlist, l'ajouter à newlist
  if (!exist) {
    this.newlist.push(this.listvm[i]);
  }





  for (let i = 0; i < this.newlist.length; i++) {
    // this.listVm[i].name = this.getNameFromPath(this.listVm[i].path);
    this.newlist[i].ip = "unknown";
    this.vmapiservice.getVmIp(this.newlist[i].id).subscribe(data => {
      this.newlist[i].ip = data.ip;
    });
    this.vmapiservice.getVmById(this.newlist[i].id).subscribe(data => {
      console.log(data);

      let retour: VMParam;
      retour = data;
      let cpu = retour.cpu.processors;
      let ram = retour.memory;
      this.newlist[i].path = this.listvm[i].name = this.getNameFromPath(this.listvm[i].path);
      this.newlist[i].cpu = cpu;
      this.newlist[i].memory = ram;

    });
  }

}
      })


    })







  }
}