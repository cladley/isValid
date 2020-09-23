import { RulesExtractor } from './RulesExtractor';
import { FieldValidator } from './FieldValidator';
import { addRule, RuleType } from './rules';

// interface SubmitEvent extends Event {
//   submitter: HTMLElement;
// }

// interface HTMLFormElement {
//   onsubmit: (this: GlobalEventHandlers, ev: SubmitEvent) => any | null;
// }

interface ValidateProps {
  prefix?: string;
  parentSelector?: string;
  errorClass?: string;
  parentErrorClass?: string;
  pristineClass?: string;
  validatingClass?: string;
  validClass?: string;
  errorElementClass?: string;
  errorElementType?: string;
  clearOnFocus?: boolean;
  live?: boolean;
  onSubmit?(event: Event, isValid: boolean, errors: InputErrors[]): void;
}

interface InputErrors {
  element: HTMLElement;
  errors: string[];
}

const defaultProps = {
  prefix: 'data-validate',
  parentSelector: '.form-group',
  errorClass: 'is-error',
  pristineClass: 'is-pristine',
  validatingClass: 'is-validating',
  validClass: 'is-valid',
  errorElementClass: 'error',
  errorElementType: 'span',
  clearOnFocus: false,
  live: false,
};

export class Validate {
  element: HTMLFormElement;
  props: ValidateProps;
  rulesExtractor: RulesExtractor;
  activeValidators: FieldValidator[] = [];

  static registerValidatorRuleClass(ruleName: string, rule: RuleType) {
    addRule(ruleName, rule);
  }

  static registerValidatorRuleFunction(
    ruleName: string,
    priority = 100,
    validateFunction: (
      value: any,
      setMessage: (value: string) => void,
      restoreMessage: () => void
    ) => boolean | Promise<boolean | undefined>
  ) {
    class DynamicClass {
      element: HTMLElement;
      params: Record<string, string>;
      priority: number;
      name: string;
      originalMessage: string;
      message: string;

      constructor(element: HTMLElement, params: Record<string, string>) {
        this.element = element;
        this.params = params;
        this.name = ruleName;
        this.priority = priority;
        this.originalMessage = this.params.message;
        this.message = this.params.message;
      }

      setMessage(value: string) {
        this.message = value;
      }

      restoreMessage() {
        this.message = this.originalMessage;
      }

      getValue() {
        if (this.element instanceof HTMLInputElement) {
          return this.element.value;
        }

        return this.element;
      }

      validate(): boolean | Promise<boolean | undefined> {
        const value = this.getValue();
        return validateFunction(value, this.setMessage.bind(this), this.restoreMessage.bind(this));
      }
    }

    addRule(ruleName, DynamicClass);
  }

  constructor(element: HTMLFormElement, props: ValidateProps) {
    this.element = element;
    this.props = { ...defaultProps, ...props };
    this.rulesExtractor = new RulesExtractor(this.props.prefix);

    this.attachEvents();
    this.init();
  }

  init() {
    this.element.setAttribute('aria-live', 'assertive');
    this.element.setAttribute('aria-relevant', 'addition removals');
    this.element.setAttribute('novalidate', '');
    const elementRules = this.rulesExtractor.getElementsWithValidationRules(this.element);
    console.log(elementRules);
    for (const [element, rules] of elementRules) {
      console.log(rules);
      this.activeValidators.push(new FieldValidator(element, rules, this.props));
    }
  }

  attachEvents() {
    if (this.props.onSubmit) {
      this.element.addEventListener('submit', this.onFormSubmit);
    }
  }

  onFormSubmit = async (event: Event) => {
    if (this.props.onSubmit) {
      event.preventDefault();
      event.submitter.setAttribute('disabled', '');
      this.element.classList.add(this.props.validatingClass as string);
      const { isValid, errors } = await this.validate();
      this.element.classList.remove(this.props.validatingClass as string);
      event.submitter.removeAttribute('disabled');
      this.props.onSubmit(event, isValid, errors);
    }
  };

  async validate(force = false): Promise<{ isValid: boolean; errors: InputErrors[] }> {
    let areAllValid = true;
    const allErrors: InputErrors[] = [];
    const validatorsList = [];

    for (let i = 0; i < this.activeValidators.length; i++) {
      validatorsList.push(this.activeValidators[i].validate(force));
    }

    try {
      const result = await Promise.all(validatorsList);
      for (let i = 0; i < result.length; i++) {
        const { isValid, element, errors } = result[i];

        areAllValid = areAllValid && isValid;
        if (!isValid) {
          this.activeValidators[i].showError();

          allErrors.push({
            element: element as HTMLElement,
            errors: errors as string[],
          });
        } else {
          this.activeValidators[i].clearError();
        }
      }

      return {
        isValid: areAllValid,
        errors: allErrors,
      };
    } catch (err) {
      throw new Error('asd');
    }
  }
}
