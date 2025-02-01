import { verifyPassword } from '../index';
import { PasswordRules } from '../types';

describe('verifyPassword', () => {
  const defaultRules: PasswordRules = {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireDigit: true,
    requireSpecialChar: true,
    blacklist: ['password123', 'admin123', '12345678'],
  };

  // 1. Test valid password
  test('should accept a valid password', () => {
    const result = verifyPassword('StrongP@ss123', defaultRules);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({
      tooShort: false,
      commonPassword: false,
      missingLowercase: false,
      missingUppercase: false,
      missingDigit: false,
      missingSpecialChar: false,
    });
  });

  // 2. Test minimum length
  test('should reject password shorter than minimum length', () => {
    const result = verifyPassword('Sh0rt!', defaultRules);
    expect(result.valid).toBe(false);
    expect(result.errors.tooShort).toBe(true);
  });

  // 3. Test blacklisted password
  test('should reject blacklisted password', () => {
    const result = verifyPassword('password123', defaultRules);
    expect(result.valid).toBe(false);
    expect(result.errors.commonPassword).toBe(true);
  });

  // 4. Test missing lowercase
  test('should reject password without lowercase letters', () => {
    const result = verifyPassword('UPPER123!', defaultRules);
    expect(result.valid).toBe(false);
    expect(result.errors.missingLowercase).toBe(true);
  });

  // 5. Test missing uppercase
  test('should reject password without uppercase letters', () => {
    const result = verifyPassword('lower123!', defaultRules);
    expect(result.valid).toBe(false);
    expect(result.errors.missingUppercase).toBe(true);
  });

  // 6. Test missing digit
  test('should reject password without digits', () => {
    const result = verifyPassword('NoDigits!', defaultRules);
    expect(result.valid).toBe(false);
    expect(result.errors.missingDigit).toBe(true);
  });

  // 7. Test missing special character
  test('should reject password without special characters', () => {
    const result = verifyPassword('NoSpecial123', defaultRules);
    expect(result.valid).toBe(false);
    expect(result.errors.missingSpecialChar).toBe(true);
  });

  // 8. Test multiple missing requirements
  test('should report multiple missing requirements', () => {
    const result = verifyPassword('onlylower', defaultRules);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      tooShort: false,
      commonPassword: false,
      missingUppercase: true,
      missingDigit: true,
      missingSpecialChar: true,
      missingLowercase: false,
    });
  });

  // 9. Test custom validator
  test('should handle custom validator', () => {
    const rulesWithCustom: PasswordRules = {
      ...defaultRules,
      customValidator: (pwd) => pwd.includes('test') ? 'Password cannot contain "test"' : null,
    };
    const result = verifyPassword('TestP@ss123', rulesWithCustom);
    expect(result.valid).toBe(true);
    const resultWithTest = verifyPassword('test123P@ss', rulesWithCustom);
    expect(resultWithTest.valid).toBe(false);
    expect(resultWithTest.errors.customError).toBe('Password cannot contain "test"');
  });

  // 10. Test with all rules disabled
  test('should accept any password when all rules are disabled', () => {
    const noRules: PasswordRules = {
      minLength: 0,
      requireLowercase: false,
      requireUppercase: false,
      requireDigit: false,
      requireSpecialChar: false,
      blacklist: [],
    };
    const result = verifyPassword('a', noRules);
    expect(result.valid).toBe(true);
  });

  // 11. Test empty password
  test('should reject empty password with default rules', () => {
    const result = verifyPassword('', defaultRules);
    expect(result.valid).toBe(false);
    expect(result.errors.tooShort).toBe(true);
  });

  // 12. Test password with spaces
  test('should handle passwords with spaces correctly', () => {
    const result = verifyPassword('Strong Pass 123!', defaultRules);
    expect(result.valid).toBe(true);
  });

  // 13. Test password with all special characters
  test('should accept password with multiple special characters', () => {
    const result = verifyPassword('Test123!@#$%^&*()', defaultRules);
    expect(result.valid).toBe(true);
  });

  // 14. Test extremely long password
  test('should handle extremely long passwords', () => {
    const longPassword = 'L0ngP@ssw'.repeat(100);
    const result = verifyPassword(longPassword, defaultRules);
    expect(result.valid).toBe(true);
  });

  // 15. Test with large blacklist
  test('should handle large blacklist efficiently', () => {
    const largeBlacklist = Array.from({ length: 1000 }, (_, i) => `password${i}`);
    const rulesWithLargeBlacklist: PasswordRules = {
      ...defaultRules,
      blacklist: largeBlacklist,
    };
    const result = verifyPassword('StrongP@ss123', rulesWithLargeBlacklist);
    expect(result.valid).toBe(true);
  });

  // 16. Test with Unicode characters
  test('should handle Unicode characters', () => {
    const result = verifyPassword('Пароль123!', defaultRules);
    expect(result.valid).toBe(true);
  });

  // 17. Test password with only special characters
  test('should reject password with only special characters', () => {
    const result = verifyPassword('!@#$%^&*()', defaultRules);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual({
      tooShort: false,
      commonPassword: false,
      missingLowercase: true,
      missingUppercase: true,
      missingDigit: true,
      missingSpecialChar: false,
    });
  });

  // 18. Test password with repeating characters
  test('should accept password with repeating characters if they meet requirements', () => {
    const result = verifyPassword('AAAaaa111!!!', defaultRules);
    expect(result.valid).toBe(true);
  });

  // 19. Test with custom minimum length
  test('should respect custom minimum length', () => {
    const customLengthRules: PasswordRules = {
      ...defaultRules,
      minLength: 20,
    };
    const result = verifyPassword('StrongP@ss123', customLengthRules);
    expect(result.valid).toBe(false);
    expect(result.errors.tooShort).toBe(true);
  });

  // 20. Test with mixed requirements
  test('should handle mixed requirement enabling/disabling', () => {
    const mixedRules: PasswordRules = {
      minLength: 8,
      requireLowercase: true,
      requireUppercase: false,
      requireDigit: true,
      requireSpecialChar: false,
      blacklist: ['test123'],
    };
    const result = verifyPassword('testing123', mixedRules);
    expect(result.valid).toBe(true);
  });
});
