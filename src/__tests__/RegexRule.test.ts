import { RegexRule } from '../rules/RegexRule';

describe('\'regex\' rule', () => {
  let input: HTMLInputElement;
  let regexRule: RegexRule;

  describe('testing a simple regex of 4 characters between a-z', () => {
    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      regexRule = new RegexRule(input, { ruleValue: '^[a-z]{4}$' });
    });

    it('Should fail validation with incorrect number of characters', () => {
      input.value = 'abc';
      expect(regexRule.validate()).toEqual(false);
    });

    it('Should fail with an incorrect character', () => {
      input.value = 'ab3d';
      expect(regexRule.validate()).toEqual(false);
    });

    it('Should fail validation with characters in the wrong case', () => {
      input.value = 'abCd';
      expect(regexRule.validate()).toEqual(false);
    });

    it('Should pass validation with correct number of characters', () => {
      input.value = 'abcd';
      expect(regexRule.validate()).toEqual(true);
    });
  });

  describe('testing a regex while using a regex flag to ignore case', () => {
    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      regexRule = new RegexRule(input, { ruleValue: '^[a-z]{4}', flags: 'i' });
    });

    it('should fail with the wrong amount of characters', () => {
      input.value = 'abc';
      expect(regexRule.validate()).toEqual(false);
    });

    it('should pass with the correct amount of characters', () => {
      input.value = 'abcd';
      expect(regexRule.validate()).toEqual(true);
    });

    it('should pass with correct characters and different case', () => {
      input.value = 'AbCd';
      expect(regexRule.validate()).toEqual(true);
    });
  });
});
