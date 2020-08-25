import { IValidate, IRuleParams } from "./index";
import { extractValueAndOperator } from "../utils";

export interface ILengthRuleParams extends IRuleParams {
  constraint: string;
}

export class LengthRule implements IValidate {
  message: string;
  constraint: string;
  valueOperator: { operator: string; value: number };

  constructor(args: ILengthRuleParams) {
    this.message = args.message;
    this.constraint = args.constraint;
    this.valueOperator = extractValueAndOperator(this.constraint);
  }

  validate(value: string): boolean {
    return eval(
      `${value.trim().length} ${this.valueOperator.operator} ${this.valueOperator.value}`
    );
  }
}
