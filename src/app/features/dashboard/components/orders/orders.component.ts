import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from '../../../../core/models/order.model';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
    orders: Order[] = [];
    loading = false;
    error: string | null = null;

    constructor(
        private firestoreService: FirestoreService,
        private authService: AuthService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.getOrders();
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

    private async getOrders(): Promise<void> {
        try {
            this.loading = true;
            this.error = null;
            const currentUid = this._getCurrentUid();
            if (currentUid) {
                this.orders = await this.firestoreService.getAllOrders(currentUid);
            }
        } catch (error) {
            console.error('Error loading users:', error);
            this.error = 'Error al cargar los usuarios';
        } finally {
            this.loading = false;
        }
    }

    private _getCurrentUid(): string | null {
        return this.authService.getCurrentUser()?.uid || null;
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

    formatDate(date: string | Date): string {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        return dateObj.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(amount);
    }

    trackByOrderId(index: number, order: Order): string {
        return order.id;
    }

    viewOrderDetails(orderId: string): void {
        this.router.navigate(['/dashboard/orders', orderId], { state: { order: this.orders.find(o => o.id === orderId) } });
    }
}
