import { EqualRule } from "../EqualRule";

describe("EqualRule class", () => {
  const equal = new EqualRule({ message: "test" });
  it("should pass validation if two values are  equal", () => {
    expect(equal.validate("abc", { equal: { to: "abc" } })).toBe(true);
  });

  it("should not pass validation if values are not equal", () => {
    expect(equal.validate("abc", { equal: { to: "jfks" } })).toBe(false);
  });
});
