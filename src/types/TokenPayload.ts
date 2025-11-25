export interface TokenPayloadProps {
    userId: number;
    userRole: string;
}
export interface TokenPayload extends TokenPayloadProps {
    iat: number;
    exp: number;
}