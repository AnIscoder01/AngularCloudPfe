import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { VmwareApiService } from '../vmware-api.service';
import { VMParam } from '../vmparam';

@Component({
  selector: 'app-edit-vm',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './edit-vm.component.html',
  styleUrl: './edit-vm.component.css'
})
export class EditVmComponent implements OnInit{
 
  id:string="";
  cpu:number=0;
  memory:number=0;

  constructor(private routedUrl:ActivatedRoute, private apiService:VmwareApiService, private router:Router){}

  ngOnInit(): void {
      this.routedUrl.queryParams.subscribe(params=>{
          this.id = params?.['id'];
      });

      this.apiService.getVmById(this.id).subscribe(data=>{
        let retour:VMParam = data;
        this.id = retour.id;
        this.memory = retour.memory; 
        this.cpu = retour.cpu.processors;     
      });
  }

  save() {

    this.apiService.updateVm(this.id, this.cpu, this.memory).subscribe(data=>{
      alert('machine updated successfully !');
      this.router.navigate(['machines']);
    });

  }
}
