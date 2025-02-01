# Password Checker

A TypeScript package for password checking functionality.

## Installation

```bash
npm install password-checker
```

## Usage

```typescript
const password = "SecurePass123!";
const rules: PasswordRules = {
  minLength: 10,
  requireLowercase: true,
  requireUppercase: true,
  requireDigit: true,
  requireSpecialChar: true,
  blacklist: ["123456", "password", "admin123", "qwerty", "abc123"],
};

const result = verifyPassword(password, rules);
console.log(result);
// Output:
// {
//   valid: true,
//   errors: {
//     tooShort: false,
//     commonPassword: false,
//     missingLowercase: false,
//     missingUppercase: false,
//     missingDigit: false,
//     missingSpecialChar: false
//   }
// }
// The `errors` object will have boolean values indicating which rules failed:
// - `tooShort`: Password is shorter than the minimum length
// - `commonPassword`: Password is in the blacklist
// - `missingLowercase`: Missing a lowercase letter
// - `missingUppercase`: Missing an uppercase letter
// - `missingDigit`: Missing a number
// - `missingSpecialChar`: Missing a special character
// - `customError`: Optional string from custom validator
```

## Development

1. Install dependencies:
```bash
npm install
```

2. Build the package:
```bash
npm run build
```

3. Run tests:
```bash
npm test
```

## License

MIT