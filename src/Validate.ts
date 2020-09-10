import { RulesExtractor } from "./RulesExtractor";
import { FieldValidator } from "./FieldValidator";
import { ErrorRenderer } from "./ErrorRenderer";
import { addRule, RuleType, Rule } from "./rules";

interface ValidateProps {
  prefix?: string;
  parentSelector?: string;
  errorClass?: string;
  parentErrorClass?: string;
  pristineClass?: string;
  validatingClass?: string;
  validClass?: string;
  successClass?: string;
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
  prefix: "data-validate",
  parentSelector: ".form-group",
  parentErrorClass: "is-error",
  pristineClass: "is-pristine",
  validatingClass: "is-validating",
  validClass: "is-valid",
  errorClass: "error",
  errorElementType: "span",
  clearOnFocus: false,
  live: false,
};

export class Validate {
  element: HTMLElement;
  props: ValidateProps;
  rulesExtractor: RulesExtractor;
  activeValidators: FieldValidator[] = [];

  static registerValidatorRuleClass(ruleName: string, rule: RuleType) {
    addRule(ruleName, rule);
  }

  static registerValidatorRuleFunction(
    ruleName: string,
    priority = 100,
    validateFunction: (value: any) => {}
  ) {
    const dynamicClass = function (element: HTMLElement, params: Record<string, string>) {
      this.element = element;
      this.params = params;
      this.name = ruleName;
      this.priority = priority;
    };

    dynamicClass.prototype.getValue = function (): any {
      if (this.element instanceof HTMLInputElement) {
        return this.element.value;
      }

      return this.element;
    };

    dynamicClass.prototype.validate = function () {
      const value = this.getValue();
      return validateFunction(value);
    };

    addRule(ruleName, dynamicClass);
  }

  constructor(element: HTMLElement, props: ValidateProps) {
    this.element = element;
    this.props = { ...defaultProps, ...props };
    this.rulesExtractor = new RulesExtractor(this.props.prefix);

    this.attachEvents();
    this.init();
  }

  init() {
    const elementRules = this.rulesExtractor.getElementsWithValidationRules(this.element);

    for (const [element, rules] of elementRules) {
      this.activeValidators.push(
        new FieldValidator(
          element,
          rules,
          new ErrorRenderer(element, {
            errorClass: this.props.errorClass as string,
            parentSelector: this.props.parentSelector as string,
            parentErrorClass: this.props.parentErrorClass as string,
            errorElementType: this.props.errorElementType as string,
          }),
          this.props
        )
      );
    }
  }

  attachEvents() {
    if (this.props.onSubmit) {
      this.element.addEventListener("submit", this.onFormSubmit);
    }
  }

  onFormSubmit = async (event: Event) => {
    if (this.props.onSubmit) {
      event.preventDefault();
      const { isValid, errors } = await this.validate();
      this.props.onSubmit(event, isValid, errors);
    }
  };

  async validate(silent = false): Promise<{ isValid: boolean; errors: InputErrors[] }> {
    let areAllValid = true;
    const allErrors: InputErrors[] = [];

    // this.element.classList.add(this.props.validatingClass as string);
    const validatorsList = [];

    for (let i = 0; i < this.activeValidators.length; i++) {
      validatorsList.push(this.activeValidators[i].validate(silent));
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

      // this.element.classList.remove(this.props.validatingClass as string);

      return {
        isValid: areAllValid,
        errors: allErrors,
      };
    } catch (err) {
      console.error("We caught an error");
    }
  }
}
