import { RulesExtractor } from '../RulesExtractor';

const htmlTemplateString = `
  <div class="parent">
    <input
      class="firstInput"
      type="text"
      data-validate-required=""
      data-validate-required__message="Please enter a password"
      data-validate-match=".password"
      data-validate-match__message="Confirm password doesnt match password"
      data-validate-match__other="test"
    />

    <input
      class="secondInput"
      type="text"
      data-validate-length=">=4"
      data-validate-length__message="This needs to have at least 4 characters"
    />

    <input class="thirdInput" type="text">
  </div>
  `;

describe('RulesExtractor class', () => {
  let rulesExtractor: RulesExtractor;
  let parentElement: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = htmlTemplateString;
    parentElement = document.querySelector<HTMLElement>('.parent') as HTMLElement;
    rulesExtractor = new RulesExtractor();
  });

  it('should extract a Map with 2 entries - one for each input that has rules attached', () => {
    expect(rulesExtractor.getElementsWithValidationRules(parentElement).size).toEqual(2);
  });

  it('should create an entry in rules map for each element that has a rule attached', () => {
    const firstInput = document.querySelector('.firstInput') as HTMLElement;
    const secondInput = document.querySelector('.secondInput') as HTMLElement;
    const thirdInput = document.querySelector('.thirdInput') as HTMLElement;
    const rulesMap = rulesExtractor.getElementsWithValidationRules(parentElement);

    let ruleObjArray = rulesMap.get(firstInput);
    expect(ruleObjArray).toBeDefined();
    ruleObjArray = rulesMap.get(secondInput);
    expect(ruleObjArray).toBeDefined();
    ruleObjArray = rulesMap.get(thirdInput);
    expect(ruleObjArray).not.toBeDefined();
  });

  it("should create an object with keys of 'name' and 'param' for each rule", () => {
    const firstInput = document.querySelector('.firstInput') as HTMLElement;
    const rulesMap = rulesExtractor.getElementsWithValidationRules(parentElement);
    const ruleObjArray = rulesMap.get(firstInput);

    expect(ruleObjArray).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'required',
          params: { ruleValue: '', message: 'Please enter a password' },
        }),
        expect.objectContaining({
          name: 'match',
          params: {
            ruleValue: '.password',
            message: 'Confirm password doesnt match password',
            other: 'test',
          },
        }),
      ])
    );
  });
});
