/**
 * Sign In Email Input Interface
 */
export interface SignInEmailInputInterface {
  address: string;
}

/**
 * Sign In Input Interface
 */
export interface SignInInputInterface {
  email: SignInEmailInputInterface;
  password: string;
}
