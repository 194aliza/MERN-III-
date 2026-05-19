import { Request, Response, NextFunction } from "express";
interface RequestWithTime extends Request {
    startTime?: number;
}
export declare const requestLogger: (req: RequestWithTime, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=requestLogger.d.ts.map