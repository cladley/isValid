import { RulesExtractor } from "./RulesExtractor";
import { FieldValidator } from "./FieldValidator";
import { ErrorRenderer } from "./ErrorRenderer";
import { addRule, RuleType } from "./rules";

interface ValidateProps {
  prefix?: string;
  parentSelector?: string;
  errorClass?: string;
  parentErrorClass?: string;
  pristineClass?: string;
  errorElementType: string;
  clearOnFocus: boolean;
  live: boolean;
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

  static registerValidatorRule(ruleName: string, rule: RuleType) {
    addRule(ruleName, rule);
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
    console.log(elementRules);

    for (const [element, rules] of elementRules) {
      this.activeValidators.push(
        new FieldValidator(
          element,
          rules,
          new ErrorRenderer(element, {
            errorClass: this.props.errorClass as string,
            parentSelector: this.props.parentSelector as string,
            parentErrorClass: this.props.parentErrorClass as string,
            errorElementType: this.props.errorElementType,
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

  onFormSubmit = (event: Event) => {
    if (this.props.onSubmit) {
      const { isValid, errors } = this.validate();
      this.props.onSubmit(event, isValid, errors);
    }
  };

  validate(silent = false): { isValid: boolean; errors: InputErrors[] } {
    let areAllValid = true;
    const allErrors: InputErrors[] = [];

    this.activeValidators.forEach((v) => {
      const { isValid, element, errors } = v.validate(silent);
      areAllValid = areAllValid && isValid;

      if (!isValid) {
        v.showError();

        allErrors.push({
          element: element as HTMLElement,
          errors: errors as string[],
        });
      } else {
        v.clearError();
      }
    });

    return {
      isValid: areAllValid,
      errors: allErrors,
    };
  }
}
