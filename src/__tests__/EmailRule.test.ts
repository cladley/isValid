import { EmailRule } from '../rules/EmailRule';

describe('\'email\' rule', () => {
  let input: HTMLInputElement;
  let emailRule: EmailRule;

  describe('testing a valid email address', () => {
    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      emailRule = new EmailRule(input, { message: 'This is an invalid email' });
    });

    it('Should pass with an email of \'example@test.com\'', () => {
      input.value = 'example@test.com';
      expect(emailRule.validate()).toEqual(true);
    });

    it('Should pass with an email of \'example@test.co.uk\'', () => {
      input.value = 'example@test.co.uk';
      expect(emailRule.validate()).toEqual(true);
    });

    it('Should pass with an email of \'example@test.ie\'', () => {
      input.value = 'example@test.ie';
      expect(emailRule.validate()).toEqual(true);
    });

    it('Should pass with an email if \'exmaple@test.net\'', () => {
      input.value = 'example@test.net';
      expect(emailRule.validate()).toEqual(true);
    });
  });

  describe('testing an invalid email address', () => {
    beforeEach(() => {
      input = document.createElement('input');
      input.type = 'text';
      emailRule = new EmailRule(input, { message: 'This is an invalid email' });
    });

    it('Should fail with an email of example', () => {
      input.value = 'example';
      expect(emailRule.validate()).toEqual(false);
    });

    it('Should fail with an email of \'example@c\'', () => {
      input.value = 'example@c';
      expect(emailRule.validate()).toEqual(false);
    });

    it('Should fail with no email', () => {
      input.value = '';
      expect(emailRule.validate()).toEqual(false);
    });

    it('Should fail with an email of \'ex ample@gmail.com\'', () => {
      input.value = 'ex ample@gmail.com';
      expect(emailRule.validate()).toEqual(false);
    });
  });
});
