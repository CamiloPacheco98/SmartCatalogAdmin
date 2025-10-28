export interface Product {
    id: string;
    name: string;
    price: number;
    pageIndex: number;
    pageName: string;
    createdAt?: Date;
    updatedAt?: Date;
    desc: string;
}

export class ProductModel implements Product {
    id: string;
    name: string;
    price: number;
    pageIndex: number;
    pageName: string;
    createdAt?: Date;
    updatedAt?: Date;
    desc: string;

    constructor(productData: Product) {
        this.id = productData.id;
        this.name = productData.name;
        this.price = productData.price;
        this.pageIndex = productData.pageIndex;
        this.pageName = productData.pageName;
        this.createdAt = productData.createdAt;
        this.updatedAt = productData.updatedAt;
        this.desc = productData.desc;
    }
}