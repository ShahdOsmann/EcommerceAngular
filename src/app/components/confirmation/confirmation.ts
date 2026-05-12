import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ConfirmationService } from '../../services/confirmation';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.html'
})
export class ConfirmationComponent implements OnInit {

  constructor(
    public confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.queryParamMap.get('orderId');
    if (orderId) {
      this.confirmationService.loadOrderById(orderId);
    }
  }

  goToOrders() {
    this.router.navigate(['/orders']);
  }
}
