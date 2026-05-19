import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import { AppError } from "../utils/apperror.js";
const generateToken = (id) => {
    const secret = process.env.JWT_SECRET || "test-secret";
    return jwt.sign({ id }, secret, {
        expiresIn: "7d"
    });
};
// REGISTER
export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
        throw new AppError("Email, password, and name are required", 400);
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
        throw new AppError("User already exists", 400);
    }
    const user = await User.create({ name, email, password });
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString())
    });
};
// LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new AppError("Email and password are required", 400);
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError("Invalid credentials", 401);
    }
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString())
    });
};
//# sourceMappingURL=authcontroller.js.map