import type { IPaymentDelivery, TPayment, IBuyer } from "../../../types/index";
import type { IEvents } from "../../base/Events";
import { ensureElement, ensureAllElements } from "../../../utils/utils";
import { Form } from "./Form";

export class FormOrderStep1 extends Form<IPaymentDelivery> {
  private _payment?: TPayment;
  private paymentButtons: HTMLButtonElement[];
  private addressInput: HTMLInputElement;

  constructor(
    private events: IEvents,
    container: HTMLElement,
  ) {
    super(container);

    this.paymentButtons = ensureAllElements<HTMLButtonElement>(
      ".order__buttons button",
      this.container,
    );
    this.addressInput = ensureElement<HTMLInputElement>(
      "input",
      this.container,
    );

    this.paymentButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.events.emit("form:change", {
        field: "payment",
        value: button.name,
      })
      });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("form:change", {
        field: "address",
        value: this.addressInput.value,
      });
    });

    this.formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("order:submit");
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  };

  set payment(value: TPayment) {
    this._payment = value;
    this.updatePaymentUI();
  };

  set errors(errors: Partial<Record<keyof IBuyer, string>>) {
    this.errorMessageEl.textContent = Object.values(errors).join(" ");
  };

  private updatePaymentUI() {
    //активация выбранной кнопки в UI
    this.paymentButtons.forEach((button) => {
      button.classList.toggle(
        "button_alt-active",
        this.payment === button.name,
      );
    });
  }
}
