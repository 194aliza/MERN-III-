import { Request, Response, NextFunction } from "express";

interface RequestWithTime extends Request {
  startTime?: number;
}

export const requestLogger = (
  req: RequestWithTime,
  res: Response,
  next: NextFunction
) => {
  req.startTime = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - (req.startTime || 0);
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
