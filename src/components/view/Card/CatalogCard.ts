import { Card } from "./Card.ts";
import { ensureElement } from "../../../utils/utils.ts";
import type { ICatalogCard } from "../../../types/index.ts";
import { categoryMap } from '../../../utils/constants.ts';

type ICardActions = {
  onClick?: () => void;
};

export class CatalogCard extends Card<ICatalogCard> {
  private imageEl: HTMLImageElement;
  private categoryEl: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryEl = ensureElement<HTMLElement>('.card__category', this.container);

    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

  set image(value: string) {
    this.setImage(this.imageEl, value);
  }

  set category(value: string) {
    this.categoryEl.textContent = value;
    if (value in categoryMap) {
    this.categoryEl.classList.add(categoryMap[value as keyof typeof categoryMap]);
    }
  }

  set price(value: number | null) {
    this.priceEl.textContent =
      value !== null ? `${value} синапсов` : "Недоступно";
  }
}
