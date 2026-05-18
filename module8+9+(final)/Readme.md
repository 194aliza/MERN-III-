# Full-Stack E-Commerce Store & Admin Dashboard (Module 8, 9 & Final)

This project is a comprehensive E-commerce solution built with **Next.js 16 (Turbopack)**. It covers the complete journey from user authentication and product browsing to a real-time Admin Dashboard for inventory management.

> **Note:** This repository contains the combined implementation of Module 8, Module 9, and the Final Project requirements in a single integrated codebase (Folder: `module8+9+(final)`).

---

##  Key Features

###  User Side
- **Authentication:** Secure Login/Register flow using Zod and React Hook Form.
- **Product Catalog:** Dynamic product listing with search and filtering.
- **Shopping Cart:** Full cart functionality (Add/Remove/Update) powered by Zustand.
- **Checkout Flow:** Seamless transition from cart to order placement.

###  Admin Side
- **Real-time Analytics:** Live counts of Total Users, Active Orders, and Revenue.
- **Inventory Management:** Interactive data table using TanStack Table with sorting and status updates.
- **Live Feed:** Real-time order notification feed using simulated API polling.
- **Visual Analytics:** Revenue trends visualized using Recharts.

---

##  Tech Stack
- **Framework:** Next.js 16 (App Router)
- **State Management:** Zustand
- **Form Handling:** React Hook Form + Zod
- **Styling:** Tailwind CSS + Framer Motion
- **Tables & Charts:** TanStack Table & Recharts
- **Icons:** Lucide React

---

##  Environment Variables & Config
Create a `.env.local` file in the root directory and add the following:

| Variable | Description | Default Value |
|----------|-------------|---------------|
| `NEXT_PUBLIC_API_URL` | Base URL for API calls | `http://localhost:3000/api` |
| `NODE_ENV` | Development or Production | `development` |

---

##  Component API & Structure

### 1. `AdminDashboard`
- **Purpose:** Main analytics hub.
- **Internal APIs:** Fetches data from `/api/user` and `/api/orders`.

### 2. `ProductTable`
- **Props:** Uses `products` data from `@/app/(user)/user/data/product`.
- **Features:** Sorting, Dynamic Status Badges.

### 3. `LiveOrderFeed`
- **Polling:** Automatically refreshes every 5-10 seconds to fetch latest orders from `/api/orders`.

---

##  Getting Started

1. **Install Dependencies:**
   ```bash
   npm install --legacy-peer-deps