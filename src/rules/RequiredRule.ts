import { IValidate, IRuleParams } from "./index";

export class RequiredRule implements IValidate {
  message: string;

  constructor(args: IRuleParams) {
    this.message = args.message;
  }

  validate(value?: string | boolean): boolean {
    if (typeof value === "string") {
      return value.trim() !== "";
    } else {
      return Boolean(value);
    }
  }
}
