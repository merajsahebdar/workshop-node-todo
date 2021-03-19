import { ISignUpInput } from '../../interfaces/sign-up.input';

/**
 * Sign Up Command
 */
export class SignUpCommand {
  /**
   * Constructor
   *
   * @param {ISignUpInput} input
   */
  constructor(public readonly input: ISignUpInput) {}
}
