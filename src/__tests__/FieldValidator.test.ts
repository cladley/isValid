import { screen } from "@testing-library/dom";
import { FieldValidator } from "../FieldValidator";

const errorRequiredMessage = "This is required";
const errorLengthMessage = "Needs to be at least 4 characters";

const rules = [
  { name: "required", params: { ruleValue: "", message: errorRequiredMessage } },
  { name: "length", params: { ruleValue: ">=4", message: errorLengthMessage } },
];

const props = {
  clearOnFocus: false,
  live: false,
  pristineClass: "is-pristine",
  validatingClass: "is-validating",
  validClass: "is-valid",
  errorClass: "is-error",
  errorElementType: "span",
  errorElementClass: "error",
  parentSelector: ".form-group",
  parentErrorClass: "is-error",
};

const htmlTemplateString = `
  <div class="form-group">
    <label>First Name:</label>
    <input
      id="firstName"
      class="firstName"
      type="text"
      name="firstName"
    />
  </div>  
`;

describe("class FieldValidator", () => {
  let fieldValidator: FieldValidator;
  let input: HTMLInputElement;

  beforeEach(() => {
    document.body.innerHTML = htmlTemplateString;
    input = document.querySelector<HTMLInputElement>("#firstName") as HTMLInputElement;
    fieldValidator = new FieldValidator(input, rules, props);
  });

  it("Should show required error message when input is empty", async () => {
    expect(screen.queryByText(errorRequiredMessage)).toBeNull();
    fieldValidator.validate(true);
    const errorElement = await screen.findByText(errorRequiredMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it("Should show the length error message when the input has less than 4 characters", async () => {
    expect(screen.queryByText(errorLengthMessage)).toBeNull();
    input.value = "ab";
    fieldValidator.validate(true);
    const errorElement = await screen.findByText(errorLengthMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it("should show required error message first and then length error message after", async () => {
    expect(screen.queryByText(errorRequiredMessage)).toBeNull();
    expect(screen.queryByText(errorLengthMessage)).toBeNull();

    input.value = "";
    fieldValidator.validate(true);
    let errorElement = await screen.findByText(errorRequiredMessage);

    expect(errorElement).toBeInTheDocument();

    input.value = "ab";
    fieldValidator.validate(true);
    errorElement = await screen.findByText(errorLengthMessage);
    expect(errorElement).toBeInTheDocument();
  });

  it("Should not show any error message when the input passes validation", async () => {
    expect(screen.queryByText(errorRequiredMessage)).toBeNull();
    expect(screen.queryByText(errorLengthMessage)).toBeNull();

    input.value = "abcd";
    await fieldValidator.validate(true);
    expect(screen.queryByText(errorRequiredMessage)).toBeNull();
    expect(screen.queryByText(errorLengthMessage)).toBeNull();
  });
});
