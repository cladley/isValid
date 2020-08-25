import { Rule } from "./rules";

const firstName = new Rule("firstName")
  .required({
    message: "This is required dude",
  })
  .length({
    message: "This is not the correct length",
    constraint: ">=4",
  })
  .notEqual({
    message: "This should not be equal",
  });

console.log(firstName.validate("colin", { other: "colin" }));

// {isValid: false,
//   errors: [
//     {required: message},
//     {Equal: message}
//   ]
// }
