import { Rule } from "./rules";

const firstName = new Rule("firstName")
  .required({
    message: "This is required dude",
  })
  .length({
    message: "This is not the correct length",
    constraint: ">=4",
  })
  .equal({
    message: "This should not be equal",
  });

const hobbies = new Rule("hobbies").requiredMultiple({
  message: "You need to select at least 3 items",
  constraint: ">=3",
});

// console.log(firstName.validate("colin", { other: "colin" }));
//
console.log(hobbies.validate(["a", "f", "sd"]));

// {isValid: false,
//   errors: [
//     {required: message},
//     {Equal: message}
//   ]
// }
