import { Component, OnInit } from '@angular/core';
import { VmwareApiService } from '../vmware-api.service';
import { Machine } from '../machine';
import { MachineBackendService } from '../machine-backend.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listvm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listvm.component.html',
  styleUrl: './listvm.component.css'
})
export class ListvmComponent implements OnInit {

  listvm: any[] = [];
  showWait = false;
  username = '';

  constructor(
    private vmApiService: VmwareApiService,
    private machineService: MachineBackendService
  ) {}

  // ── getters instead of pipes ─────────────────────────────
  get claimedCount()   { return this.listvm.filter(v => v.isClaimed).length; }
  get availableCount() { return this.listvm.filter(v => !v.isClaimed).length; }
  // ─────────────────────────────────────────────────────────

  vmName(path: string): string {
    if (!path) return 'Unknown';
    const parts = path.replace(/\\/g, '/').split('/');
    return parts[parts.length - 1].replace('.vmx', '');
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

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? '';

    this.vmApiService.getVmList().subscribe({
      next: (vmList: any[]) => {  // ← explicit any[] type

        this.machineService.getAllMachines().subscribe({
          next: (dbMachines: any[]) => {

            this.listvm = vmList.map((vm: any) => {  // ← explicit any type
              const match = dbMachines.find((m: any) => m.id === vm.id);
              return {
                ...vm,
                clonedBy: match?.owner?.username ?? null,
                description: match?.description ?? null,
                isClaimed: !!match
              };
            });
          },
          error: () => console.error('Failed to load DB machines')
        });
      },
      error: () => console.error('Failed to load VM list')
    });
  }
}