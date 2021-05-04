/**
 * Verify Email Input Interface
 */
export interface VerifyEmailInputInterface {
  id: string;
  address: string;
  expires: number;
  signature: string;
}
