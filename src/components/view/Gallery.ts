import { Component } from "../base/Component";

export class Gallery extends Component<unknown> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set items(elements: HTMLElement[]) {
    this.container.replaceChildren(...elements);
  }

  clear() {
    this.container.replaceChildren();
  }
}
