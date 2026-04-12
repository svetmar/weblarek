import type { IProduct } from '../../types/index.ts';
import type { IEvents } from "../base/Events.ts";

export class ProductCatalog {
    private products: IProduct[] = [];
    private selectedProduct: IProduct|null = null;

    constructor(private events: IEvents) {}

    setProducts(products: IProduct[]): void {
        this.products = products;
        this.events.emit('catalog:changed');
    }

    getProducts(): IProduct[] {
        return [...this.products]
    }

    getProductById(id: string): IProduct|undefined {
        return this.products.find(product => product.id === id);
    }

    setSelectedProduct(product: IProduct): void {
        this.selectedProduct = product
    }

    getSelectedProduct(): IProduct|null {
        return this.selectedProduct
    }
}