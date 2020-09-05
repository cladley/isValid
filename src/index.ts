import { Validate } from "./Validate";

const form = document.querySelector<HTMLElement>("#form");
const btnManual = document.querySelector<HTMLElement>(".btn-manual") as HTMLElement;
let validate: Validate;

import { Rule } from "./rules";

if (form) {
  validate = new Validate(form, {
    parentSelector: ".form-group",
    errorClass: "error",
    onSubmit(event, isValid, errors) {
      console.log(isValid);
      console.log(errors);
      event.preventDefault();
      console.log("here we are");
    },
  });

  btnManual.addEventListener("click", () => {
    validate.validate();
  });
}
