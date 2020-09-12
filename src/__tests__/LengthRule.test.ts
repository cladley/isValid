import { LengthRule } from "../rules/LengthRule";

describe("'required' rule", () => {
  let input: HTMLInputElement;
  let lengthRule: LengthRule;
  const stringValue = "test";

  describe("testing operation of >=4", () => {
    beforeEach(() => {
      input = document.createElement("input");
      input.type = "text";
      input.value = stringValue;

      lengthRule = new LengthRule(input, { ruleValue: ">=4" });
    });

    it("should return the value of text when dealing with text input", () => {
      expect(lengthRule.getValue()).toEqual(stringValue);
      input.value = "";
      expect(lengthRule.getValue()).toEqual("");
    });

    it("Should pass validation when it contains 4 or more characters", () => {
      expect(lengthRule.validate()).toEqual(true);
    });

    it("should fail validation when input has less than 4 characters", () => {
      input.value = "abc";
      expect(lengthRule.validate()).toEqual(false);
      input.value = "";
      expect(lengthRule.validate()).toEqual(false);
    });
  });

  describe("testing operation of <3", () => {
    beforeEach(() => {
      input = document.createElement("input");
      lengthRule = new LengthRule(input, { ruleValue: "<3" });
    });

    it("Should pass validation when it contains less than 3 characters", () => {
      input.value = "ab";
      expect(lengthRule.validate()).toEqual(true);
    });

    it("should fail validation when input has more than 3 characters", () => {
      input.value = "abc";
      expect(lengthRule.validate()).toEqual(false);
    });
  });
});
