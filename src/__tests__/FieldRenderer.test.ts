import { screen } from "@testing-library/dom";
import { FieldRenderer } from "../FieldRenderer";
import { FieldState } from "../FieldValidator";

const htmlTemplateString = `
  <div class="form-group" data-testid="parent">
    <label>First Name:</label>
    <input
      class="firstName"
      type="text"
      name="firstName"
    />
  </div>  
`;

describe("class FieldRenderer", () => {
  let fieldRenderer: FieldRenderer;
  let inputElement: HTMLElement;

  const errorMessage = "This is an error message";
  const selector = ".firstName";
  const props = {
    errorClass: "is-error",
    errorElementType: "span",
    errorElementClass: "error",
    parentSelector: ".form-group",
    parentErrorClass: "is-error",
    validatingClass: "is-validating",
    validClass: "is-valid",
    pristineClass: "is-pristine",
  };

  beforeEach(() => {
    document.body.innerHTML = htmlTemplateString;
    inputElement = document.querySelector<HTMLElement>(selector) as HTMLElement;
    fieldRenderer = new FieldRenderer(inputElement, props);
  });

  it("Should display error element with passed in error message", async () => {
    expect(screen.queryByText(errorMessage)).toBeNull();
    fieldRenderer.showError(errorMessage);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("Should hide error message", () => {
    fieldRenderer.showError(errorMessage);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    fieldRenderer.hideError();
    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it("should create error message dom element based in errorElementType prop", () => {
    fieldRenderer = new FieldRenderer(inputElement, { ...props, errorElementType: "p" });
    fieldRenderer.showError(errorMessage);
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement.tagName).toEqual("P");
  });

  it("should add error class to parent element", () => {
    const parentElement = screen.getByTestId("parent");
    expect(parentElement.classList.contains(props.parentErrorClass)).toBeFalsy();
    fieldRenderer.showError(errorMessage);
    expect(parentElement.classList.contains(props.parentErrorClass)).toBeTruthy();
  });

  it("should add validating class when fieldState is set to isValidating", () => {
    let el = document.querySelector("." + props.validatingClass);
    expect(el).toBeFalsy();
    fieldRenderer.fieldState = FieldState.isValiding;
    el = document.querySelector("." + props.validatingClass);
    expect(el).toBeTruthy();
  });

  it("should add error class when fieldState is set to isError", () => {
    let el = document.querySelector("." + props.errorClass);
    expect(el).toBeFalsy();
    fieldRenderer.fieldState = FieldState.isError;
    el = document.querySelector("." + props.errorClass);
    expect(el).toBeTruthy();
  });

  it("should add valid class when fieldState is set to isValid", () => {
    let el = document.querySelector("." + props.validClass);
    expect(el).toBeFalsy();
    fieldRenderer.fieldState = FieldState.isValid;
    el = document.querySelector("." + props.validClass);
    expect(el).toBeTruthy();
  });
});
