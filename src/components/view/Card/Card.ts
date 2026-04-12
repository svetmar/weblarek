import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";

export abstract class Card<T> extends Component<T> {
  protected titleEl: HTMLElement;
  protected priceEl: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);
    this.titleEl = ensureElement<HTMLElement>('.card__title', this.container);
    this.priceEl = ensureElement<HTMLElement>(".card__price", container);
  }

  protected setText(element: HTMLElement, value: string) {
    element.textContent = value;
  }

  set title(value: string) {
    this.titleEl.textContent = value;
  }

  abstract set price(value: number | null);
}
