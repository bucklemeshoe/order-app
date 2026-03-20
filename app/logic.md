# Order Flow: Mobile ↔ Admin (Supabase Realtime)

This document describes how the mobile app places orders and how the admin dashboard manages them, using Supabase (DB + Realtime) and optional Clerk auth. It includes schemas, environment, allowed transitions, and integration contracts for presentational UIs.

## Overview

- Mobile:
  - Browse menu → build cart → Checkout → Create order in `orders`
  - Track orders in real time (user-scoped)
- Admin:
  - Subscribe to all `orders`
  - Update status (Pending → Preparing → Ready → Collected, or Cancelled)
  - Realtime updates flow back to Mobile

## Tech & Env

- React + Vite + TypeScript
- Supabase (Postgres + Realtime)
- Optional Clerk auth (JWT forwarded to Supabase)
- Tailwind for UI

Environment (per app):
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY
- VITE_CLERK_PUBLISHABLE_KEY (use `disabled_for_local_dev` for local without Clerk)
- VITE_SUPABASE_EXTERNAL_JWT:
  - `false` in local to bypass external JWT for DB ops
  - not `false` in cloud; Clerk JWT is forwarded

## Database Schema (core)

```sql
-- users
id uuid primary key
email text
name text
phone text
created_at timestamptz default now()

-- menu_items
id uuid primary key default gen_random_uuid()
name text not null
category text not null
description text
price numeric(10,2) not null
image_url text
is_active boolean not null default true
created_at timestamptz default now()

-- orders
id uuid primary key default gen_random_uuid()
user_id uuid not null references users(id) on delete cascade
items jsonb not null               -- [{id,name,price,quantity}]
status text not null check (status in ('pending','preparing','ready','collected','cancelled')) default 'pending'
pickup_time timestamptz not null
share_location boolean not null default false
current_location geography(Point, 4326) null
created_at timestamptz default now()

-- order_events (optional audit)
id uuid primary key default gen_random_uuid()
order_id uuid not null references orders(id) on delete cascade
actor text not null                 -- 'system' | 'user' | 'staff'
event text not null                 -- 'created' | 'status_changed' | ...
metadata jsonb
created_at timestamptz default now()
```

RLS (illustrative):
- Mobile user can select/insert own `orders` (user_id = auth.uid())
- Admin bypass via role claim (Clerk) or dedicated policies

## Realtime

Subscribe to `postgres_changes` on `public.orders` for `INSERT` and `UPDATE`.

- Admin subscribes to all orders
- Mobile subscribes to orders where `user_id = current_user_id`

Payload (simplified):
```json
{
  "type": "UPDATE",
  "table": "orders",
  "new": { "id": "...", "status": "ready", "pickup_time": "...", "items": [...] },
  "old": { "id": "...", "status": "preparing", ... }
}
```

## Status Transitions

Allowed:
- pending → preparing → ready → collected
- pending → cancelled
- preparing → cancelled

Admin UI should:
- Show contextual actions:
  - Pending: Start Preparing, Cancel
  - Preparing: Mark Ready, Cancel
  - Ready: Mark Collected
- Write: `update orders set status = <next> where id = <id>`

## Mobile Flow

1) Menu → Cart
- Load `menu_items` where `is_active = true`
- Cart line item shape:
  ```ts
  type CartItem = { id: string; name: string; price: number; quantity: number; notes?: string }
  ```
  Store with Zustand (or equivalent local state).

2) Checkout → Create Order
- Local dev (no Clerk / VITE_SUPABASE_EXTERNAL_JWT=false): direct DB insert
  ```ts
  const orderData = {
    user_id: user.id,
    items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
    pickup_time: new Date(Date.now() + 15 * 60000).toISOString(),
    share_location
  }
  supabase.from('orders').insert(orderData).select().single()
  ```
- Cloud (Clerk enabled): call Edge Function `create_order`
  ```
  POST {VITE_SUPABASE_URL}/functions/v1/create_order
  Authorization: Bearer <clerk_jwt>
  {
    "user_id": "<clerk_user_id>",
    "items": [{ "menu_item_id": "<menu_id>", "quantity": 2 }],
    "pickup_time": "<iso>",
    "share_location": true
  }
  ```
  Returns `{ id, ... }` on success.

3) Orders & Details
- Subscribe (user-scoped) to `orders`
- List current/past orders by `status`
- Details page shows items, total, and a stepper derived from `status`:
  - pending (Received), preparing, ready, collected

## Admin Flow

1) Subscribe to all `orders`
2) Board/Lists:
- Group by `status` (Pending, Preparing, Ready)
- Completed = Collected or Cancelled
3) Actions (writebacks):
```ts
await supabase.from('orders').update({ status: 'preparing' }).eq('id', id)
await supabase.from('orders').update({ status: 'ready' }).eq('id', id)
await supabase.from('orders').update({ status: 'collected' }).eq('id', id)
await supabase.from('orders').update({ status: 'cancelled' }).eq('id', id)
```
4) Realtime propagates to Mobile.

## Presentational UI Contracts (for V0)

Build stateless components; accept props; call callbacks; no fetch/router/auth.

Types to import:
```ts
type Category = "All Items" | "Coffee" | "Food" | "Pastry"
type Product = { id; name; description; price; image; category: Category }
type CartLine = { id; name; price; quantity; notes? }
type OrderStatus = "pending" | "preparing" | "ready" | "collected" | "cancelled"
type OrderListItem = { id; placedAt; status: OrderStatus }
type OrderDetailItem = { name; qty; price }
type OrderDetail = { id; placedAt; status; items: OrderDetailItem[]; total: number }
type StepStatus = "complete" | "current" | "upcoming"
type OrderStep = { name; description; status: StepStatus }
```

Components & props:

- MenuView
  ```ts
  { products: Product[]; category: Category; categories?: Category[];
    onCategoryChange(c: Category): void;
    onOpenProduct(p: Product): void; }
  ```

- ProductView
  ```ts
  { product: Product; qty: number; onQtyChange(n: number): void;
    extras: { id; label; price }[]; selectedExtras: string[];
    onToggleExtra(id: string): void; onAdd(): void;
    computedTotalText: string; }
  ```

- CartView
  ```ts
  { items: CartLine[]; subtotalText: string; taxText: string; totalText: string;
    onAdjustQty(id: string, delta: number): void;
    onRemove(id: string): void; onClear(): void; onCheckout(): void; }
  ```

- CheckoutView
  ```ts
  { itemsTotalText: string; grandTotalText: string;
    shareLocation: boolean; onShareToggle(b: boolean): void;
    pickupSummaryText: string; onPlaceOrder(): void; }
  ```

- OrdersView
  ```ts
  { tab: "current" | "past"; onTabChange(t): void;
    currentOrders: OrderListItem[]; pastOrders: OrderListItem[];
    onOpenDetail(id: string): void; }
  ```

- OrderDetailView
  ```ts
  { order: OrderDetail; steps: OrderStep[]; onGoOrders(): void }
  ```

- Small helpers (UI only): `TabButton`, `IconButton`, `Row`, `Field`

UI rules:
- Tailwind classes ok; include `className` on root for overrides
- Use `<img>` (not next/image)
- Accessible labels where needed

## Local vs Cloud

- Local:
  - VITE_CLERK_PUBLISHABLE_KEY=disabled_for_local_dev
  - VITE_SUPABASE_EXTERNAL_JWT=false
  - Mobile inserts directly into `orders`
- Cloud:
  - Clerk enabled; JWT forwarded to Supabase
  - Use Edge Function `create_order` for order creation

## Test Script

1) Mobile: add 2 items → Checkout → Place Order
2) Admin: see new order appear in Pending
3) Admin: Start Preparing → Mark Ready → Mark Collected
4) Mobile (Orders): status updates in real time
5) Admin: Cancel a Pending/Preparing order → Mobile reflects

## Error Handling

- On failed order creation: display inline error + retry
- On admin update error: show toast + optimistic rollback
- Realtime disconnect: show subtle “offline” indicator

---
This spec lets V0 build the visual components safely. We keep the existing data flow, realtime, and status writes intact.
