import { defaultRules } from "./constants";
import { binarySearch } from "./helpers";
import { PasswordErrors, PasswordRules } from "./types";

export function verifyPassword(
  password: string,
  rules: PasswordRules = defaultRules
): { valid: boolean; errors: PasswordErrors } {
  const errors: PasswordErrors = {
    tooShort: false,
    commonPassword: false,
    missingLowercase: false,
    missingUppercase: false,
    missingDigit: false,
    missingSpecialChar: false,
  };

  const specialChars = '!@#$%^&*(),.?":{}|<>';
  let flags = 0;

  const REQUIRE_LOWER = 1 << 0;
  const REQUIRE_UPPER = 1 << 1;
  const REQUIRE_DIGIT = 1 << 2;
  const REQUIRE_SPECIAL = 1 << 3;
  let requiredFlags = 0;

  if (rules.requireLowercase) requiredFlags |= REQUIRE_LOWER;
  if (rules.requireUppercase) requiredFlags |= REQUIRE_UPPER;
  if (rules.requireDigit) requiredFlags |= REQUIRE_DIGIT;
  if (rules.requireSpecialChar) requiredFlags |= REQUIRE_SPECIAL;

  // 1. Check minimum length
  if (rules.minLength && password.length < rules.minLength) {
    errors.tooShort = true;
  }

  // 2. Check blacklist
  if (rules.blacklist && rules.blacklist.length > 0) {
    if (rules.blacklist.length < 500) {
      if (rules.blacklist.includes(password)) {
        errors.commonPassword = true;
      }
    } else {
      const sortedBlacklist = [...rules.blacklist].sort();
      if (binarySearch(sortedBlacklist, password)) {
        errors.commonPassword = true;
      }
    }
  }

  // 3. Single pass through password
  for (let i = 0; i < password.length; i++) {
    const char = password[i];
    if (char >= "a" && char <= "z") flags |= REQUIRE_LOWER;
    else if (char >= "A" && char <= "Z") flags |= REQUIRE_UPPER;
    else if (char >= "0" && char <= "9") flags |= REQUIRE_DIGIT;
    else if (specialChars.includes(char)) flags |= REQUIRE_SPECIAL;

    if ((flags & requiredFlags) === requiredFlags) break;
  }

  // 4. Check which rules failed
  if (requiredFlags & REQUIRE_LOWER && !(flags & REQUIRE_LOWER)) {
    errors.missingLowercase = true;
  }
  if (requiredFlags & REQUIRE_UPPER && !(flags & REQUIRE_UPPER)) {
    errors.missingUppercase = true;
  }
  if (requiredFlags & REQUIRE_DIGIT && !(flags & REQUIRE_DIGIT)) {
    errors.missingDigit = true;
  }
  if (requiredFlags & REQUIRE_SPECIAL && !(flags & REQUIRE_SPECIAL)) {
    errors.missingSpecialChar = true;
  }

  // 5. Custom validation
  if (rules.customValidator) {
    const customError = rules.customValidator(password);
    if (customError) {
      errors.customError = customError;
    }
  }

  const valid = !Object.values(errors).some((value) =>
    typeof value === "boolean" ? value : value !== undefined
  );

  return { valid, errors };
}
