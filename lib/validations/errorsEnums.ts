export const ErrorsToTranslate = {
  AUTH: {
    EMAIL_IS_INVALID: "email is invalid",
    EMAIL_ALREADY_EXISTS: "email already exists",
    EMAIL_NOT_CONFIRMED: "email not confirmed",

    EMAIL_RATE_LIMIT_EXCEEDED: "email rate limit exceeded",
    EMAIL_SIGNUPS_ARE_DISABLED: "email signups are disabled",
    EMAIL_LINK_IS_INVALID_OR_HAS_EXPIRED:
      "email link is invalid or has expired",

    PASSWORD_IS_REQUIRED: "password is required",
    PASSWORD_IS_INVALID: "password is invalid",
    PASSWORDS_ARE_NOT_THE_SAME: "passwords are not the same",

    INVALID_LOGIN_CREDENTIALS: "invalid login credentials",

    CAPTCHA_WAS_NOT_SOLVED: "captcha was not solved",
    CAPTCHA_VERIFICATION_PROCESS_FAILED: "captcha verification process failed",

    TOKEN_HAS_EXPIRED_OR_IS_INVALID: "token has expired or is invalid",
  },
  EDIT_PROFILE: {
    USERNAME_IS_INVALID: "username is invalid",
    USERNAME_ALREADY_EXISTS: "username already exists",
    USERNAME_IS_TOO_SHORT: "username is too short",
    USERNAME_IS_TOO_LONG: "username is too long",
    USERNAME_IS_THE_SAME: "username is the same",
    DESCRIPTION_IS_TOO_LONG: "description is too long",
  },
  FOLLOW: {
    CANNOT_FOLLOW_OWN_PROFILE: "cannot follow your own profile",
  },
  REVIEW: {
    REVIEW_IS_TOO_LONG: "review is too long",
    RATE_IS_INVALID: "rate is invalid",
  },
  SEARCH: {
    SEARCH_IS_TOO_SHORT: "search is too short",
  },
  DATA_TYPES: {
    DATA_IS_INVALID: "data is invalid",
    DATE_IS_INVALID: "date is invalid",
    FORMAT_IS_INVALID: "format is invalid",
  },

  UNAUTHORIZED: "unauthorized",
  FAILED_TO_LOAD_ITEMS: "failed to load items",
  NOT_FOUND: "not found",
  SOMETHING_WENT_WRONG: "something went wrong",

  PENDING: "pending",
  SUCCESS: "success",
};
