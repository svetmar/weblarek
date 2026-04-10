import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import type { IEvents } from "../base/Events";

export class Basket extends Component<unknown> {
  private listEl: HTMLElement;
  private priceEl: HTMLElement;
  private checkoutBtn: HTMLButtonElement;

  constructor(
    private events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.listEl = ensureElement<HTMLElement>(".basket__list", this.container);
    this.priceEl = ensureElement<HTMLElement>(".basket__price", this.container);
    this.checkoutBtn = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.checkoutBtn.addEventListener("click", () =>
      this.events.emit("basket:checkout"),
    );
  }

  set items(items: HTMLElement[]) {
    this.listEl.replaceChildren(...items);
  }

  set total(value: number) {
    this.priceEl.textContent = `${value} синапсов`;
  }

  set checkOutEnabled(value: boolean) {
    this.checkoutBtn.disabled = !value;
  }
}
