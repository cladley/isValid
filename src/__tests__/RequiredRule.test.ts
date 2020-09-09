import { RequiredRule } from "../rules/RequiredRule";

describe("'required' rule", () => {
  describe("attached to input of type text", () => {
    let input: HTMLInputElement;
    let requiredRule: RequiredRule;
    const stringValue = "test string";
    beforeEach(() => {
      input = document.createElement("input");
      input.type = "text";
      input.value = stringValue;

      requiredRule = new RequiredRule(input);
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

  describe("attached to input of type checkbox", () => {
    let input: HTMLInputElement;
    let requiedRule: RequiredRule;

    beforeEach(() => {
      input = document.createElement("input");
      input.type = "checkbox";

      requiedRule = new RequiredRule(input);
    });

    it("should fail validation if checkbox is not checked", () => {
      expect(requiedRule.validate()).toEqual(false);
    });

    it("should pass validation when checkbox is checked", () => {
      input.checked = true;
      expect(requiedRule.validate()).toEqual(true);
    });
  });
});
