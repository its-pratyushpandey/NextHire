import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

const isAuthenticated = async (req, res, next) => {
    try {
        // Get token from cookie or Authorization header
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                message: "Please login to access this resource",
                success: false
            });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({
                message: 'Server misconfiguration: JWT_SECRET is not set.',
                success: false
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Ensure decoded has userId
            if (!decoded.userId) {
                throw new Error('Invalid token format: userId is missing');
            }

            // Get user from database
            const user = await User.findById(decoded.userId);
            if (!user) {
                return res.status(401).json({
                    message: "User not found",
                    success: false
                });
            }

            // Set user info in request
            req.user = user;
            req.id = user._id;

            // Log successful authentication
            console.log('Authentication successful:', {
                userId: decoded.userId,
                path: req.path
            });

            next();
        } catch (jwtError) {
            console.error('JWT verification failed:', {
                error: jwtError.message,
                path: req.path
            });

            return res.status(401).json({
                message: `Authentication failed: ${jwtError.message}`,
                success: false
            });
        }
    } catch (error) {
        console.error('Authentication error:', {
            error: error.message,
            path: req.path
        });

        return res.status(500).json({
            message: `Internal server error: ${error.message}`,
            success: false
        });
    }
};

export default isAuthenticated;