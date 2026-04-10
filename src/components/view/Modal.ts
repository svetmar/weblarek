import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

export class Modal extends Component<unknown> {
  private closeButton: HTMLButtonElement;
  private contentEl: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      container,
    );
    this.contentEl = ensureElement<HTMLElement>(".modal__content", container);

    this.closeButton.addEventListener("click", () => this.close());
    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }

  open(content: HTMLElement) {
    this.contentEl.replaceChildren(content);
    this.container.classList.add("modal_active");
  }

  close() {
    this.container.classList.remove("modal_active");
    this.contentEl.replaceChildren();
  }
}
