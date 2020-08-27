import { Rule } from "./index";

export class RequiredRule implements Rule {
  element: HTMLElement | HTMLInputElement;
  params: Record<string, string>;
  priority = 100;
  name = "required";

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

  validate(): boolean {
    const value = this.getValue();

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
