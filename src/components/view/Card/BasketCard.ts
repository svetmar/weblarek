import { Card } from "./Card.ts";
import { ensureElement } from "../../../utils/utils.ts";
import { IEvents } from "../../base/Events.ts";
import type { IBasketCard } from "../../../types/index.ts";

export class BasketCard extends Card<IBasketCard> {
  private titleEl: HTMLElement;
  private priceEl: HTMLElement;
  private removeBtn: HTMLButtonElement;
  private _id!: string;

  constructor(
    private events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.titleEl = ensureElement<HTMLElement>(".card__title", container);
    this.priceEl = ensureElement<HTMLElement>(".card__price", container);
    this.removeBtn = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );
    this.removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.events.emit("basket:removeItem", { id: this._id });
    });
  }

  set title(value: string) {
    this.titleEl.textContent = value;
  }

  set price(value: number) {
    this.priceEl.textContent = `${value} синапсов`;
  }

  set id(value: string) {
    this._id = value;
  }
}
