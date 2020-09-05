import { Rule, rules } from "./rules";
import { ErrorRenderer } from "./ErrorRenderer";

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
}

export class FieldValidator {
  element: HTMLElement;
  errorRenderer: ErrorRenderer;
  currentValidState: any;
  props: FieldValidatorProps;
  private validators: Rule[] = [];

  constructor(
    element: HTMLElement,
    rulesBlob: any[],
    errorRenderer: ErrorRenderer,
    props: FieldValidatorProps
  ) {
    this.element = element;
    this.errorRenderer = errorRenderer;
    this.props = props;

    rulesBlob.forEach((rule) => {
      const ruleConstructor = rules.get(rule.name);

      if (ruleConstructor) {
        this.validators.push(new ruleConstructor(element, rule.params));
      } else {
        // throw new Error("No rule registered for rule: " + rule.name);
      }
    });

    this.element.classList.add(this.props.pristineClass);
    this.attachEvents();
  }

  attachEvents() {
    if (this.props.clearOnFocus) {
      this.element.addEventListener("focus", this.onFocus);
    }

    this.element.addEventListener("blur", this.onBlur);
    this.element.addEventListener("input", this.onChange);
  }

  onFocus = () => {
    this.clearError();
  };

  onBlur = () => {
    if (!this.element.classList.contains(this.props.pristineClass)) {
      this.validate(true);
    }
  };

  onChange = () => {
    this.element.classList.remove(this.props.pristineClass);

    this.validate(true);
  };

  clearError() {
    this.errorRenderer.clearError();
  }

  showError() {
    this.errorRenderer.showError(this.currentValidState.errors[0]);
  }

  validate(silent: boolean): ValidationState {
    const errors: Rule[] = [];

    this.validators.forEach((v) => {
      if (!v.validate()) {
        errors.push(v);
      }
    });

    errors.sort((a, b) => {
      return a.priority - b.priority;
    });

    const errorMessages = errors.map((e) => {
      return e.params.message;
    });

    const isValid = errors.length === 0;
    // Save the current errors so
    // that they can be displayed later
    this.currentValidState = {
      isValid,
      errors: errorMessages,
    };

    if (isValid) {
      this.clearError();
    } else {
      this.showError();
    }

    return {
      ...this.currentValidState,
      element: this.element,
    };
  }
}
