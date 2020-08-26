import { Rule } from "./rules";
import { Validate } from "./Validate";

const firstName = new Rule("firstName")
  .required({
    message: "This is required dude",
  })
  .length({
    message: "This is not the correct length",
    constraint: ">=4",
  })
  .equal({
    message: "Your passwords should match",
  });

const hobbies = new Rule("hobbies").requiredMultiple({
  message: "You need to select at least 3 items",
  constraint: ">=3",
});

console.log(
  firstName.validate("colin", {
    equal: { to: "sfsdf" },
  })
);

// console.log(hobbies.validate(["a", "f", "sd"]));

const myForm = new Validate();

myForm.addRules([firstName, hobbies]);

// myForm.validate({
//   firstName: { value: "Colin", equal: { to: "colin" } },
// });
