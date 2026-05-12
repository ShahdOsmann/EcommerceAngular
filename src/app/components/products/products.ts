import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsService } from '../../services/products';
import { CartService } from '../../services/cart';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './products.html'
})
export class ProductsComponent implements OnInit {
  searchValue = '';
  minPriceValue = '';
  maxPriceValue = '';

  constructor(
    public productsService: ProductsService,
    public cartService: CartService
  ) {}

  ngOnInit(): void {
    this.productsService.loadProducts();
    this.cartService.loadCart();
  }

  onSearch(value: string) {
    this.productsService.searchQuery.set(value);
  }

  onCategoryChange(catId: string) {
    this.productsService.selectedCategory.set(catId ? Number(catId) : null);
  }

  onSortChange(sort: string) {
    this.productsService.sortBy.set(sort);
  }

  onMinPrice(value: string) {
    this.productsService.minPrice.set(value ? Number(value) : null);
  }

  onMaxPrice(value: string) {
    this.productsService.maxPrice.set(value ? Number(value) : null);
  }

  resetFilters() {
    this.searchValue = '';
    this.minPriceValue = '';
    this.maxPriceValue = '';
    this.productsService.resetFilters();
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId);
  }
}
