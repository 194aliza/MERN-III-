import { AppError } from "../utils/apperror.js";
export const validate = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const errors = result.error.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            }));
            throw new AppError(`Validation failed: ${errors.map((e) => e.message).join(", ")}`, 400);
        }
        // Replace body with validated data
        req.body = result.data;
        next();
    };
};
//# sourceMappingURL=validate.js.map