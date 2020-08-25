import { RequiredRule } from "../RequiredRule";

describe("RequiredRule class", () => {
  describe("validating a string", () => {
    const required = new RequiredRule({ message: "this is required" });

    it("should return true with a string that is not empty", () => {
      expect(required.validate("test")).toBe(true);
    });

    it("should return false with a string that is empty", () => {
      expect(required.validate("")).toBe(false);
    });

    it("should return false with a string that only contains whitespace", () => {
      expect(required.validate("    ")).toBe(false);
    });
  });

  describe("validating a boolean", () => {
    const required = new RequiredRule({ message: "this is required" });
    it("should return true when true is passed in", () => {
      expect(required.validate(true)).toBe(true);
    });

    it("should return false when false is passed in", () => {
      expect(required.validate(false)).toBe(false);
    });

    it("should return false with undefined", () => {
      expect(required.validate()).toBe(false);
    });
  });
});
