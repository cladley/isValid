import { RequiredRule } from "./RequiredRule";
import { AsyncRule } from "./AsyncRule";

export interface Rule {
  name: string;
  priority: number;
  element: HTMLElement | HTMLInputElement;
  params: Record<string, string>;
  getValue(): any;
  validate(): boolean | Promise<boolean>;
}

export type RuleType = new (...args: any[]) => Rule;

export const rules = new Map<string, RuleType>();

export function addRule(ruleName: string, rule: RuleType) {
  rules.set(ruleName, rule);
}

addRule("required", RequiredRule);
addRule("async", AsyncRule);
