import { Rule, rules } from "./rules";
import { ErrorRenderer } from "./ErrorRenderer";
import { createDebouncedPromiseFunction, debounce } from "./utils";

export interface ValidationState {
  isValid: boolean;
  errors?: string[];
  element?: HTMLElement;
}

interface FieldValidatorProps {
  /** Clear error message when element is focussed */
  clearOnFocus: boolean;
  /** Validate field as the user types */
  live: boolean;
  /** Class used to indicate that the user hasn't interacted with control yet */
  pristineClass: string;
  /** Class used to indicate that an element is validating */
  validatingClass: string;
}

function isInputElement(element: HTMLElement | HTMLInputElement): boolean {
  return element instanceof HTMLInputElement;
}

export class FieldValidator {
  element: HTMLElement | HTMLInputElement;
  errorRenderer: ErrorRenderer;
  debouncedPromise = createDebouncedPromiseFunction();
  currentValidState: any;
  props: FieldValidatorProps;
  prevValue: string = "";
  private validators: Rule[] = [];

  constructor(
    element: HTMLElement | HTMLInputElement,
    rulesBlob: any[],
    errorRenderer: ErrorRenderer,
    props: FieldValidatorProps
  ) {
    this.element = element;
    this.errorRenderer = errorRenderer;
    this.props = props;

    if (this.element instanceof HTMLInputElement) {
      this.prevValue = this.element.value;
    }

    this.element.classList.add(this.props.pristineClass);
    this.initValidators(rulesBlob);
    this.attachEvents();
  }

  initValidators(activeRules: any[]) {
    activeRules.forEach((rule) => {
      const ruleConstructor = rules.get(rule.name);
      if (ruleConstructor) {
        this.validators.push(new ruleConstructor(this.element, rule.params));
      } else {
        // throw new Error("No rule registered for rule: " + rule.name);
      }
    });

    this.validators = this.validators.sort((a, b) => {
      return b.priority - a.priority;
    });

    console.log(this.validators);
  }

  attachEvents() {
    if (this.props.clearOnFocus) {
      this.element.addEventListener("focus", this.onFocus);
    }

    this.element.addEventListener("blur", this.onBlur);
    this.element.addEventListener("input", debounce(this.onChange, 250, false));
  }

  onFocus = () => {
    this.clearError();
  };

  onBlur = () => {
    if (!this.element.classList.contains(this.props.pristineClass)) {
      if (this.element instanceof HTMLInputElement) {
        if (this.element.value !== this.prevValue) {
          this.validate(true);
        }
      } else {
        this.validate(true);
      }
    }
  };

  onChange = () => {
    this.element.classList.remove(this.props.pristineClass);

    if (this.element instanceof HTMLInputElement) {
      this.prevValue = this.element.value;
    }

    this.validate(true);
  };

  clearError() {
    this.errorRenderer.clearError();
  }

  showError() {
    this.errorRenderer.showError(this.currentValidState.errors[0]);
  }

  async checkAllValidators(): Promise<Rule[]> {
    const errors: Rule[] = [];
    for (let i = 0; i < this.validators.length; i++) {
      const r = await Promise.resolve(this.validators[i].validate());

      if (!r) {
        errors.push(this.validators[i]);
        return errors;
      }
    }

    return errors;
  }

  toggleErrorMessage(isValid: boolean): void {
    if (isValid) {
      this.clearError();
    } else {
      this.showError();
    }
  }

  extractErrorMessages(errors: Rule[]): string[] {
    return errors.map((e) => e.params.message);
  }

  async validate(silent: boolean): Promise<ValidationState> {
    this.element.classList.add(this.props.validatingClass);

    const errors = await this.debouncedPromise<Rule[]>(this.checkAllValidators.bind(this));

    if (errors) {
      this.element.classList.remove(this.props.validatingClass);
      const errorMessages = this.extractErrorMessages(errors);

      this.currentValidState = {
        errors: errorMessages,
      };

      this.toggleErrorMessage(errors.length === 0);

      return {
        isValid: errors.length === 0,
        errors: errorMessages,
        element: this.element,
      };
    } else {
      // throw new Error("This is BAD YOOOO");
      return;
    }
  }
}
