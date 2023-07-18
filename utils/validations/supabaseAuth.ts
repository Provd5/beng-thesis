export enum supabaseAuthValidatorErrors {
  //signup
  disabled_signups_error = "Email signups are disabled",
  email_link_error = "Email link is invalid or has expired",
  token_error = "Token has expired or is invalid",

  //login
  login_error = "Invalid login credentials",
  email_not_confirmed = "Email not confirmed",
}
