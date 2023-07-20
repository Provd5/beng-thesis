export enum AuthErrors {
  email_exists = "email_exists",
  username_exists = "username_exists",
  not_the_same_passwords = "not_the_same_passwords",
  something_went_wrong = "something_went_wrong",
  unauthorized = "unauthorized",
  success = "success",
}

export enum SupabaseValidatorErrors {
  disabled_signups_error = "Email signups are disabled",
  email_link_error = "Email link is invalid or has expired",
  token_error = "Token has expired or is invalid",
  login_error = "Invalid login credentials",
  email_not_confirmed = "Email not confirmed",
}

export enum LoginValidatorErrors {
  wrong_email = "wrong_email",
  password_required_error = "password_required_error",
}

export enum SignupValidatorErrors {
  wrong_email = "wrong_email",
  wrong_password = "wrong_password",
}

export enum UsernameValidatorErrors {
  username_too_short_3 = "username_too_short_3",
  username_too_long_32 = "username_too_long_32",
  wrong_username = "wrong_username",
  same_username = "same_username",
}
