import { IValidate, IRuleParams, RuleSpecficParam } from "./index";

interface EqualRuleParam extends RuleSpecficParam {
  equal: {
    to: string;
  };
}

export class EqualRule implements IValidate<EqualRuleParam> {
  static ruleName = "equal";
  message: string;

  constructor(args: IRuleParams) {
    this.message = args.message;
  }

  validate(value: string, ruleSpecificParams: EqualRuleParam): boolean {
    return value === ruleSpecificParams.equal.to;
  }
}
