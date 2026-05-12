import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderDetailsService } from '../../services/order-details';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-details.html'
})
export class OrderDetailsComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    public orderDetailsService: OrderDetailsService
  ) {}

  ngOnInit(): void {
    const orderId = this.route.snapshot.paramMap.get('id');
    if (orderId) {
      this.orderDetailsService.loadOrder(orderId);
    }
  }
}
