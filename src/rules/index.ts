import { RequiredRule } from "./RequiredRule";
import { LengthRule, ILengthRuleParams } from "./LengthRule";
import { EqualRule } from "./EqualRule";
import { RequiredMultipleRule, IRequiredMultipleParams } from "./RequiredMultipleRule";

export type ValueParam = string | boolean | string[] | number[] | boolean[] | undefined;

export interface RuleSpecficParam {
  [key: string]: any;
}

export interface IValidate<T = RuleSpecficParam> {
  message: string;
  validate(value: ValueParam, ruleSpecificParams?: T): boolean | undefined;
}

export interface IisValid {
  isValid: boolean;
  errors: { [key: string]: string }[];
}

export interface IRuleParams {
  message: string;
  [key: string]: any;
}

class ValidationRules {
  protected activeRules: { name: string; rule: IValidate }[] = [];

  required(args: IRuleParams): this {
    this.activeRules.push({ name: "required", rule: new RequiredRule(args) });
    return this;
  }

  requiredMultiple(args: IRequiredMultipleParams): this {
    this.activeRules.push({ name: "requiredMultiple", rule: new RequiredMultipleRule(args) });
    return this;
  }

  equal(args: IRuleParams): this {
    this.activeRules.push({ name: "equal", rule: new EqualRule(args) });
    return this;
  }

  length(args: ILengthRuleParams): this {
    this.activeRules.push({ name: "length", rule: new LengthRule(args) });
    return this;
  }
}

export class Rule extends ValidationRules {
  constructor(public name: string) {
    super();
  }

  validate(value: any, ruleSpecificParams?: { [key: string]: any }): IisValid {
    const errors: { [key: string]: any }[] = [];

    this.activeRules.forEach((aRule) => {
      const isValid = aRule.rule.validate(value, ruleSpecificParams);

      if (!isValid) {
        errors.push({
          [aRule.name]: aRule.rule.message,
        });
      }
    });

    return { isValid: errors.length === 0, errors };
  }
}
