import { Rule } from './index';
import { extractValueAndOperator } from '../utils';

export class RequiredMultipleRule implements Rule {
  element: HTMLElement | HTMLInputElement;
  inputs: HTMLInputElement[];
  params: Record<string, string>;
  priority = 100;
  name = 'requiredMultiple';
  message = '';

  constructor(element: HTMLElement, params: Record<string, string> = {}) {
    this.element = element;
    this.inputs = Array.from(this.element.querySelectorAll<HTMLInputElement>('input'));

    if (!this.inputs) {
      throw new Error('Some error about requiredMultiple');
    }
    this.params = params;
    this.message = this.params.message;
  }

  getValue(): any {}

  validate(): boolean {
    const valueOperator = extractValueAndOperator(this.params.ruleValue);
    const filledValues = this.inputs.filter((element) => {
      if (element.type === 'checkbox') {
        return element.checked;
      }
      return element.value.trim() !== '';
    });
    // eslint-disable-next-line no-eval
    return eval(`${filledValues.length} ${valueOperator.operator} ${valueOperator.value}`);
  }
}
