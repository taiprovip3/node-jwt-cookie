import { Request } from "express";
import { TokenPayload } from "./TokenPayload.js";

export interface CustomAuthExpressRequest extends Request {
    user?: TokenPayload;
}