import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { ProductsComponent } from './components/products/products';
import { ProductDetailsComponent } from './components/product-details/product-details';
import { CartComponent } from './components/cart/cart';
import { ConfirmationComponent } from './components/confirmation/confirmation';
import { OrdersComponent } from './components/orders/orders';
import { OrderDetailsComponent } from './components/order-details/order-details';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/:id', component: ProductDetailsComponent },
  { path: 'cart', component: CartComponent },
  { path: 'confirmation', component: ConfirmationComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/:id', component: OrderDetailsComponent },
  { path: '**', redirectTo: '' }
];
