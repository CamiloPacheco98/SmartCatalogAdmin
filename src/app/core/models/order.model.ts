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

    constructor(orderData: Order) {
        this.adminUid = orderData.adminUid;
        this.id = orderData.id;
        this.createdAt = orderData.createdAt;
        this.products = orderData.products.map(product => new ProductModel(product));
        this.status = orderData.status;
        this.total = orderData.total;
        this.user = orderData.user;
    }

}
