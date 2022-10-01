import { ValidationError } from "io-ts";

// I have to say, exepecting exact error messages without imposing the use of a framework, or any form of specification for the error message is not good.
// Dirty implementation of a Reporter until proper specs
export const getMessage = (e: ValidationError[]): string => {
  console.dir(e[0].context, { depth: null });
  const faultyKey = e[0].context[1].key;
  const expectedType = e[0].context[1].type.name;
  const actualValue = e[0].context[1].actual;

  const isUndefined = actualValue === undefined;
  return isUndefined
    ? `ValidationError: missing property ${faultyKey}`
    : `ValidationError: ${faultyKey} should be ${someWeirdTypeMapping(
        expectedType
      )}, got '${actualValue}' instead`;
};

const someWeirdTypeMapping = (t: string) => (t === "Int" ? "numerical" : t);
