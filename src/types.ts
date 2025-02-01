export type PasswordRules = {
  minLength?: number;
  requireLowercase?: boolean;
  requireUppercase?: boolean;
  requireDigit?: boolean;
  requireSpecialChar?: boolean;
  blacklist?: string[];
  customValidator?: (password: string) => string | null;
};
export type PasswordErrors = {
  tooShort: boolean;
  commonPassword: boolean;
  missingLowercase: boolean;
  missingUppercase: boolean;
  missingDigit: boolean;
  missingSpecialChar: boolean;
  customError?: string;
};
