import { readFileSync } from 'fs';
import { resolve } from 'path';
// import { HTMLValidate } from "../HTMLValidate";

const html = readFileSync(resolve(__dirname, './testPage.html'), 'utf8');

test('', () => {
  expect(true).toBe(true);
});

// xdescribe("HTMLValidate class", () => {
//   let htmlRetriever: HTMLValidate;
//   let formElement: HTMLElement;

//   beforeEach(() => {
//     document.documentElement.innerHTML = html.toString();
//     formElement = document.querySelector<HTMLElement>("#form") as HTMLElement;
//     htmlRetriever = new HTMLValidate(formElement);
//   });

//   test("getElementsWithRules() should return element in dom that have rule attributes added to them", () => {
//     const elementsWithRule = htmlRetriever.getElementsWithRules(formElement);
//     expect(elementsWithRule.length).toEqual(2);
//   });
// });
