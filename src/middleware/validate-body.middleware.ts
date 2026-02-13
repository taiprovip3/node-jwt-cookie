import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from '../types/ResponseHandler.js';

export function validateBody<T extends object>(dtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if(!req.body || Object.keys(req.body).length === 0) {
      return RequestHandler.error(res, "VALIDATE_BODY", "Request body must not be empty!", 400);
    }
    const dto = plainToInstance(dtoClass, req.body);
    const errors = await validate(dto, {
      whitelist: true,              // loại field không khai báo
      forbidNonWhitelisted: true,   // gửi balance là chết
    });
    if (errors.length > 0) {
      return res.status(400).json({
        message: 'Validation failed',
        errors,
      });
    }
    req.body = dto;
    next();
  };
}