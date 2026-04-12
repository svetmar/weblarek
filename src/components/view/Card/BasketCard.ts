import { Card } from "./Card.ts";
import { ensureElement } from "../../../utils/utils.ts";
import type { IBasketCard } from "../../../types/index.ts";

type IBasketCardActions = {
  onRemove?: () => void;
};

export class BasketCard extends Card<IBasketCard> {
  private removeBtn: HTMLButtonElement;
  private itemIndexEl: HTMLElement;

  constructor(container: HTMLElement, actions?: IBasketCardActions) {
    super(container);

    this.itemIndexEl = ensureElement<HTMLElement>('.basket__item-index', this.container);
    this.removeBtn = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );
    if (actions?.onRemove) {
    this.removeBtn.addEventListener("click", actions.onRemove);
    };
  }

  set price(value: number) {
    this.priceEl.textContent = `${value} синапсов`;
  }

  set index(value: number) {
    this.itemIndexEl.textContent = String(value);
  }
}
