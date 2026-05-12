# ShopLux — Angular E-Commerce App

A full-featured Angular 21 e-commerce application with Tailwind CSS and json-server as a backend.

## Features

- 🏠 **Home Page** — hero banner, category grid, featured products
- 🛍️ **Products Page** — grid with sidebar filters (search, category, price range, sort)
- 📦 **Product Details** — full detail view with quantity selector and Add to Cart
- 🛒 **Cart** — item management, quantity controls, order summary, checkout
- ✅ **Order Confirmation** — success screen with order breakdown
- 📋 **My Orders** — order history list
- 🔍 **Order Details** — per-order item breakdown

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the JSON server (backend)

```bash
npm run server
```

Runs on `http://localhost:3000`

### 3. Start the Angular dev server

```bash
npm start
```

Runs on `http://localhost:4200`

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/          # Sticky nav with cart badge
│   │   ├── home/            # Landing page
│   │   ├── products/        # Product listing + filters
│   │   ├── product-details/ # Single product view
│   │   ├── cart/            # Shopping cart
│   │   ├── confirmation/    # Post-checkout confirmation
│   │   ├── orders/          # Order history
│   │   └── order-details/   # Single order view
│   ├── services/
│   │   ├── cart.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   ├── order-details.ts
│   │   └── confirmation.ts
│   ├── app.routes.ts
│   ├── app.config.ts
│   ├── app.ts
│   └── app.html
└── server/
    └── db.json              # Mock database
```

## Tech Stack

- **Angular 21** (standalone components, signals)
- **Tailwind CSS v4**
- **json-server** for REST API mock
- **TypeScript 5.9**
