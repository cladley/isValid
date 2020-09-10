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

type RuleName = "required";

export function toCamelCase(str: string): RuleName {
  return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase()) as RuleName;
}

export function createDebouncedPromiseFunction() {
  let counter = 0;

  return async function <T>(promiseFunction: () => Promise<T>) {
    counter++;
    const myCounter = counter;

    try {
      const result = await promiseFunction();

      if (myCounter === counter) {
        return result;
      }
    } catch (error) {
      console.log(error);
    }
  };
}

export function debounce<F extends (...params: any[]) => void>(fn: F, delay: number) {
  let timeoutId: number | null = null;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId as number);
    timeoutId = window.setTimeout(() => fn.apply(this, args), delay);
  } as F;
}

export function isInputElement(
  element: HTMLElement | HTMLInputElement
): element is HTMLInputElement {
  if ((element as HTMLInputElement).value) {
    return true;
  }

  return false;
}
