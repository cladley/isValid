import { Rule, ValueParam, RuleSpecficParam, IisValid } from "./rules";

export enum ValidateType {
  html,
}

export class Validate {
  private activeRules: Rule[] = [];

  static createFor(vType: ValidateType): Validate {
    return new Validate();
  }

  addRules(rules: Rule[]): void {
    this.activeRules = [...this.activeRules, ...rules];
  }

  addRule(rule: Rule): void {
    this.activeRules.push(rule);
  }

  validate(values: any): Map<string, IisValid> {
    const resultsMap = new Map();

    this.activeRules.forEach((rule) => {
      const ruleValues = values[rule.name];
      const result = rule.validate(ruleValues.value, ruleValues);
      resultsMap.set(rule.name, result);
    });

    return resultsMap;
  }
}
