import { Component } from "../../base/Component";
import { ensureElement } from "../../../utils/utils";
import type { IBuyer } from "../../../types/index";

export abstract class Form<T> extends Component<T> {
  protected formEl: HTMLFormElement;
  protected confirmButton: HTMLButtonElement;
  protected errorMessageEl: HTMLElement;

  protected constructor(container: HTMLElement) {
    super(container);

    this.formEl = this.container as HTMLFormElement;
    this.confirmButton = ensureElement<HTMLButtonElement>(
      '[type="submit"]',
      this.container,
    )!;
    this.confirmButton.disabled = true;
    this.errorMessageEl = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    )!;
  }

  set onSubmit(handler: () => void) {
    this.formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      handler();
    });
  }

  set isValid(value: boolean) {
    this.confirmButton.disabled = !value;
  }

  set errors(errors: Partial<Record<keyof IBuyer, string>>) {
    this.errorMessageEl.textContent = Object.values(errors).join(" ");
  }
}
