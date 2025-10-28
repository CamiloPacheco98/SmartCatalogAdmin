import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Order {
  id: string;
  createdAt: Date;
  products: string[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  user: {
    id: string;
    name: string;
    email: string;
    image: string;
  };
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];

  ngOnInit(): void {
    this.loadMockOrders();
  }

  get totalOrders(): number {
    return this.orders.length;
  }

  get deliveredOrders(): number {
    return this.orders.filter(o => o.status === 'delivered').length;
  }

  get pendingOrders(): number {
    return this.orders.filter(o => o.status === 'pending').length;
  }

  private loadMockOrders(): void {
    // TODO: Replace with actual API call
    this.orders = [
      {
        id: 'ORD-001',
        createdAt: new Date('2024-01-15T10:30:00'),
        products: ['iPhone 15 Pro', 'AirPods Pro', 'MagSafe Charger'],
        status: 'delivered',
        total: 1299.99,
        user: {
          id: 'USR-001',
          name: 'John Smith',
          email: 'john.smith@email.com',
          image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
        }
      },
      {
        id: 'ORD-002',
        createdAt: new Date('2024-01-14T14:20:00'),
        products: ['MacBook Air M2', 'Magic Mouse'],
        status: 'shipped',
        total: 1199.00,
        user: {
          id: 'USR-002',
          name: 'Sarah Johnson',
          email: 'sarah.j@email.com',
          image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
        }
      },
      {
        id: 'ORD-003',
        createdAt: new Date('2024-01-13T09:15:00'),
        products: ['iPad Pro', 'Apple Pencil', 'Magic Keyboard'],
        status: 'processing',
        total: 899.99,
        user: {
          id: 'USR-003',
          name: 'Michael Brown',
          email: 'm.brown@email.com',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
        }
      },
      {
        id: 'ORD-004',
        createdAt: new Date('2024-01-12T16:45:00'),
        products: ['Apple Watch Series 9', 'Sport Band'],
        status: 'pending',
        total: 399.00,
        user: {
          id: 'USR-004',
          name: 'Emily Davis',
          email: 'emily.davis@email.com',
          image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
        }
      },
      {
        id: 'ORD-005',
        createdAt: new Date('2024-01-11T11:30:00'),
        products: ['AirPods Max', 'iPhone 15 Case'],
        status: 'cancelled',
        total: 549.00,
        user: {
          id: 'USR-005',
          name: 'David Wilson',
          email: 'd.wilson@email.com',
          image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
        }
      },
      {
        id: 'ORD-006',
        createdAt: new Date('2024-01-10T13:20:00'),
        products: ['MacBook Pro M3', 'Studio Display', 'Magic Trackpad'],
        status: 'delivered',
        total: 3299.00,
        user: {
          id: 'USR-006',
          name: 'Lisa Anderson',
          email: 'lisa.a@email.com',
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
        }
      },
      {
        id: 'ORD-007',
        createdAt: new Date('2024-01-09T08:45:00'),
        products: ['Apple TV 4K', 'Siri Remote'],
        status: 'shipped',
        total: 179.00,
        user: {
          id: 'USR-007',
          name: 'Robert Taylor',
          email: 'robert.taylor@email.com',
          image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face'
        }
      },
      {
        id: 'ORD-008',
        createdAt: new Date('2024-01-08T15:10:00'),
        products: ['HomePod mini', 'AirTag 4-pack'],
        status: 'processing',
        total: 199.00,
        user: {
          id: 'USR-008',
          name: 'Jennifer Martinez',
          email: 'j.martinez@email.com',
          image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face'
        }
      }
    ];
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'delivered':
        return 'status-delivered';
      case 'shipped':
        return 'status-shipped';
      case 'processing':
        return 'status-processing';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return 'status-pending';
    }
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'delivered':
        return 'Delivered';
      case 'shipped':
        return 'Shipped';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  trackByOrderId(index: number, order: Order): string {
    return order.id;
  }
}
