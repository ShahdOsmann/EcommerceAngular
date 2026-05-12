import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.html'
})
export class ProductDetailsComponent implements OnInit {
  quantity = 1;
  added = false;

  constructor(
    private route: ActivatedRoute,
    public productsService: ProductsService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productsService.selectedProduct.set(null);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productsService.loadProductById(Number(id));
      this.productsService.loadProducts(); // load categories too
    }
  }

  increment() {
    const product = this.productsService.selectedProduct();
    if (product && this.quantity < product.stock) {
      this.quantity++;
    }
  }

  decrement() {
    if (this.quantity > 1) this.quantity--;
  }

  addToCart() {
    const product = this.productsService.selectedProduct();
    if (!product) return;
    for (let i = 0; i < this.quantity; i++) {
      this.cartService.addToCart(product.id);
    }
    this.added = true;
    setTimeout(() => (this.added = false), 2000);
  }
}
