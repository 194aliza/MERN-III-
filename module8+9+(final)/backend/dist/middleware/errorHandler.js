import { AppError } from "../utils/apperror.js";
export const errorHandler = (err, req, res, next) => {
    const isDev = process.env.NODE_ENV !== "production";
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            ...(isDev && { stack: err.stack }),
        });
    }
    console.error(" ERROR:", err);
    return res.status(500).json({
        success: false,
        message: isDev ? err.message : "Internal Server Error",
        ...(isDev && { stack: err.stack }),
    });
};
//# sourceMappingURL=errorHandler.js.map