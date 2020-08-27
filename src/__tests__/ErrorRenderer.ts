import { screen } from "@testing-library/dom";
import { ErrorRenderer } from "../ErrorRenderer";

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

describe("class ErrorRenderer", () => {
  let errorRenderer: ErrorRenderer;
  let inputElement: HTMLElement;

  const errorMessage = "This is an error message";
  const selector = ".firstName";
  const props = {
    errorClass: "error",
    errorElementType: "span",
    parentSelector: ".form-group",
    parentErrorClass: "is-error",
  };

  beforeEach(() => {
    document.body.innerHTML = htmlTemplateString;
    inputElement = document.querySelector<HTMLElement>(selector) as HTMLElement;
    errorRenderer = new ErrorRenderer(inputElement, props);
  });

  it("Should display error element with passed in error message", async () => {
    expect(screen.queryByText(errorMessage)).toBeNull();
    errorRenderer.showError(errorMessage);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("Should hide error message", () => {
    errorRenderer.showError(errorMessage);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();

    errorRenderer.clearError();
    expect(screen.queryByText(errorMessage)).toBeNull();
  });

  it("should create error message dom element based in errorElementType prop", () => {
    errorRenderer = new ErrorRenderer(inputElement, { ...props, errorElementType: "p" });
    errorRenderer.showError(errorMessage);
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement.tagName).toEqual("P");
  });

  it("should add error class to parent element", () => {
    const parentElement = screen.getByTestId("parent");
    expect(parentElement.classList.contains(props.parentErrorClass)).toBeFalsy();
    errorRenderer.showError(errorMessage);
    expect(parentElement.classList.contains(props.parentErrorClass)).toBeTruthy();

    screen.debug();
  });
});
