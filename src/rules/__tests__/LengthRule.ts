import { LengthRule } from "../LengthRule";
import * as utils from "../../utils";

describe("LengthRule class", () => {
  test("it should call extractValueAndOperator util function when it gets constructed", () => {
    const spy = jest.spyOn(utils, "extractValueAndOperator");
    const constraintString = ">=4";
    new LengthRule({ message: "test", constraint: constraintString });
    expect(spy).toHaveBeenCalledWith(constraintString);
    spy.mockRestore();
  });

  describe("simple rule with n characters", () => {
    const lengthRule = new LengthRule({ message: "test", constraint: "4" });

    it("should pass validation with the correct amount of characters", () => {
      expect(lengthRule.validate("abcd")).toBe(true);
    });

    it("should not pass with incorrect number of characters", () => {
      expect(lengthRule.validate("ab")).toBe(false);
    });
  });

  describe("a greater than rule. For example >=5", () => {
    const lengthRule = new LengthRule({ message: "test", constraint: ">=5" });

    it("should pass validation with the correct amount of characters", () => {
      expect(lengthRule.validate("abcde")).toBe(true);
      expect(lengthRule.validate("abcdefg")).toBe(true);
    });

    it("should not pass with incorrect number of characters", () => {
      expect(lengthRule.validate("abc")).toBe(false);
    });
  });

  describe("a less than rule. For example <=3", () => {
    const lengthRule = new LengthRule({ message: "test", constraint: "<=3" });

    it("should pass validation with the correct amount of characters", () => {
      expect(lengthRule.validate("abc")).toBe(true);
      expect(lengthRule.validate("ab")).toBe(true);
    });

    it("should not pass with incorrect number of characters", () => {
      expect(lengthRule.validate("abcd")).toBe(false);
    });
  });
});
