import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
  categoryId: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private apiUrl = 'http://localhost:3000';

  products = signal<Product[]>([]);
  categories = signal<Category[]>([]);
  selectedProduct = signal<Product | null>(null);

  searchQuery = signal<string>('');
  selectedCategory = signal<number | null>(null);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);
  sortBy = signal<string>('default');

  isLoading = signal<boolean>(false);

  filteredProducts = computed(() => {
    let result = [...this.products()];

    const q = this.searchQuery().toLowerCase().trim();
    if (q) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    if (this.selectedCategory() !== null) {
      result = result.filter(p => Number(p.categoryId) === this.selectedCategory());
    }

    if (this.minPrice() !== null) {
      result = result.filter(p => p.price >= this.minPrice()!);
    }
    if (this.maxPrice() !== null) {
      result = result.filter(p => p.price <= this.maxPrice()!);
    }

    switch (this.sortBy()) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    return result;
  });

  constructor(private http: HttpClient) {}

  loadProducts() {
    this.isLoading.set(true);
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe(products => {
      this.products.set(products.map(p => ({ ...p, id: Number(p.id), categoryId: Number(p.categoryId) })));
      this.isLoading.set(false);
    });
    this.http.get<Category[]>(`${this.apiUrl}/categories`).subscribe(cats => {
      this.categories.set(cats.map(c => ({ ...c, id: Number(c.id) })));
    });
  }

  loadProductById(id: number) {
    this.http.get<Product>(`${this.apiUrl}/products/${id}`).subscribe(p => {
      this.selectedProduct.set({ ...p, id: Number(p.id), categoryId: Number(p.categoryId) });
    });
  }

  getCategoryName(categoryId: number): string {
    const cat = this.categories().find(c => c.id === categoryId);
    return cat?.name || 'Unknown';
  }

  resetFilters() {
    this.searchQuery.set('');
    this.selectedCategory.set(null);
    this.minPrice.set(null);
    this.maxPrice.set(null);
    this.sortBy.set('default');
  }
}
