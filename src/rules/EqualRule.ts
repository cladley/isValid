import { IValidate, IRuleParams } from "./index";

export class EqualRule implements IValidate {
  message: string;

  constructor(args: IRuleParams) {
    this.message = args.message;
  }

  validate(value: string, ruleExtras: { [key: string]: any }): boolean {
    return value === ruleExtras.other;
  }
}
