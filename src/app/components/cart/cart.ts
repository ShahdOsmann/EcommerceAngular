import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CartService, CartItem } from '../../services/cart';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './cart.html',
})
export class CartComponent implements OnInit {

  constructor(public cartService: CartService, private router: Router) {}

  get cart() { return this.cartService.cart; }
  get products() { return this.cartService.products; }
  get toasts() { return this.cartService.toasts; }

  get subtotal() { return this.cartService.subtotal; }
  get total() { return this.cartService.total; }
  get taxRate() { return this.cartService.taxRate; }
  get shippingCost() { return this.cartService.shippingCost; }

  ngOnInit(): void {
    this.cartService.loadCart();
  }

  increaseQuantity(item: CartItem) {
    this.cartService.increaseQuantity(item);
  }

  decreaseQuantity(item: CartItem) {
    this.cartService.decreaseQuantity(item);
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item);
  }

  checkout() {
    this.cartService.checkout().then(orderId => {
      this.router.navigate(['/confirmation'], {
        queryParams: { orderId }
      });
    });
  }
}
