export const PASSWORD = {
    MIN_LENGTH: 1,
    MAX_LENGTH: 99,
    REQUIREMENTS: {
        UPPERCASE: true,
    },
}

export const USERNAME = {
    MIN_LENGTH: 1,
    MAX_LENGTH: 64,
    ALLOWED_CHARS: /^[a-zA-Z0-9_]+$/, // regex for valid characters
}

// export const EMAIL = {
//   MIN_LENGTH: 3,
//   MAX_LENGTH: 254,
//   ALLOWED_CHARS: /^[a-zA-Z0-9_]+$/ // regex for valid characters
// }

export const ERROR_MESSAGES = {
    PASSWORD: `Password must be ${PASSWORD.MIN_LENGTH}-${PASSWORD.MAX_LENGTH} characters`,
    USERNAME: `Username must be ${USERNAME.MIN_LENGTH}-${USERNAME.MAX_LENGTH} characters`,
    // EMAIL: `Email must be ${EMAIL.MIN_LENGTH}-${EMAIL.MAX_LENGTH} characters`
}

export const SECRET = 'mysecret'
export const SESSION_COOKIE_NAME = 'session'
