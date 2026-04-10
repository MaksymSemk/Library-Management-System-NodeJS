import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ status: 'error', message: 'Avatar file is too large. Max size is 5MB.' });
    }

    return res.status(400).json({ status: 'error', message: err.message });
  }

  if (err?.message === 'Only JPEG and PNG files are allowed') {
    return res.status(400).json({ status: 'error', message: err.message });
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: err.flatten()
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal server error';

  res.status(status).json({
    status: 'error',
    message: message,
  });
};