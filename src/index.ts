import { Validate } from "./Validate";
import { Rule } from "./rules";

const form = document.querySelector<HTMLFormElement>("#form");
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
  Validate.registerValidatorRuleFunction("username", 99, async function (
    value: any,
    setMessage,
    restoreMessage
  ) {
    await wait(2000);
    if (typeof value === "string") {
      if (value === "colin") {
        setMessage("Come on man, colin has already been used");
        return false;
      } else if (value === "ladley") {
        setMessage("Ladley been used aswell");
        return false;
      } else {
        return true;
      }
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
    validate.validate(true);
  });
}
