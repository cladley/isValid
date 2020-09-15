import { Rule } from "./index";
import { isInputElement, escapeRegex } from "../utils";

export class RegexRule implements Rule {
  element: HTMLElement | HTMLInputElement;
  params: Record<string, string>;
  priority = 99;
  name = "regex";
  message = "";
  regExp: RegExp;

  constructor(element: HTMLElement, params: Record<string, string> = {}) {
    this.element = element;
    this.params = params;
    this.message = this.params.message;
    this.regExp = new RegExp(this.params.ruleValue, this.params.flags);
  }

  getValue(): any {
    if (this.element instanceof HTMLInputElement) {
      return this.element.value;
    }
  }

  validate(): boolean {
    const value = this.getValue();
    return this.regExp.test(value);
  }
}
