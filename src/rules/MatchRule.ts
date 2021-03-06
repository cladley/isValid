import { Rule } from './index';
import { isInputElement } from '../utils';

export class MatchRule implements Rule {
  element: HTMLElement | HTMLInputElement;
  otherElement: HTMLInputElement | null;
  params: Record<string, string>;
  priority = 99;
  name = 'match';
  message = '';

  constructor(element: HTMLElement, params: Record<string, string>) {
    this.element = element;
    this.params = params;
    this.message = this.params.message;
    this.otherElement = document.querySelector<HTMLInputElement>(this.params.ruleValue);

    if (!this.otherElement) {
      throw new Error(
        `MatchRule error: Could not find element by selector '${this.params.ruleValue}'`,
      );
    }
  }

  getValue(): any {
    if (this.otherElement && this.element instanceof HTMLInputElement) {
      return [this.element.value, this.otherElement.value];
    }
  }

  validate(): boolean {
    const [value1, value2] = this.getValue();
    return value1.trim() === value2.trim();
  }
}
