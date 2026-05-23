import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { MachineBackendService } from '../machine-backend.service';
import { UserBackendService } from '../user-backend.service'; // ← use this

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  username = '';
  plan = 'FREE';
  vmCount = 0;
  totalMinutes = 0;
  isAdmin = false;

  constructor(
    private machineService: MachineBackendService,
    private userService: UserBackendService, // ← use this
    private router: Router
  ) {}

  get totalHours(): string {
    const h = Math.floor(this.totalMinutes / 60);
    const m = this.totalMinutes % 60;
    return `${h}h ${m}m`;
  }

  get estimatedCost(): string {
    const cost = (this.totalMinutes / 60) * 0.05;
    return cost.toFixed(2);
  }

  get maxVms(): number {
    return this.isAdmin ? 999 : this.plan === 'PRO' ? 5 : 1;
  }

  get planColor(): string {
    if (this.isAdmin) return 'admin';
    return this.plan === 'PRO' ? 'pro' : 'free';
  }

  ngOnInit(): void {
    const u = localStorage.getItem('username');
    if (!u) { this.router.navigate(['login']); return; }
    this.username = u;

    const roles: string[] = JSON.parse(localStorage.getItem('roles') || '[]');
    this.isAdmin = roles.includes('ROLE_ADMIN');
    this.plan = this.isAdmin ? 'ADMIN' : 'FREE';

    this.machineService.getMyMachines().subscribe({
      next: (machines) => { this.vmCount = machines.length; },
      error: () => {}
    });

    this.userService.getMyTotalMinutes().subscribe({ // ← use this
      next: (minutes) => { this.totalMinutes = minutes; },
      error: () => {}
    });
  }
}