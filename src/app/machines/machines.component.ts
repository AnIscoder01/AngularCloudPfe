import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { VmwareApiService } from '../vmware-api.service';
import { MachineBackendService } from '../machine-backend.service';
import { Machine } from '../machine';
import { VMParam } from '../vmparam';

@Component({
  selector: 'app-machines',
  standalone: true,
  imports: [],
  templateUrl: './machines.component.html',
  styleUrl: './machines.component.css'
})
export class MachinesComponent implements OnInit {

  listVm: any[] = [];
  showWait = false;
  username = '';

  constructor(
    private router: Router,
    private vmApiService: VmwareApiService,
    private machineService: MachineBackendService
  ) {}

  get poweredOnCount()  { return this.listVm.filter(v => v.powerState === 'poweredOn').length; }
  get poweredOffCount() { return this.listVm.filter(v => v.powerState !== 'poweredOn').length; }
  get totalRamGb()      { return Math.round(this.listVm.reduce((s, v) => s + (v.memory || 0), 0) / 1024); }

  onClickDelete(id: string) {
    if (!confirm('Are you sure you want to delete this VM?')) return;
    this.showWait = true;
    this.vmApiService.deleteVm(id).subscribe({
      next: () => {
        this.showWait = false;
        alert('Machine deleted successfully!');
        window.location.reload();
      },
      error: () => {
        this.showWait = false;
        alert('Error deleting VM.');
      }
    });
  }
  vmName(path: string): string {
  if (!path) return 'Unknown';
  const parts = path.replace(/\\/g, '/').split('/');
  const file = parts[parts.length - 1];
  return file.replace('.vmx', '');
}
  onClickEdit(id: string) {
    this.router.navigateByUrl('/edit?id=' + id);
  }

  onClickClone(id: string) {
    let name = prompt('Please give new VM name:') ?? 'NewName';
    this.showWait = true;

    this.vmApiService.addVm(name, id).subscribe({
      next: (data: any) => {
        this.showWait = false;
        alert('Machine cloned successfully!');

        let desc = prompt('Please give a description (optional):') ?? '';

        const machine: Machine = { id: data.id, name, description: desc };

        this.machineService.addMachine(machine).subscribe({
          next: () => alert('Machine data is now saved.'),
          error: () => alert('Error saving machine data.')
        });

        window.location.reload();
      },
      error: () => {
        this.showWait = false;
        alert('Error cloning VM.');
      }
    });
  }
onClickPowerOn(id: string) {
  this.showWait = true;
  this.vmApiService.powerVmOn(id).subscribe({
    next: () => {
      this.showWait = false;
      const vm = this.listVm.find(v => v.id === id);
      if (vm) {
        vm.powerState = 'poweredOn';
        vm.ip = 'Booting...';

        // poll for IP every 10 seconds up to 2 minutes
        let attempts = 0;
        const maxAttempts = 12;
        const interval = setInterval(() => {
          attempts++;
          this.vmApiService.getVmIp(id).subscribe({
            next: (d: any) => {
              if (d.ip) {
                vm.ip = d.ip;
                clearInterval(interval); // ← stop polling once we have IP
              }
            },
            error: () => {
              vm.ip = attempts >= maxAttempts ? 'Unavailable' : 'Booting...';
              if (attempts >= maxAttempts) clearInterval(interval);
            }
          });
        }, 10000); // check every 10 seconds
      }
    },
    error: () => {
      this.showWait = false;
      alert('Error powering on VM.');
    }
  });
}

onClickPowerOff(id: string) {
  if (!confirm('Are you sure you want to power off this VM?')) return;
  this.showWait = true;
  this.vmApiService.powerVmOff(id).subscribe({
    next: () => {
      this.showWait = false;
      const vm = this.listVm.find(v => v.id === id);
      if (vm) {
        vm.powerState = 'powered-off';
        vm.ip = 'Powered Off';
      }
    },
    error: () => {
      this.showWait = false;
      alert('Error powering off VM.');
    }
  });
}
 ngOnInit(): void {
  const username = localStorage.getItem('username');
  if (!username) { this.router.navigate(['login']); return; }
  this.username = username;

  // ✅ get only THIS user's machines from DB
  this.machineService.getMyMachines().subscribe({
    next: (myMachines: any[]) => {

      this.listVm = myMachines;

      // enrich each with VMware live data
      this.listVm.forEach(vm => {
        vm.ip = 'Powered Off';
        vm.powerState = 'powered-off';
        vm.cpu = null;
        vm.memory = null;

        this.vmApiService.getVmPowerState(vm.id).subscribe({
          next: (d: any) => { vm.powerState = d.power_state; },
          error: () => { vm.powerState = 'unknown'; }
        });

        this.vmApiService.getVmIp(vm.id).subscribe({
          next: (d: any) => { vm.ip = d.ip ?? 'N/A'; },
          error: (err: string) => {
            vm.ip = err.includes('409') ? 'Powered Off' : 'Unavailable';
          }
        });

        this.vmApiService.getVmById(vm.id).subscribe({
          next: (d: VMParam) => {
            vm.cpu = d.cpu.processors;
            vm.memory = d.memory;
          },
          error: () => { vm.cpu = 'N/A'; vm.memory = 'N/A'; }
        });
      });
    },
    error: () => console.error('Failed to load user machines')
  });
}
}