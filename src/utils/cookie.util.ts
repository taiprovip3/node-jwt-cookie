import ms, { StringValue } from "ms";
import { getEnv } from "./env.util.js";
import { Response } from "express";

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string
) => {
  const accessExpires = getEnv('JWT_ACCESS_TOKEN_EXPIRATION_TIME') as StringValue;
  const refreshExpires = getEnv('JWT_REFRESH_TOKEN_EXPIRATION_TIME') as StringValue;

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ms(accessExpires),
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    signed: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/",
    maxAge: ms(refreshExpires),
  });
};