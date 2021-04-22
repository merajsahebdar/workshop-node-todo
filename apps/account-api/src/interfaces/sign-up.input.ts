/**
 * Sign Up Account Input Interface
 */
export interface ISignUpAccountInput {
  forename: string;
  surname: string;
}

/**
 * Sign Up Email Input Interface
 */
export interface ISignUpEmailInput {
  address: string;
}

/**
 * Sign Up Input Interface
 */
export interface ISignUpInput {
  password: string;
  passwordConfirm: string;
  email: ISignUpEmailInput;
  account: ISignUpAccountInput;
}
