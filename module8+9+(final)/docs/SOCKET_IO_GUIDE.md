# Socket.IO Real-Time Integration Guide

## Overview

Socket.IO enables real-time communication between frontend and backend for live order updates and notifications.

---

## Backend Setup (Already Configured)

### Server Socket.IO Configuration

```typescript
// In server.ts
import { Server } from "socket.io";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});
```

---

## Event Emissions

### Order Created Event

```typescript
// When order is created, emit to all connected clients
io.emit('order:created', {
  _id: order._id,
  userId: order.userId,
  items: order.items,
  total: order.total,
  status: 'pending',
  createdAt: new Date()
});
```

### Order Updated Event

```typescript
// When order status changes
io.emit('order:updated', {
  orderId: order._id,
  status: order.status,
  updatedAt: new Date()
});
```

### Product Stock Changed

```typescript
// When product stock is reduced
io.emit('product:stockChanged', {
  productId: product._id,
  newStock: product.stock,
  quantity: orderQuantity
});
```

---

## Frontend Integration

### Installation

```bash
npm install socket.io-client
```

### Hook for Socket Connection

Create `hooks/useSocket.ts`:

```typescript
import { useEffect } from 'react';
import io from 'socket.io-client';

export function useSocket() {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000', {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    // Listen for order events
    socket.on('order:created', (order) => {
      console.log('New order:', order);
      // Update admin dashboard
      // Show notification
    });

    socket.on('order:updated', (updatedOrder) => {
      console.log('Order updated:', updatedOrder);
      // Update UI
    });

    socket.on('product:stockChanged', (data) => {
      console.log('Stock changed:', data);
      // Update product list
    });

    return () => socket.disconnect();
  }, []);
}
```

### Admin Dashboard Usage

```typescript
'use client';

import { useSocket } from '@/hooks/useSocket';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  
  useSocket(); // Enable real-time updates

  useEffect(() => {
    // Listen for live orders
    const socket = io(process.env.NEXT_PUBLIC_API_URL);
    
    socket.on('order:created', (newOrder) => {
      setOrders(prev => [newOrder, ...prev]);
      // Show notification
      showNotification(`New order: ${newOrder._id}`);
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h1>Live Orders</h1>
      <OrderFeed orders={orders} />
    </div>
  );
}
```

---

## Rooms (Optional Advanced Feature)

### Join User-Specific Room

```typescript
// Backend
socket.on('join', (userId) => {
  socket.join(`user:${userId}`);
});

// Emit to specific user
io.to(`user:${userId}`).emit('order:update', order);
```

### Admin Room

```typescript
// Backend
socket.on('joinAdmin', () => {
  socket.join('admin');
});

// Emit to all admins
io.to('admin').emit('newOrder', order);
```

---

## Error Handling

```typescript
// Client side
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
});

socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  // Attempt reconnection
});
```

---

## Testing Socket.IO

### Use Socket.IO Test Client

```bash
npm install socket.io-client --save-dev
```

### Example Test

```typescript
import { io } from 'socket.io-client';

describe('Socket.IO Events', () => {
  it('should receive order:created event', (done) => {
    const socket = io('http://localhost:5000');
    
    socket.on('order:created', (order) => {
      expect(order).toHaveProperty('_id');
      expect(order.status).toBe('pending');
      socket.disconnect();
      done();
    });

    // Trigger event from backend
    // POST /api/v1/orders
  });
});
```

---

## Production Deployment

### Railway Configuration

No additional setup needed - Socket.IO works out of the box on Railway.

### Scaling with Multiple Instances

For multiple backend instances, use Redis adapter:

```bash
npm install socket.io-redis
```

```typescript
import { createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

const pubClient = createClient({ host: 'localhost', port: 6379 });
const subClient = pubClient.duplicate();

io.adapter(createAdapter(pubClient, subClient));
```

---

## Debugging

### Enable Socket.IO Logs

```typescript
// In server.ts
import debug from 'debug';
const socketDebug = debug('socket.io:client');

io.on('connection', (socket) => {
  socketDebug('User connected:', socket.id);
});
```

### Browser Console Debugging

```javascript
// In browser console
io.on('connect', () => console.log('Connected'));
io.on('disconnect', () => console.log('Disconnected'));
io.on('*', (event, ...args) => console.log(event, args));
```

---

## Common Issues

### CORS Errors
**Solution**: Ensure CORS is configured in Socket.IO server:
```typescript
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});
```

### Connection Refused
**Solution**: Check if backend is running and accessible

### Events Not Received
**Solution**: 
1. Verify socket is connected
2. Check event name spelling
3. Ensure frontend is listening to correct event

---

## References

- Socket.IO Docs: https://socket.io/docs/v4/
- Client: https://socket.io/docs/v4/client-api/
- Server: https://socket.io/docs/v4/server-api/
- Examples: https://github.com/socketio/socket.io/tree/main/examples

---

## Your Implementation Checklist

- [x] Backend Socket.IO configured
- [ ] Order creation emits event
- [ ] Frontend connects to Socket.IO
- [ ] Admin dashboard receives live updates
- [ ] Socket connection tested
- [ ] Error handling implemented
- [ ] Production deployment verified

---

**Next Steps**:
1. Implement event emissions in order controller
2. Add Socket.IO listeners in admin dashboard
3. Test with Postman + browser console
4. Deploy to Railway and verify live updates
