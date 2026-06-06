import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserBackendService } from '../user-backend.service';

@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent implements OnInit {

  users: any[] = [];
  isAdmin = false;
  username = '';

  constructor(
    private userService: UserBackendService,
    private router: Router
  ) {}

  get totalVms(): number {
    return this.users.reduce((s, u) => s + (u.vmCount || 0), 0);
  }

  get adminCount(): number {
    return this.users.filter(u => u.roles?.includes('ROLE_ADMIN')).length;
  }

  get userCount(): number {
    return this.users.filter(u => !u.roles?.includes('ROLE_ADMIN')).length;
  }

  onDeleteUser(id: number, username: string) {
    if (!confirm(`Are you sure you want to delete user "${username}"?`)) return;
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        alert(`User "${username}" deleted successfully.`);
      },
      error: () => alert('Error deleting user.')
    });
  }
  onUpgradePlan(id: number, username: string) {
  if (!confirm(`Upgrade "${username}" to PRO plan?`)) return;
  this.userService.upgradePlan(id, 'PRO').subscribe({
    next: () => {
      const user = this.users.find(u => u.id === id);
      if (user) { user.plan = 'PRO'; user.maxVms = 5; }
      alert(`${username} upgraded to PRO successfully.`);
    },
    error: () => alert('Error upgrading plan.')
  });
}

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? '';

    const roles: string[] = JSON.parse(localStorage.getItem('roles') || '[]');
    this.isAdmin = roles.includes('ROLE_ADMIN');

    if (!this.isAdmin) {
      this.router.navigate(['/machines']);
      return;
    }
    
    this.userService.getUserList().subscribe({
      next: (data) => { this.users = data; },
      error: () => console.error('Failed to load users')
    });
  }
}