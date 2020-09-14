import { RegexRule } from "./RegexRule";

const emailRegexString = "([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$";

export class EmailRule extends RegexRule {
  name = "email";
  constructor(element: HTMLElement, params: Record<string, string>) {
    super(element, { ...params, ruleValue: emailRegexString, flags: "i" });
  }
}
