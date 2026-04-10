import type { IPaymentDelivery, TPayment } from "../../../types/index";
import type { IEvents } from "../../base/Events";
import { ensureElement, ensureAllElements } from "../../../utils/utils";
import { Form } from "./Form";

export class FormOrderStep1 extends Form<IPaymentDelivery> {
  private payment: TPayment | undefined;
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
        this.payment = button.name as TPayment;
        this.updatePaymentUI();
        this.isValid = this.checkValidity();
      });
    });

    this.addressInput.addEventListener(
      "input",
      () => (this.isValid = this.checkValidity()),
    );

    this.formEl.addEventListener("submit", (e) => {
      e.preventDefault();
      this.events.emit("order:submit", this.values);
    });
  }

  set values(data: IPaymentDelivery) {
    this.payment = data.payment;
    this.addressInput.value = data.address;

    this.updatePaymentUI();
    this.isValid = this.checkValidity();
  }

  get values(): IPaymentDelivery {
    return {
      payment: this.payment!,
      address: this.addressInput.value,
    };
  }

  validate(): boolean {
    this.errorMessageEl.textContent = "";
    let isValid = true;
    if (!this.payment) {
      this.errorMessageEl.textContent += "Выберите метод оплаты. ";
      isValid = false;
    }
    if (!this.addressInput.value.trim()) {
      this.errorMessageEl.textContent += "Введите адрес. ";
      isValid = false;
    }
    return isValid;
  }

  checkValidity(): boolean {
    //промежуточная проверка формы для управления доступностью кнопки "далее"
    return !!this.payment && !!this.addressInput.value.trim();
  }

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
