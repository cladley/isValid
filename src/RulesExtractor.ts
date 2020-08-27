import { toCamelCase } from "./utils";

export class RulesExtractor {
  prefix: string;

  constructor(prefix: string = "data-validate") {
    this.prefix = prefix;
  }

  filterElements(element: HTMLElement) {
    const re = new RegExp(`^${this.prefix}`);

    const allElements = Array.from(element.querySelectorAll<HTMLElement>("*"));
    return allElements.filter((el: HTMLElement) => {
      const matches = Array.from(el.attributes).filter((attr) => {
        return re.test(attr.name);
      });

      if (matches.length > 0) return true;
      return false;
    });
  }

  getElementsWithValidationRules(parent: HTMLElement) {
    const elements = this.filterElements(parent);
    return this.getRules(elements);
  }

  getRuleParameters(element: HTMLElement, ruleName: string): any {
    const params = Object.create(null);
    const ruleParamsRe = new RegExp(`^${this.prefix}-${ruleName}__([a-z]+)$`, "i");

    Array.from(element.attributes).forEach((attr: Attr) => {
      const match = ruleParamsRe.exec(attr.name);

      if (match) {
        params[toCamelCase(match[1])] = attr.value;
      }
    });

    return params;
  }

  getRules(elements: HTMLElement[]): any {
    const ruleNameRe = new RegExp(`^${this.prefix}-([a-z]+)$`, "i");
    const elementRuleMap = new Map<HTMLElement, any[]>();

    elements.forEach((el: HTMLElement) => {
      Array.from(el.attributes).forEach((attr: Attr) => {
        const match = ruleNameRe.exec(attr.name);

        if (match) {
          const ruleNameString = match[1];
          const ruleName = toCamelCase(ruleNameString);
          const params = this.getRuleParameters(el, ruleNameString);

          const currentRules = elementRuleMap.has(el)
            ? [...(elementRuleMap.get(el) as []), { name: ruleName, params: { ...params } }]
            : [{ name: ruleName, params: { ...params } }];
          elementRuleMap.set(el, currentRules);
        }
      });
    });

    return elementRuleMap;
  }
}