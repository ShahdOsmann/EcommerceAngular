import { Component, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html'
})
export class HeaderComponent {
  constructor(public cartService: CartService) {}

  get cartItemCount() {
    const cart = this.cartService.cart();
    return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;
  }
}
