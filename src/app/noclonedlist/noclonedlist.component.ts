import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VmwareApiService } from '../vmware-api.service';
import { MachineBackendService } from '../machine-backend.service';
import { UserBackendService } from '../user-backend.service';
import { Machine } from '../machine';
import { VMParam } from '../vmparam';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-noclonedlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noclonedlist.component.html',
  styleUrl: './noclonedlist.component.css'
})
export class NoclonedlistComponent implements OnInit {

  templates: any[] = [];      // from DB — official templates
  newlist: any[] = [];        // enriched with VMware live data
  showUpgradeModal = false;
  showWait = false;
  username = '';

  constructor(
    private machineservice: MachineBackendService,
    private vmapiservice: VmwareApiService,
    private userService: UserBackendService,
    private http: HttpClient
  ) {}

  get poweredOnCount() { return this.newlist.filter(v => v.powerState === 'poweredOn').length; }
  get poweredOffCount() { return this.newlist.filter(v => v.powerState !== 'poweredOn').length; }

  vmName(path: string): string {
    if (!path) return 'Unknown';
    const parts = path.replace(/\\/g, '/').split('/');
    return parts[parts.length - 1].replace('.vmx', '');
  }

  onClickClone(id: string, templateName: string, sshUser: string) {
    let name = prompt("Please give new VM name:") ?? "NewName";
    this.showWait = true;

    this.vmapiservice.addVm(name, id).subscribe({
      next: (data: any) => {
        this.showWait = false;
        alert("Machine cloned successfully!");

        let desc = prompt("Please give a description (optional):") ?? "";

        const machine: Machine = {
          id: data.id,
          name,
          description: desc
        };

        this.machineservice.addMachine(machine).subscribe({
          next: () => alert("Machine saved. You can now access it from My VMs."),
          error: () => alert("Error saving machine data.")
        });

        window.location.reload();
      },
      error: (err: any) => {
        this.showWait = false;
        if (err.status === 403) {
          this.showUpgradeModal = true;
        } else {
          alert("Error cloning VM. Please try again.");
        }
      }
    });
  }

  onClickUpgrade() {
    this.showUpgradeModal = false;
    this.userService.createCheckout().subscribe({
      next: (data: any) => { window.location.href = data.url; },
      error: () => alert('Error creating checkout session.')
    });
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? '';

    // ✅ fetch only registered templates from DB
    this.http.get<any[]>('/api/templates').subscribe({
      next: (templates) => {
        this.templates = templates;
        this.newlist = templates.map(t => ({
          ...t,
          ip: 'Powered Off',
          powerState: 'powered-off',
          cpu: null,
          memory: null
        }));

        // enrich with live VMware data 
        this.newlist.forEach(vm => {
          this.vmapiservice.getVmPowerState(vm.id).subscribe({
            next: (d: any) => { vm.powerState = d.power_state; },
            error: () => { vm.powerState = 'unknown'; }
          });

          this.vmapiservice.getVmIp(vm.id).subscribe({
            next: (d: any) => { vm.ip = d.ip ?? 'N/A'; },
            error: () => { vm.ip = 'Powered Off'; }
          });

          this.vmapiservice.getVmById(vm.id).subscribe({
            next: (d: VMParam) => {
              vm.cpu = d.cpu.processors;
              vm.memory = d.memory;
            },
            error: () => { vm.cpu = 'N/A'; vm.memory = 'N/A'; }
          });
        });
      },
      error: () => console.error('Failed to load templates')
    });
  }
}