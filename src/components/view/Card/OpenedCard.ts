import { Card } from "./Card.ts";
import { ensureElement } from "../../../utils/utils.ts";
import type { IEvents } from '../../base/Events.ts'
import type { IOpenedCard } from "../../../types/index.ts";

export class OpenedCard extends Card<IOpenedCard> {
  private titleEl: HTMLElement;
  private imageEl: HTMLImageElement;
  private categoryEl: HTMLElement;
  private descriptionEl: HTMLElement;
  private priceEl: HTMLElement;
  private buttonEl: HTMLButtonElement;
  private _id!: string;

  constructor(container: HTMLElement, private events: IEvents) {
    super(container);

    this.titleEl = ensureElement<HTMLElement>('.card__title', this.container);
    this.imageEl = ensureElement<HTMLImageElement>('.card__image', this.container);
    this.categoryEl = ensureElement<HTMLElement>('.card__category', this.container);
    this.priceEl = ensureElement<HTMLElement>('.card__price', this.container);
    this.descriptionEl = ensureElement<HTMLElement>('.card__text', this.container);
    this.buttonEl = ensureElement<HTMLButtonElement>('.card__button', this.container);

    this.buttonEl.addEventListener('click', () => this.events.emit('product:toggle', {id: this._id}))
  }

  set title(value: string) {
    this.titleEl.textContent = value;
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

  set id(value: string) {
    this._id = value
  }
}
