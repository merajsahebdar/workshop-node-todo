/**
 * Sign Up Profile Input Interface
 */
export interface SignUpProfileInputInterface {
  forename: string;
  surname: string;
}

/**
 * Sign Up Email Input Interface
 */
export interface SignUpEmailInputInterface {
  address: string;
}

/**
 * Sign Up Input Interface
 */
export interface SignUpInputInterface {
  password: string;
  passwordConfirm: string;
  email: SignUpEmailInputInterface;
  profile: SignUpProfileInputInterface;
}
