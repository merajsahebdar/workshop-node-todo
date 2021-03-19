import { ISignInInput } from '../../interfaces/sign-in.input';

/**
 * Sign In Command
 */
export class SignInCommand {
  /**
   * Constructor
   *
   * @param {ISignInInput} input
   */
  constructor(public readonly input: ISignInInput) {}
}
