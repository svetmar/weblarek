import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import type { IEvents } from "../base/Events";

export class Header extends Component<unknown> {
  private basketButtonEl: HTMLButtonElement;
  private basketCounterEl: HTMLElement;

  constructor(
    private events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.basketButtonEl = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );
    this.basketCounterEl = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );
    this.basketButtonEl.addEventListener("click", () =>
      this.events.emit("basket:open"),
    );
  }

  set counter(value: number) {
    this.basketCounterEl.textContent = String(value);
    this.basketCounterEl.style.display = value > 0 ? "block" : "none";
  }
}
