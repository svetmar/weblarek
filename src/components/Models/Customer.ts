import type { IBuyer, TPayment } from "../../types/index.ts";

export class Customer {
  private data: Partial<IBuyer> = {};

  update(data: Partial<IBuyer>): void {
    this.data = { ...this.data, ...data };
  }

  getData(): Partial<IBuyer> {
    return this.data;
  }

  clear(): void {
    this.data = {};
  }

  validate(): {
    isValid: boolean;
    errors: Partial<Record<keyof IBuyer, string>>;
  } {
    const errors: Partial<Record<keyof IBuyer, string>> = {};
    if (!this.data.payment?.trim()) {
      errors.payment = "Не выбран вид оплаты";
    }
    if (!this.data.email?.trim()) {
      errors.email = "Укажите емэйл";
    }
    if (!this.data.phone?.trim()) {
      errors.phone = "Введите номер телефона";
    }
    if (!this.data.address?.trim()) {
      errors.address = "Введите адрес";
    }
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}
