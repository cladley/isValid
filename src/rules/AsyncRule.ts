import { Rule } from "./index";

function wait(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

export class AsyncRule implements Rule {
  element: HTMLElement | HTMLInputElement;
  params: Record<string, string>;
  priority = 100;
  name = "async";

  constructor(element: HTMLElement, params: Record<string, string>) {
    this.element = element;
    this.params = params;
  }

  getValue(): any {
    if (this.element instanceof HTMLInputElement) {
      return this.element.value;
    }

    return this.element;
  }

  async validate(): Promise<boolean> {
    const value = this.getValue();

    await wait(4000);

    if (typeof value === "string") {
      if (value.trim() === "") {
        return false;
      }
      return true;
    } else {
      return value;
    }
  }
}
