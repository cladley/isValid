import { Validate } from "./Validate";

const form = document.querySelector<HTMLElement>("#form");
const btnManual = document.querySelector<HTMLElement>(".btn-manual") as HTMLElement;
let validate: Validate;

function wait(timeout: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, timeout);
  });
}

if (form) {
  Validate.registerValidatorRuleFunction("username", 99, async function (value: any) {
    await wait(2000);
    if (typeof value === "string") {
      if (value !== "colin") {
        return true;
      }
      return false;
    }
  });

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
