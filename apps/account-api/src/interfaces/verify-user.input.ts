/**
 * Verify Email Input Interface
 */
export interface IVerifyEmailInput {
  id: string;
  address: string;
  expires: number;
  signature: string;
}
