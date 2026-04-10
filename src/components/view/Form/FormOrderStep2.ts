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
      this.isValid = this.checkValidity();
    });
    this.phoneInput.addEventListener("input", () => {
      this.isValid = this.checkValidity();
    });
    this.formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("contacts:submit", this.values);
    });
  }

  set values(data: IPhoneEmail) {
    this.emailInput.value = data.email;
    this.phoneInput.value = data.phone;
    this.isValid = this.checkValidity();
  }

  get values(): IPhoneEmail {
    return {
      email: this.emailInput.value,
      phone: this.phoneInput.value,
    };
  }

  validate(): boolean {
    let isValid = true;
    this.errorMessageEl.textContent = "";
    if (!this.emailInput.value.trim()) {
      isValid = false;
      this.errorMessageEl.textContent += "Введите электронный адрес. ";
    }
    if (!this.phoneInput.value.trim()) {
      isValid = false;
      this.errorMessageEl.textContent += "Введите номер телефона. ";
    }
    return isValid;
  }

  checkValidity(): boolean {
    return !!this.emailInput.value.trim() && !!this.phoneInput.value.trim();
  }
}
