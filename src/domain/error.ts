type GenericError<Brand> = { _tag: Brand };

export type TechErr = GenericError<"TechErr">;
export const errTech: TechErr = { _tag: "TechErr" };

export type BusinessErr<Code extends string> = GenericError<"BusinessErr"> & {
  code: Code;
};
const errBusiness = <Code extends string>(code: Code): BusinessErr<Code> => ({
  _tag: "BusinessErr",
  code,
});

export const errors = {
  BAD_REQUEST: errBusiness("BAD_REQUEST"),
  UNAUTHORIZED: errBusiness("UNAUTHORIZED"),
  FORBIDDEN: errBusiness("FORBIDDEN"),
  NOT_FOUND: errBusiness("NOT_FOUND"),
  CONFLICT: errBusiness("CONFLICT"),
} as const;
