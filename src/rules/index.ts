import { RequiredRule } from "./RequiredRule";
import { LengthRule, ILengthRuleParams } from "./LengthRule";
import { EqualRule } from "./EqualRule";

export interface IValidate {
  message: string;
  validate(value: string | boolean, ruleExtras?: { [key: string]: any }): boolean | undefined;
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

  notEqual(args: IRuleParams): this {
    this.activeRules.push({ name: "notEqual", rule: new EqualRule(args) });
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

  validate(value: any, ruleExtras: { [key: string]: any }): IisValid {
    const errors: { [key: string]: any }[] = [];

    this.activeRules.forEach((aRule) => {
      const isValid = aRule.rule.validate(value, ruleExtras);

      if (!isValid) {
        errors.push({
          [aRule.name]: aRule.rule.message,
        });
      }
    });

    return { isValid: errors.length === 0, errors };
  }
}
