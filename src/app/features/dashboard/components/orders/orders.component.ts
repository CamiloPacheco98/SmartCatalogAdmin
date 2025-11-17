import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderModel } from '../../../../core/models/order.model';
import { FirestoreService } from '../../../../core/services/firestore.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-orders',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './orders.component.html',
    styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
    orders: OrderModel[] = [];
    loading = false;
    error: string | null = null;
    totalOrders = 0;
    deliveredOrders = 0;
    pendingOrders = 0;
    showingDiscountInput: string | null = null;
    discountPercentage: number | null = null;

    constructor(
        private firestoreService: FirestoreService,
        private authService: AuthService,
        private router: Router,
        private translate: TranslateService
    ) { }

    ngOnInit(): void {
        this.getOrders();
    }

    private async getOrders(): Promise<void> {
        try {
            this.loading = true;
            this.error = null;
            const currentUid = this._getCurrentUid();
            if (currentUid) {
                this.orders = await this.firestoreService.getAllOrders(currentUid);
                this.totalOrders = this.orders.length;
                this.deliveredOrders = this.orders.filter(o => o.status === 'delivered').length;
                this.pendingOrders = this.orders.filter(o => o.status === 'pending').length;
            }
        } catch (error) {
            console.error('Error loading users:', error);
            this.error = this.translate.instant('app.orderDetails.error.loadingOrderDetails');
        } finally {
            this.loading = false;
        }
    }

    private _getCurrentUid(): string | null {
        return this.authService.getCurrentUser()?.uid || null;
    }

    trackByOrderId(index: number, order: OrderModel): string {
        return order.id;
    }

    viewOrderDetails(orderId: string): void {
        this.router.navigate(['/dashboard/orders', orderId], { state: { order: this.orders.find(o => o.id === orderId) } });
    }

    toggleDiscountInput(orderId: string): void {
        if (this.showingDiscountInput === orderId) {
            this.showingDiscountInput = null;
            this.discountPercentage = null;
        } else {
            this.showingDiscountInput = orderId;
            this.discountPercentage = null;
        }
    }

    applyDiscount(orderId: string): void {
        console.log('DEBUG: Applying discount to order', orderId, 'with percentage:', this.discountPercentage);
        // TODO: Add discount logic here
        this.showingDiscountInput = null;
        this.discountPercentage = null;
    }
}
