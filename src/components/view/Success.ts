import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export class Success extends Component<unknown> {
  private descriptionEl: HTMLElement;
  private buttonClose: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.descriptionEl = ensureElement<HTMLElement>(
      ".order-success__description",
      this.container,
    );
    this.buttonClose = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
  }

  set total(value: number) {
    this.descriptionEl.textContent = `Списано ${value} синапсов`;
  }

  set onClose(handler: () => void) {
    this.buttonClose.addEventListener("click", handler);
  }
}
