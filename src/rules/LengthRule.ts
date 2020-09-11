import { Rule } from "./index";
import { extractValueAndOperator } from "../utils";

export class LengthRule implements Rule {
  element: HTMLElement | HTMLInputElement;
  params: Record<string, string>;
  priority = 99;
  name = "length";

  constructor(element: HTMLElement, params: Record<string, string>) {
    this.element = element;
    console.log(params);
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
    const valueOperator = extractValueAndOperator(this.params.ruleValue);
    return eval(`${value.trim().length} ${valueOperator.operator} ${valueOperator.value}`);
  }
}
