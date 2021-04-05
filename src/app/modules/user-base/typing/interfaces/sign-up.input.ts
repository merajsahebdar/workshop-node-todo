/**
 * Sign Up Account Input Interface
 */
export interface ISignUpAccountInput {
  forename: string;
  surname: string;
}

/**
 * Sign Up Input Interface
 */
export interface ISignUpInput {
  email: string;
  password: string;
  passwordConfirm: string;
  account: ISignUpAccountInput;
}
