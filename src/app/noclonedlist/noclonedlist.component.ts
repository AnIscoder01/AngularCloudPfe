import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineBackendService } from '../machine-backend.service';
import { VmwareApiService } from '../vmware-api.service';
import { Machine } from '../machine';
import { VMParam } from '../vmparam';

@Component({
  selector: 'app-noclonedlist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noclonedlist.component.html',
  styleUrl: './noclonedlist.component.css'
})
export class NoclonedlistComponent implements OnInit {

  listvm: any[] = [];
  bdlist: any[] = [];
  newlist: any[] = [];

  showWait = false;
  username = "";

  constructor(
    private machineservice: MachineBackendService,
    private vmapiservice: VmwareApiService
  ) {}

  // ── computed getters for stats row ──────────────────────────
  get poweredOnCount(): number {
    return this.newlist.filter(v => v.powerState === 'poweredOn').length;
  }

  get poweredOffCount(): number {
    return this.newlist.filter(v => v.powerState !== 'poweredOn').length;
  }

  vmName(path: string): string {
    if (!path) return 'Unknown';
    const parts = path.replace(/\\/g, '/').split('/');
    const file = parts[parts.length - 1];
    return file.replace('.vmx', '');
  }
  // ────────────────────────────────────────────────────────────

  onClickClone(id: string) {
    let name = prompt("Please give new VM name:") ?? "NewName";
    this.showWait = true;

    this.vmapiservice.addVm(name, id).subscribe({
      next: (data: any) => {
        this.showWait = false;
        alert("Machine cloned successfully!");

        let desc = prompt("Please give a description (optional):") ?? "";

        const machine: Machine = {
          id: data.id,
          name: name,
          description: desc
        };

        this.machineservice.addMachine(machine).subscribe({
          next: () => alert("Machine data is now saved."),
          error: () => alert("Error saving machine data.")
        });

        window.location.reload();
      },
      error: () => {
        this.showWait = false;
        alert("Error cloning VM. Please try again.");
      }
    });
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? "";

    this.vmapiservice.getVmList().subscribe({
      next: vms => {
        this.listvm = vms;

        this.machineservice.getAllMachines().subscribe({
          next: bd => {
            this.bdlist = bd;

            // filter only VMs not yet saved in DB
            this.newlist = this.listvm.filter(vm =>
              !this.bdlist.some(b => b.id === vm.id)
            );

            // enrich each VM with details
            this.newlist.forEach(vm => {
              vm.ip = 'Powered Off';
              vm.powerState = 'powered-off';
              vm.cpu = null;
              vm.memory = null;

              // power state
              this.vmapiservice.getVmPowerState(vm.id).subscribe({
                next: (d: any) => {
                  vm.powerState = d.power_state;
                },
                error: () => {
                  vm.powerState = 'unknown';
                }
              });

              // IP — 409 = VM is off
              this.vmapiservice.getVmIp(vm.id).subscribe({
                next: (d: any) => {
                  vm.ip = d.ip ?? 'N/A';
                },
                error: (err: string) => {
                  vm.ip = err.includes('409') ? 'Powered Off' : 'Unavailable';
                }
              });

              // CPU and memory
              this.vmapiservice.getVmById(vm.id).subscribe({
                next: (d: VMParam) => {
                  vm.cpu = d.cpu.processors;
                  vm.memory = d.memory;
                },
                error: () => {
                  vm.cpu = 'N/A';
                  vm.memory = 'N/A';
                }
              });
            });
          },
          error: () => console.error('Failed to load machines from DB')
        });
      },
      error: () => console.error('Failed to load VM list from VMware')
    });
  }
}