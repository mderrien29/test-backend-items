import { ValidationError } from 'io-ts';

// I have to say, exepecting exact error messages without imposing the use of a framework, or any form of specification for the error message is not good.
// Dirty implementation of a Reporter until proper specs
export const getMessage = (e: ValidationError[]): string => {
  const contextLength = e[0].context.length;

  const idOfErrorToShow = contextLength === 1 ? 0 : 1;
  const errorToShow = e[0].context[idOfErrorToShow];

  const faultyKey = errorToShow.key;
  const expectedType = errorToShow.type.name;
  const actualValue = errorToShow.actual;

  const isUndefined = actualValue === undefined;
  return isUndefined
    ? `ValidationError: missing property ${faultyKey}`
    : `ValidationError: ${faultyKey} should be ${someWeirdTypeMapping(
        expectedType,
      )}, got '${actualValue}' instead`;
};

const someWeirdTypeMapping = (t: string) => (t === 'Int' ? 'numerical' : t);
