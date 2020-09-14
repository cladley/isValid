import { Rule, rules } from "./rules";
import { createDebouncedPromiseFunction, debounce, isInputElement } from "./utils";
import { FieldRenderer } from "./FieldRenderer";

export interface ValidationState {
  isValid: boolean;
  errors: string[];
  element: HTMLElement;
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
  validClass: string;
}

export enum FieldState {
  isValid,
  isValiding,
  isError,
  isPristine,
}

export class FieldValidator {
  element: HTMLElement | HTMLInputElement;
  fieldRenderer: FieldRenderer;
  debouncedPromise = createDebouncedPromiseFunction();
  currentValidState: any;
  errors: string[] = [];
  props: FieldValidatorProps;
  prevValue: string = "";
  hasChangedSinceLastValidation: boolean = true;
  private validators: Rule[] = [];

  constructor(
    element: HTMLElement | HTMLInputElement,
    rulesBlob: any[],
    props: FieldValidatorProps
  ) {
    this.element = element;
    this.props = props;
    this.fieldRenderer = new FieldRenderer(this.element, this.props);

    if (isInputElement(this.element)) {
      this.prevValue = this.element.value;
    }

    this.fieldRenderer.fieldState = FieldState.isPristine;
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
  }

  attachEvents() {
    if (this.props.clearOnFocus) {
      this.element.addEventListener("focus", this.onFocus);
    }

    this.element.addEventListener("blur", this.onBlur);
    this.element.addEventListener("input", debounce(this.onChange, 200));
  }

  onFocus = () => {
    this.clearError();
  };

  onBlur = () => {
    if (this.fieldRenderer.fieldState === FieldState.isPristine) return;

    if (isInputElement(this.element)) {
      if (this.element.value !== this.prevValue) {
        this.validate(true);
      }
    } else {
      this.validate(true);
    }
  };

  onChange = () => {
    this.hasChangedSinceLastValidation = true;
    if (isInputElement(this.element)) {
      this.prevValue = this.element.value;
    }
    this.validate(true);
  };

  clearError() {
    this.fieldRenderer.hideError();
  }

  showError() {
    if (this.errors && this.errors.length > 0) {
      this.fieldRenderer.showError(this.errors[0]);
    }
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

  async validate(force: boolean): Promise<ValidationState> {
    if (!this.hasChangedSinceLastValidation && !force) {
      return {
        isValid: this.errors.length === 0,
        errors: this.errors,
        element: this.element,
      };
    }

    this.fieldRenderer.fieldState = FieldState.isValiding;

    try {
      const errors = await this.debouncedPromise<Rule[]>(this.checkAllValidators.bind(this));

      if (errors) {
        // this.element.classList.remove(this.props.validatingClass);
        this.errors = this.extractErrorMessages(errors);
        const isValid = this.errors.length === 0;
        this.toggleErrorMessage(isValid);

        if (isValid) {
          this.fieldRenderer.fieldState = FieldState.isValid;
        } else {
          this.fieldRenderer.fieldState = FieldState.isError;
        }

        this.hasChangedSinceLastValidation = false;

        return {
          isValid,
          errors: this.errors,
          element: this.element,
        };
      } else {
        // throw new Error("This is BAD YOOOO");
        return;
      }
    } catch (error) {}
  }
}
