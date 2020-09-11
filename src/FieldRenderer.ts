import { FieldState } from "./FieldValidator";

export interface FieldRendererProps {
  errorClass: string;
  parentSelector: string;
  errorElementType: string;
  errorElementClass: string;
  parentErrorClass: string;
  validatingClass: string;
  validClass: string;
  pristineClass: string;
}

export class FieldRenderer {
  element: HTMLElement;
  parentElement: HTMLElement | null;
  errorElement?: HTMLElement;
  _fieldState: FieldState = FieldState.isPristine;
  props: FieldRendererProps;

  constructor(element: HTMLElement, props: FieldRendererProps) {
    this.element = element;
    this.props = props;
    this.parentElement = this.element.closest(this.props.parentSelector);
  }

  set fieldState(value: FieldState) {
    // Remove all state classes first
    this.element.classList.remove(
      this.props.pristineClass,
      this.props.validatingClass,
      this.props.validClass,
      this.props.errorClass
    );

    this.parentElement?.classList.remove(
      this.props.pristineClass,
      this.props.validatingClass,
      this.props.validClass,
      this.props.errorClass
    );

    this._fieldState = value;

    switch (this._fieldState) {
      case FieldState.isPristine:
        this.element.classList.add(this.props.pristineClass);
        this.parentElement?.classList.add(this.props.pristineClass);
        break;
      case FieldState.isValid:
        this.element.classList.add(this.props.validClass);
        this.parentElement?.classList.add(this.props.validClass);
        break;
      case FieldState.isValiding:
        this.element.classList.add(this.props.validatingClass);
        this.parentElement?.classList.add(this.props.validatingClass);
        break;
      case FieldState.isError:
        this.element.classList.add(this.props.errorClass);
        this.parentElement?.classList.add(this.props.errorClass);
        break;
    }
  }

  get fieldState(): FieldState {
    return this._fieldState;
  }

  getErrorElement(): HTMLElement {
    if (this.errorElement) return this.errorElement;

    this.errorElement = document.createElement(this.props.errorElementType);
    this.errorElement.classList.add(this.props.errorElementClass);
    return this.errorElement;
  }

  showError(text: string): void {
    const errorElement = this.getErrorElement();
    errorElement.textContent = text;
    errorElement.style.display = "";
    this.parentElement?.appendChild(errorElement);
    this.parentElement?.classList.add(this.props.errorClass);
  }

  hideError(): void {
    if (!this.errorElement) return;

    this.errorElement.textContent = "";
    this.errorElement.style.display = "none";
    this.parentElement?.classList.remove(this.props.errorClass);
  }
}
