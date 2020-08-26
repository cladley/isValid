import { Rule } from "./rules";

export class Validate {
  private activeRules: Rule[] = [];

  addRules(rules: Rule[]): void {
    this.activeRules = [...this.activeRules, ...rules];
  }

  addRule(rule: Rule): void {
    this.activeRules.push(rule);
  }

  validate(): void {}
}
