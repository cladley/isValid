export class HTMLValidationRetriever {
  parent: HTMLElement | null;

  constructor(parent: HTMLElement | null) {
    this.parent = parent;

    if (!this.parent) throw new Error("Please pass a HTMLElement");

    this.getElementsWithRules(this.parent);
  }

  getElementsWithRules(parent: HTMLElement): HTMLElement[] {
    return Array.from(parent.querySelectorAll<HTMLElement>("*")).filter((element) => {
      const matches = Array.from(element.attributes).filter((attr) => {
        return /^data-validate-/.test(attr.name);
      });

      return matches.length > 0;
    });
  }
}
