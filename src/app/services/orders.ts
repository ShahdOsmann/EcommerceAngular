import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private apiUrl = 'http://localhost:3000';
  private userId = 1;

  orders = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  loadOrders() {
    this.http
      .get<any[]>(`${this.apiUrl}/orders?userId=${this.userId}`)
      .subscribe(orders => {
        if (!orders.length) {
          this.orders.set([]);
          return;
        }

        const orderItemsRequests = orders.map(order =>
          this.http.get<any[]>(`${this.apiUrl}/orderItems?orderId=${order.id}`)
        );

        forkJoin(orderItemsRequests).subscribe(orderItemsArrays => {
          this.http.get<any[]>(`${this.apiUrl}/products`).subscribe(products => {
            const enrichedOrders = orders.map((order, index) => ({
              ...order,
              items: orderItemsArrays[index].map(item => ({
                ...item,
                product: products.find(p => String(p.id) === String(item.productId))
              }))
            }));

            enrichedOrders.sort(
              (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            this.orders.set(enrichedOrders);
          });
        });
      });
  }
}
