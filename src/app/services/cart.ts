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

export interface CartItem {
  id: string;
  cartId: string;
  productId: number;
  quantity: number;
  product?: Product;
  categoryName?: string;
}

export interface Cart {
  id: string;
  userId: number;
  items: CartItem[];
}

export interface Toast {
  id: number;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = 'http://localhost:3000';
  private userId = 1;
  private toastCounter = 0;

  // Resolves once cart + products are fully loaded from the server
  private cartReady!: Promise<void>;
  private cartReadyResolve!: () => void;

  readonly cart = signal<Cart | null>(null);
  readonly products = signal<Product[]>([]);
  readonly categories = signal<Map<number, string>>(new Map());
  readonly toasts = signal<Toast[]>([]);

  readonly taxRate = 0.1;
  readonly shippingCost = 0;

  readonly subtotal = computed(() =>
    this.cart()?.items.reduce(
      (sum, item) => sum + (item.product?.price || 0) * item.quantity, 0
    ) || 0
  );

  readonly total = computed(() =>
    this.subtotal() + this.subtotal() * this.taxRate + this.shippingCost
  );

  constructor(private http: HttpClient) {
    this.cartReady = new Promise(resolve => { this.cartReadyResolve = resolve; });
    this.initCart();
  }

  /** Loads everything once on service creation */
  private initCart() {
    this.http.get<Product[]>(`${this.apiUrl}/products`).subscribe(products => {
      const numericProducts = products.map(p => ({
        ...p,
        id: Number(p.id),
        categoryId: Number(p.categoryId)
      }));
      this.products.set(numericProducts);

      this.http.get<any[]>(`${this.apiUrl}/categories`).subscribe(categories => {
        const categoryMap = new Map<number, string>();
        categories.forEach(c => categoryMap.set(Number(c.id), c.name));
        this.categories.set(categoryMap);

        this.http.get<any[]>(`${this.apiUrl}/carts?userId=${this.userId}`).subscribe(carts => {
          if (carts.length === 0) {
            this.http.post<any>(`${this.apiUrl}/carts`, {
              userId: this.userId,
              updatedAt: new Date().toISOString()
            }).subscribe(newCart => {
              this.cart.set({ ...newCart, id: String(newCart.id), items: [] });
              this.cartReadyResolve();
            });
          } else {
            const cartData = carts[0];
            const cartId = String(cartData.id); // "1"
            this.http.get<any[]>(`${this.apiUrl}/cartItems?cartId=${cartId}`).subscribe(items => {
              const enriched = this.enrichItems(items, numericProducts, categoryMap);
              this.cart.set({ ...cartData, id: cartId, items: enriched });
              this.cartReadyResolve();
            });
          }
        });
      });
    });
  }

  /** No-op: CartComponent calls this but cart is already loaded from constructor */
  loadCart() {}

  private enrichItems(items: any[], products: Product[], categoryMap: Map<number, string>): CartItem[] {
    return items.map(item => {
      const product = products.find(p => p.id === Number(item.productId));
      return {
        ...item,
        id: String(item.id),
        cartId: String(item.cartId),
        productId: Number(item.productId),
        quantity: Number(item.quantity),
        product,
        categoryName: product ? categoryMap.get(product.categoryId) : undefined
      };
    });
  }

  /** Waits for the cart to be ready before posting */
  addToCart(productId: number) {
    this.cartReady.then(() => {
      const cart = this.cart();
      if (!cart) return;

      const existingItem = cart.items.find(i => i.productId === productId);

      if (existingItem) {
        const newQty = existingItem.quantity + 1;
        this.http.patch<any>(`${this.apiUrl}/cartItems/${existingItem.id}`, { quantity: newQty })
          .subscribe(() => {
            this.cart.update(c => c ? {
              ...c,
              items: c.items.map(i => i.id === existingItem.id ? { ...i, quantity: newQty } : i)
            } : c);
            this.showToast('Quantity updated');
          });
      } else {
        const product = this.products().find(p => p.id === productId);
        const categoryMap = this.categories();
        this.http.post<any>(`${this.apiUrl}/cartItems`, {
          cartId: cart.id,   // "1" as string — matches db.json
          productId,
          quantity: 1
        }).subscribe(newItem => {
          const enriched: CartItem = {
            ...newItem,
            id: String(newItem.id),
            cartId: String(newItem.cartId),
            productId: Number(newItem.productId),
            quantity: 1,
            product,
            categoryName: product ? categoryMap.get(product.categoryId) : undefined
          };
          this.cart.update(c => c ? { ...c, items: [...c.items, enriched] } : c);
          this.showToast(`${product?.name || 'Item'} added to cart`);
        });
      }
    });
  }

  increaseQuantity(item: CartItem) {
    const newQty = item.quantity + 1;
    this.http.patch<any>(`${this.apiUrl}/cartItems/${item.id}`, { quantity: newQty })
      .subscribe(() => {
        this.cart.update(c => c ? {
          ...c, items: c.items.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
        } : c);
      });
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity <= 1) { this.removeItem(item); return; }
    const newQty = item.quantity - 1;
    this.http.patch<any>(`${this.apiUrl}/cartItems/${item.id}`, { quantity: newQty })
      .subscribe(() => {
        this.cart.update(c => c ? {
          ...c, items: c.items.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
        } : c);
      });
  }

  removeItem(item: CartItem) {
    this.http.delete(`${this.apiUrl}/cartItems/${item.id}`).subscribe(() => {
      this.cart.update(c => c ? { ...c, items: c.items.filter(i => i.id !== item.id) } : c);
      this.showToast('Item removed');
    });
  }

  checkout(): Promise<string> {
    return new Promise(resolve => {
      const cart = this.cart();
      if (!cart) return;
      const order = {
        userId: this.userId,
        status: 'pending',
        total: this.total(),
        shippingAddress: { country: 'Egypt', city: 'Cairo' },
        createdAt: new Date().toISOString()
      };
      this.http.post<any>(`${this.apiUrl}/orders`, order).subscribe(newOrder => {
        const orderItemPayloads = cart.items.map(item => ({
          orderId: String(newOrder.id),
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price || 0
        }));
        Promise.all(orderItemPayloads.map(oi =>
          this.http.post(`${this.apiUrl}/orderItems`, oi).toPromise()
        )).then(() => {
          Promise.all(cart.items.map(item =>
            this.http.delete(`${this.apiUrl}/cartItems/${item.id}`).toPromise()
          )).then(() => {
            this.cart.update(c => c ? { ...c, items: [] } : c);
            resolve(String(newOrder.id));
          });
        });
      });
    });
  }

  private showToast(message: string) {
    const id = ++this.toastCounter;
    this.toasts.update(t => [...t, { id, message }]);
    setTimeout(() => this.toasts.update(t => t.filter(toast => toast.id !== id)), 3000);
  }
}
