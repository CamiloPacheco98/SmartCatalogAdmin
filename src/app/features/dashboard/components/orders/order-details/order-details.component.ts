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
  totalProducts = 0;
  subtotal = 0;


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
      this.totalProducts = this.getTotalProducts();
      this.subtotal = this.getSubtotal();
    } catch (error) {
      console.error('Error loading order:', error);
      this.error = 'Error al cargar los detalles de la orden';
    } finally {
      this.loading = false;
    }
  }

  private getTotalProducts(): number {
    const total =
      this.order?.products?.reduce(
        (total, product) => total + product.quantityNumber,
        0
      ) || 0;

    return Number(total);
  }


  private getSubtotal(): number {
    return this.order?.products?.reduce((total, product) => total + (product.price * product.quantityNumber), 0) || 0;
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
