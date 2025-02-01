import { PasswordRules } from "./types";

export const defaultRules: PasswordRules = {
  minLength: 8,
  requireLowercase: true,
  requireUppercase: true,
  requireDigit: true,
  requireSpecialChar: true,
  blacklist: ["123456", "password", "admin123", "qwerty", "abc123"],
};
