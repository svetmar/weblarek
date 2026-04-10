import { Component } from "../../base/Component";

export abstract class Card<T> extends Component<T> {
  protected constructor(container: HTMLElement) {
    super(container);
  }

  protected setText(element: HTMLElement, value: string) {
    element.textContent = value;
  }
}
