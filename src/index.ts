import { Validate } from "./Validate";

const form = document.querySelector<HTMLElement>("#form");

if (form) {
  const validate = new Validate(form, {
    parentSelector: ".form-group",
    errorClass: "error",
    onSubmit(event, isValid, errors) {
      console.log(isValid);
      console.log(errors);
      event.preventDefault();
      console.log("here we are");
    },
  });
}
