export const PASSWORD = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 99,
  REQUIREMENTS: {
    UPPERCASE: true
  }
}

export const USERNAME = {
  MIN_LENGTH: 1,
  MAX_LENGTH: 64,
  ALLOWED_CHARS: /^[a-zA-Z0-9_]+$/ // regex for valid characters
}

export const ERROR_MESSAGES = {
  PASSWORD: `Password must be ${PASSWORD.MIN_LENGTH}-${PASSWORD.MAX_LENGTH} characters`,
  USERNAME: `Username must be ${USERNAME.MIN_LENGTH}-${USERNAME.MAX_LENGTH} characters`
}
