type GenericError<Brand> = { _tag: Brand };

export type TechErr = GenericError<'TechErr'>;
export const errTech: TechErr = { _tag: 'TechErr' };

export type BusinessErr<Code extends string> = GenericError<'BusinessErr'> & {
  code: Code;
  message: string;
};
const errBusiness =
  <Code extends string>(code: Code) =>
  (message: string): BusinessErr<Code> => ({
    _tag: 'BusinessErr',
    code,
    message,
  });

export const errors = {
  BAD_REQUEST: errBusiness('BAD_REQUEST'),
  NOT_FOUND: errBusiness('NOT_FOUND'),
  CONFLICT: errBusiness('CONFLICT'),
} as const;
