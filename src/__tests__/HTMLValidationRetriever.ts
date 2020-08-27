import { readFileSync } from "fs";
import { resolve } from "path";
import { HTMLValidationRetriever } from "../HTMLValidationRetriever";

const html = readFileSync(resolve(__dirname, "./testPage.html"), "utf8");

describe("HTMLValidationRetriever class", () => {
  let htmlRetriever: HTMLValidationRetriever;
  let formElement: HTMLElement;

  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    formElement = document.querySelector<HTMLElement>("#form") as HTMLElement;
    htmlRetriever = new HTMLValidationRetriever(formElement);
  });

  test("getElementsWithRules() should return element in dom that have rule attributes added to them", () => {
    const elementsWithRule = htmlRetriever.getElementsWithRules(formElement);
    expect(elementsWithRule.length).toEqual(2);
  });
});
