import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserBackendService } from '../user-backend.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.css'
})
export class PaymentSuccessComponent implements OnInit {

  loading = true;
  success = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserBackendService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.queryParams['session_id'];
    if (!sessionId) { this.router.navigate(['/']); return; }

    this.userService.upgradeAfterPayment(sessionId).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        // update localStorage
        const roles = JSON.parse(localStorage.getItem('roles') || '[]');
        localStorage.setItem('plan', 'PRO');
        setTimeout(() => this.router.navigate(['/machines']), 3000);
      },
      error: () => {
        this.loading = false;
        this.success = false;
      }
    });
  }
}