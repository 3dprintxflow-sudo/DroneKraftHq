import { Request, Response, NextFunction } from 'express';

export const logger = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  console.log(`Incoming request: ${req.method} ${req.url}`);
  console.log(`Auth Header: ${authHeader ? authHeader.substring(0, 20) + '...' : 'None'}`);
  
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`Response status: ${res.statusCode} (${duration}ms)`);
  });

  next();
};
