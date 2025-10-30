import { User } from "./user.model";
import { Product, ProductModel } from "./product.model";

export interface Order {
    adminUid: string;
    id: string;
    createdAt: Date;
    products: Product[];
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    user: User;
}

export class OrderModel implements Order {
    adminUid: string;
    id: string;
    createdAt: Date;
    products: ProductModel[];
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    total: number;
    user: User;
    statusClass: string;
    statusText: string;

    constructor(orderData: Order) {
        this.adminUid = orderData.adminUid;
        this.id = orderData.id;
        this.createdAt = orderData.createdAt;
        this.products = orderData.products.map(product => new ProductModel(product));
        this.status = orderData.status;
        this.total = orderData.total;
        this.user = orderData.user;
        this.statusClass = this.getStatusClass();
        this.statusText = this.getStatusText();
    }



    private getStatusClass(): string {
        switch (this.status) {
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

    private getStatusText(): string {
        switch (this.status) {
            case 'delivered':
                return 'Entregado';
            case 'shipped':
                return 'Enviado';
            case 'processing':
                return 'Procesando';
            case 'pending':
                return 'Pendiente';
            case 'cancelled':
                return 'Cancelado';
            default:
                return 'Desconocido';
        }
    }
}
