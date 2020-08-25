import { RequiredMultipleRule } from "../RequiredMultipleRule";

describe("RequiredMultipleRule class", () => {
  describe("validating a group of strings", () => {
    const rmRule = new RequiredMultipleRule({ message: "Test", constraint: "<=2" });

    it("Should validate with the correct number of string values", () => {
      expect(rmRule.validate(["a", "b", ""])).toBe(true);
      expect(rmRule.validate(["a", "b"])).toBe(true);
    });

    it("should not validate with the incorrect number of strings", () => {
      expect(rmRule.validate(["a", "b", "b"])).toBe(false);
    });
  });
});
