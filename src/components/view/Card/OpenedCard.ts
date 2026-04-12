import { Card } from "./Card.ts";
import { ensureElement } from "../../../utils/utils.ts";
import type { IOpenedCard } from "../../../types/index.ts";

type IOpenedCardActions = {
  onToggle?: () => void;
};

export class OpenedCard extends Card<IOpenedCard> {
  private imageEl: HTMLImageElement;
  private categoryEl: HTMLElement;
  private descriptionEl: HTMLElement;
  private buttonEl: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IOpenedCardActions) {
    super(container);

    this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryEl = ensureElement<HTMLElement>('.card__category', this.container);
    this.descriptionEl = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonEl = ensureElement<HTMLButtonElement>('.card__button', this.container);

    if (actions?.onToggle) {
      this.buttonEl.addEventListener('click', actions.onToggle);
    }
  }

  set image(value: string) {
    this.setImage(this.imageEl, value);
  }

  set category(value: string) {
    this.categoryEl.textContent = value;
  }

  set price(value: number | null) {
    this.priceEl.textContent =
      value !== null ? `${value} синапсов` : "Бесценно";
  }

  set description(value: string) {
    this.setText(this.descriptionEl, value);
  }

  set buttonText(value: string) {
    this.buttonEl.textContent = value;
  }

  set buttonEnabled(value: boolean) {
    this.buttonEl.disabled = !value;
  }

}
