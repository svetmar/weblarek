import type { IProduct } from '../../types/index.ts';

export class Cart {
    private items: IProduct[] = [];

    getItems(): IProduct[] {
        return [...this.items]
    }

    addItem(item: IProduct): void {
        this.items.push(item)
    }

    removeItem(item: IProduct): void {
        this.items = this.items.filter(product => product.id !== item.id)
    }

    clear(): void {
        this.items = []
    }

    getTotalPrice(): number {
        return this.items.reduce((acc, item) => acc+(item.price??0), 0)
    }
    
    getTotalQuantity(): number {
        return this.items.length    
    }

    hasItem(id: string): boolean {
        return this.items.some(item => item.id === id)
    }
}