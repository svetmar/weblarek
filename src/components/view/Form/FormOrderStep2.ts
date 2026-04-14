import type { IPhoneEmail } from "../../../types/index";
import type { IEvents } from "../../base/Events";
import { ensureElement } from "../../../utils/utils";
import { Form } from "./Form";

export class FormOrderStep2 extends Form<IPhoneEmail> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(
    private events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>(
      '[name="email"]',
      this.container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      '[name="phone"]',
      this.container,
    );

    this.emailInput.addEventListener("input", () => {
      this.events.emit("form:change", {
        field: "email",
        value: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("form:change", {
        field: "phone",
        value: this.phoneInput.value,
      });
    });

    this.formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("contacts:submit");
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}
