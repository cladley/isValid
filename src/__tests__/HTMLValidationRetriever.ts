import { readFileSync } from "fs";
import { resolve } from "path";
import { HTMLValidationRetriever } from "../HTMLValidationRetriever";

const html = readFileSync(resolve(__dirname, "./testPage.html"), "utf8");

describe("HTMLValidationRetriever class", () => {
  let htmlRetriever;

  beforeEach(() => {
    document.documentElement.innerHTML = html.toString();
    htmlRetriever = new HTMLValidationRetriever(document.querySelector<HTMLElement>("#form"));
  });

  it("should just work", () => {
    expect(true).toBe(true);
  });
});
