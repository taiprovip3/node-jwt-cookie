import ms, { StringValue } from "ms";
import { jwtConfig } from "../config/jwt-config.js";
import { getEnv } from "../utils/env.util.js";
import { User } from "../entity/User.js";

export const buildOAuth2Response = (
  accessToken: string,
  user?: User,
) => {
  const expiresInRaw = getEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME', { default: '15m' }) as StringValue;
  const expiresInMs = ms(expiresInRaw);

  if (!expiresInMs) {
    throw new Error('Invalid JWT_ACCESS_TOKEN_EXPIRATION_TIME');
  }

  return {
    token_type: "Bearer",
    access_token: accessToken,
    expires_in: jwtConfig.accessTokenExpirationTime,
    expires_at: Date.now() + expiresInMs,
    refresh_token: 'token was saved in cookie!',
    ...(user && { user }),
  };
};