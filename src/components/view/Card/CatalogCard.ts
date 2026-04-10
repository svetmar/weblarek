import { Card } from "./Card.ts";
import { ensureElement } from "../../../utils/utils.ts";
import type { IEvents } from "../../base/Events.ts";
import type { ICatalogCard } from "../../../types/index.ts";

export class CatalogCard extends Card<ICatalogCard> {
  private titleEl: HTMLElement;
  private imageEl: HTMLImageElement;
  private categoryEl: HTMLElement;
  private priceEl: HTMLElement;
  private _id!: string;

  constructor(
    container: HTMLElement,
    private events: IEvents,
  ) {
    super(container);

    this.titleEl = ensureElement<HTMLElement>(".card__title", this.container);
    this.imageEl = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.categoryEl = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.priceEl = ensureElement<HTMLElement>(".card__price", this.container);
    this.container.addEventListener("click", () =>
      this.events.emit("product:select", { id: this._id }),
    );
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
      value !== null ? `${value} синапсов` : "Недоступно";
  }

  set id(value: string) {
    this._id = value;
  }
}
