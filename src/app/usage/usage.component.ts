import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserBackendService } from '../user-backend.service';

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './usage.component.html',
  styleUrl: './usage.component.css'
})
export class UsageComponent implements OnInit {

  logs: any[] = [];
  totalMinutes: number = 0;
  username = '';

  constructor(private userService: UserBackendService) {}

  get totalHours(): string {
    const h = Math.floor(this.totalMinutes / 60);
    const m = this.totalMinutes % 60;
    return `${h}h ${m}m`;
  }

  get estimatedCost(): string {
    const cost = (this.totalMinutes / 60) * 0.05;
    return cost.toFixed(2);
  }

  get poweredOnLogs(): any[] {
    return this.logs.filter(l => l.action === 'POWER_ON');
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('fr-FR');
  }

  formatDuration(minutes: number): string {
    if (!minutes) return '< 1 min';
    if (minutes < 60) return `${minutes} min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  ngOnInit(): void {
    this.username = localStorage.getItem('username') ?? '';

    this.userService.getMyLogs().subscribe({
      next: (data) => { this.logs = data; },
      error: () => console.error('Failed to load usage logs')
    });

    this.userService.getMyTotalMinutes().subscribe({
      next: (data) => { this.totalMinutes = data; },
      error: () => console.error('Failed to load total minutes')
    });
  }
}