import { RequiredRule } from "./RequiredRule";
import { RequiredMultipleRule } from "./RequiredMultipleRule";
import { LengthRule } from "./LengthRule";
import { RegexRule } from "./RegexRule";
import { AsyncRule } from "./AsyncRule";
import { MatchRule } from "./MatchRule";

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
addRule("requiredMultiple", RequiredMultipleRule);
addRule("async", AsyncRule);
addRule("length", LengthRule);
addRule("regex", RegexRule);
addRule("match", MatchRule);
