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
    console.log("We get this far");
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
    errorClass: "is-error",
    onSubmit(event, isValid, errors) {
      if (isValid) {
        console.log("We can submit the form");
        // event.target.submit();
      } else {
        console.log("The form cannot be submitted");
      }
    },
  });

  btnManual.addEventListener("click", () => {
    validate.validate();
  });
}
