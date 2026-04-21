import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MachineBackendService } from '../machine-backend.service';
import { VmwareApiService } from '../vmware-api.service';
import { UserBackendService } from '../user-backend.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  nbrmachines: number = 0;
  nbrusers: number = 0;
  isAdmin: boolean = false;
  username: string = '';

  constructor(
    private machineservice: MachineBackendService,
    private vmservice: VmwareApiService,
    private usersservice: UserBackendService,
    private router: Router
  ) {}

  get machinesPerUser(): string {
    if (this.nbrusers === 0) return '0';
    return (this.nbrmachines / this.nbrusers).toFixed(1);
  }

  get progressWidth(): number {
    if (this.nbrusers === 0) return 0;
    return Math.min((this.nbrmachines / (this.nbrusers * 5)) * 100, 100);
  }

  private isAdminFromToken(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // roles may be in different fields depending on your JWT setup
      const roles: string[] = payload.roles || payload.authorities || [];
      return roles.includes('ROLE_ADMIN');
    } catch {
      return false;
    }
  }

  ngOnInit() {
    this.username = localStorage.getItem('username') ?? '';
    this.isAdmin = this.isAdminFromToken();

    if (!this.isAdmin) {
      this.router.navigate(['/machines']); // redirect non-admins away
      return;
    }

    this.machineservice.getMachinesNumber().subscribe({
      next: (data: number) => { this.nbrmachines = data; },
      error: () => console.error('Failed to load machines count')
    });

    this.usersservice.getUsersNumber().subscribe({
      next: (data: number) => { this.nbrusers = data; },
      error: () => console.error('Failed to load users count')
    });
  }
}