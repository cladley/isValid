import { RequiredRule } from "../rules/RequiredRule";

describe("'required' rule", () => {
  let input: HTMLInputElement;
  let requiredRule: RequiredRule;
  const stringValue = "test string";

  beforeEach(() => {
    input = document.createElement("input");
    input.type = "text";
    input.value = stringValue;

    requiredRule = new RequiredRule(input, {});
  });

  it("should return the value of text when dealing with text input", () => {
    expect(requiredRule.getValue()).toEqual(stringValue);
    input.value = "";
    expect(requiredRule.getValue()).toEqual("");
  });

  it("should pass validation when it has a value", () => {
    expect(requiredRule.validate()).toEqual(true);
  });

  it("should fail validation when input doesn't have value", () => {
    input.value = "";
    expect(requiredRule.validate()).toEqual(false);
    // test with some whitespace
    input.value = "     ";
    expect(requiredRule.validate()).toBe(false);
  });
});
