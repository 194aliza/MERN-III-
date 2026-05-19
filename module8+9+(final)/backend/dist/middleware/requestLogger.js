export const requestLogger = (req, res, next) => {
    req.startTime = Date.now();
    res.on("finish", () => {
        const duration = Date.now() - (req.startTime || 0);
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
    });
    next();
};
//# sourceMappingURL=requestLogger.js.map