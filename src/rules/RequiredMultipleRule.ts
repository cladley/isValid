import { IValidate, IRuleParams } from "./index";
import { extractValueAndOperator } from "../utils";

export interface IRequiredMultipleParams extends IRuleParams {
  constraint: string;
}

export class RequiredMultipleRule implements IValidate {
  message: string;
  constraint: string;
  valueOperator: { operator: string; value: number };

  constructor(args: IRequiredMultipleParams) {
    this.message = args.message;
    this.constraint = args.constraint;
    this.valueOperator = extractValueAndOperator(this.constraint);
  }

  validate(value: string[] | number[] | boolean[], {}): boolean {
    const values = value.filter((val: string | number | boolean) => {
      if (typeof val === "string") {
        return Boolean(val.trim());
      } else if (typeof val === "number") {
        return val !== undefined;
      } else {
        return val;
      }
    });
    return eval(`${values.length} ${this.valueOperator.operator} ${this.valueOperator.value}`);
  }
}
