export interface EmailVerifyPayload {
  sub: number;        // userId
  email: string;
  type: "email_verify";
}