import { Rule, rules } from "./rules";
import { ErrorRenderer } from "./ErrorRenderer";

export interface ValidationState {
  isValid: boolean;
  errors?: string[];
  element?: HTMLElement;
}

export class FieldValidator {
  element: HTMLElement;
  errorRenderer: ErrorRenderer;
  private validators: Rule[] = [];
  currentValidState: any;

  constructor(element: HTMLElement, rulesBlob: any[], errorRenderer: ErrorRenderer) {
    this.element = element;
    this.errorRenderer = errorRenderer;

    rulesBlob.forEach((rule) => {
      const ruleConstructor = rules.get(rule.name);

      if (ruleConstructor) {
        this.validators.push(new ruleConstructor(element, rule.params));
      } else {
        throw new Error("No rule registered for rule: " + rule.name);
      }
    });
  }

  clearError() {
    this.errorRenderer.clearError();
  }

  showError() {
    this.errorRenderer.showError(this.currentValidState.errors[0]);
  }

  validate(): ValidationState {
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

    // Save the current errors so
    // that they can be displayed later
    this.currentValidState = {
      isValid: errors.length === 0,
      errors: errorMessages,
    };

    return {
      ...this.currentValidState,
      element: this.element,
    };
  }
}
