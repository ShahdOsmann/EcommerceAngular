import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrdersService } from '../../services/orders';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './orders.html'
})
export class OrdersComponent implements OnInit {

  constructor(public ordersService: OrdersService) {}

  ngOnInit(): void {
    this.ordersService.loadOrders();
  }
}
