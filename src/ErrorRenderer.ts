export interface ErrorRendererProps {
  errorClass: string;
  parentSelector: string;
  errorElementType: string;
  parentErrorClass: string;
}

export class ErrorRenderer {
  element: HTMLElement;
  parentElement: HTMLElement | null;
  errorClass: string;
  parentSelector: string;
  parentErrorClass: string;
  errorElementType: string;
  errorElement?: HTMLElement;

  constructor(element: HTMLElement, props: ErrorRendererProps) {
    this.element = element;
    this.errorClass = props.errorClass;
    this.parentSelector = props.parentSelector;
    this.errorElementType = props.errorElementType;
    this.parentErrorClass = props.parentErrorClass;
    this.parentElement = this.element.closest(this.parentSelector);
  }

  getErrorElement(): HTMLElement {
    if (this.errorElement) {
      return this.errorElement;
    }

    this.errorElement = document.createElement(this.errorElementType);
    this.errorElement.classList.add(this.errorClass);
    return this.errorElement;
  }

  showError(errorMessage: string) {
    const errorElement = this.getErrorElement();
    errorElement.textContent = errorMessage;
    errorElement.style.display = "initial";
    this.parentElement?.appendChild(errorElement);
    this.parentElement?.classList.add(this.parentErrorClass);
  }

  clearError(): void {
    if (!this.errorElement) return;

    this.errorElement.textContent = "";
    this.errorElement.style.display = "none";
    this.parentElement?.classList.remove(this.parentErrorClass);
  }
}
