export const extractValueAndOperator = (valueOp: string): { operator: string; value: number } => {
  if (valueOp.trim() === "")
    throw new Error("Please supply a valid number to required-multiple rule");

  const regex = /^(?<operator>(<=)|(>=)|(<)|(>))?(?<value>\d+)$/gm;
  const match = regex.exec(valueOp);

  if (!match?.groups) throw new Error("Please supply a valid number to required-multiple rule");

  if (isNaN(Number.parseInt(match.groups.value))) {
    throw new Error("Please supply a valid number to required-multiple rule");
  }

  let operator = match.groups.operator;
  let value = Number.parseInt(match.groups.value);

  if (!operator) {
    operator = "===";
  }

  return { operator, value };
};
