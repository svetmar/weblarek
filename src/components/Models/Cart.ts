import type { IProduct } from "../../types/index.ts";
import type { IEvents } from "../base/Events.ts";

export class Cart {
  private items: IProduct[] = [];

  constructor(private events: IEvents) {}

  getItems(): IProduct[] {
    return [...this.items];
  }

  addItem(item: IProduct): void {
    if (this.hasItem(item.id)) {
      return;
    }
    this.items.push(item);
    this.events.emit("cart:changed");
  }

  removeItem(item: IProduct): void {
    this.items = this.items.filter((product) => product.id !== item.id);
    this.events.emit("cart:changed");
  }

  clear(): void {
    this.items = [];
    this.events.emit("cart:changed");
  }

  getTotalPrice(): number {
    return this.items.reduce((acc, item) => acc + (item.price ?? 0), 0);
  }

  getTotalQuantity(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    return this.items.some((item) => item.id === id);
  }
}
