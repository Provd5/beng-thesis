export enum AuthValidationErrors {
  password_required_error = "password_required_error",
  username_too_short_3 = "username_too_short_3",
  username_too_long_32 = "username_too_long_32",
  wrong_email = "wrong_email",
  wrong_password = "wrong_password",
  wrong_username = "wrong_username",
  user_exists = "user_exists",
  not_the_same_passwords = "not_the_same_passwords",
  something_went_wrong = "something_went_wrong",

  //supabase
  disabled_signups_error = "Email signups are disabled",
  email_link_error = "Email link is invalid or has expired",
  token_error = "Token has expired or is invalid",
  login_error = "Invalid login credentials",
  email_not_confirmed = "Email not confirmed",
}
