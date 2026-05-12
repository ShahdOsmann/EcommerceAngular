import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html'
})
export class HomeComponent implements OnInit {
  constructor(
    public productsService: ProductsService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productsService.loadProducts();
    this.cartService.loadCart();
  }

  get featuredProducts() {
    return this.productsService.products().slice(0, 4);
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId);
  }
}
