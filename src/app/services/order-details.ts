import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class OrderDetailsService {
  private apiUrl = 'http://localhost:3000';

  order = signal<any | null>(null);
  items = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  loadOrder(orderId: string) {
    this.http.get<any>(`${this.apiUrl}/orders/${orderId}`)
      .subscribe(order => {
        this.order.set(order);

        this.http.get<any[]>(`${this.apiUrl}/orderItems?orderId=${orderId}`)
          .subscribe(items => {
            this.http.get<any[]>(`${this.apiUrl}/products`)
              .subscribe(products => {
                const enrichedItems = items.map(item => ({
                  ...item,
                  product: products.find(p => String(p.id) === String(item.productId))
                }));
                this.items.set(enrichedItems);
              });
          });
      });
  }
}
