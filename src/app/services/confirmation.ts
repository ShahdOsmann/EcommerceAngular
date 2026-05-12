import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  private apiUrl = 'http://localhost:3000';

  order = signal<any | null>(null);
  orderItems = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  loadOrderById(orderId: string) {
    this.http.get<any>(`${this.apiUrl}/orders/${orderId}`)
      .subscribe(order => {
        this.order.set(order);
        this.http
          .get<any[]>(`${this.apiUrl}/orderItems?orderId=${orderId}`)
          .subscribe(items => this.orderItems.set(items));
      });
  }
}
