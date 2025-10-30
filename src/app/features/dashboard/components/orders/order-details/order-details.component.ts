import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrderModel } from '../../../../../core/models/order.model';
import { ProductModel } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  @Input() order?: OrderModel;
  loading = false;
  error: string | null = null;
  isOrderSummaryExpanded = false;

  constructor(
    private router: Router,

  ) { }

  ngOnInit(): void {
    this.loadOrderFromRoute();
  }

  private async loadOrderFromRoute(): Promise<void> {
    try {
      this.loading = true;
      this.error = null;
      const state = this.router.lastSuccessfulNavigation?.extras.state as { order?: OrderModel };
      this.order = state?.order || undefined;
    } catch (error) {
      console.error('Error loading order:', error);
      this.error = 'Error al cargar los detalles de la orden';
    } finally {
      this.loading = false;
    }
  }

  getStatusClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'pending': 'status-pending',
      'processing': 'status-processing',
      'shipped': 'status-shipped',
      'delivered': 'status-delivered',
      'cancelled': 'status-cancelled'
    };
    return statusClasses[status] || 'status-pending';
  }

  getStatusText(status: string): string {
    const statusTexts: { [key: string]: string } = {
      'pending': 'Pendiente',
      'processing': 'Procesando',
      'shipped': 'Enviado',
      'delivered': 'Entregado',
      'cancelled': 'Cancelado'
    };
    return statusTexts[status] || 'Pendiente';
  }

  formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
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

  formatNumber(quantity: string): number {
    return Number(quantity);
  }

  getTotalProducts(): number {
    const total =
      this.order?.products?.reduce(
        (total, product) => total + Number(product.quantity),
        0
      ) || 0;

    return Number(total);
  }


  getSubtotal(): number {
    return this.order?.products?.reduce((total, product) => total + (product.price * Number(product.quantity)), 0) || 0;
  }

  trackByProductId(index: number, product: ProductModel): string {
    return product.id;
  }

  goBackToOrders(): void {
    this.router.navigate(['/dashboard/orders']);
  }

  toggleOrderSummaryExpansion(): void {
    this.isOrderSummaryExpanded = !this.isOrderSummaryExpanded;
  }
}
