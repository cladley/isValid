import { Rule } from "./index";

export class RequiredRule implements Rule {
  element: HTMLElement | HTMLInputElement;
  params: Record<string, string>;
  priority = 100;
  name = "required";

  constructor(element: HTMLElement, params: Record<string, string> = {}) {
    this.element = element;
    this.params = params;
  }

  getValue(): any {
    if (this.element instanceof HTMLInputElement) {
      if (this.element.type === "checkbox") {
        return this.element.checked;
      } else {
        return this.element.value;
      }
    } else if (this.element instanceof HTMLSelectElement) {
      if (this.element.selectedIndex) {
        return this.element.options[this.element.selectedIndex].value;
      } else {
        return false;
      }
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
