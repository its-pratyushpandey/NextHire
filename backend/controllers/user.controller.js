// Imports
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

// Register user
export const register = async (req, res) => {
    try {
        // Get fields
        const { fullname, email, phoneNumber, password, role } = req.body;
        // Validate fields
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }
        // Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false
            });
        }
        // Password length
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
                success: false
            });
        }
        // Check user exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }
        // Default avatar
        let profilePhotoUrl = '/default-avatar.png';
        // Upload photo
        if (req.file) {
            const fileUri = getDataUri(req.file);
            if (fileUri) {
                try {
                    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                    profilePhotoUrl = cloudResponse.secure_url;
                } catch (cloudinaryError) {
                    console.error('Cloudinary upload failed:', cloudinaryError);
                    return res.status(500).json({
                        message: "Failed to upload profile photo",
                        success: false
                    });
                }
            }
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const newUser = await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl
            }
        });
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        // Error
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

// Login user
export const login = async (req, res) => {
    try {
        // Get fields
        const { email, password, role } = req.body;
        // Validate fields
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }
        // Check JWT secret
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }
        // Find user
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        // Check password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }
        // Check role
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }
        // Token data
        const tokenData = {
            userId: user._id
        };
        // Sign token
        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { 
            expiresIn: '1d' 
        });
        // User response
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };
        // Set cookie and respond
        return res.status(200)
            .cookie("token", token, { 
                maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production'
            })
            .json({
                message: `Welcome back ${user.fullname}`,
                user,
                token,
                success: true
            });
    } catch (error) {
        // Error
        console.error('Login error:', error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

// Logout user
export const logout = async (req, res) => {
    try {
        // Clear cookie
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

// Update profile
export const updateProfile = async (req, res) => {
    try {
        // Get fields
        const { fullname, email, phoneNumber, bio, location, companyRole, expertise, specializations, linkedIn, website } = req.body;
        const userId = req.id;
        // Find user
        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }
        // Upload photo
        if (req.file) {
            const fileUri = getDataUri(req.file);
            if (fileUri) {
                try {
                    const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                    user.profile.profilePhoto = cloudResponse.secure_url;
                } catch (cloudinaryError) {
                    console.error('Cloudinary upload failed:', cloudinaryError);
                    return res.status(500).json({
                        message: "Failed to upload profile photo",
                        success: false
                    });
                }
            }
        }
        // Update fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (location) user.profile.location = location;
        if (companyRole) user.profile.companyRole = companyRole;
        if (expertise) user.profile.expertise = JSON.parse(expertise);
        if (specializations) user.profile.specializations = JSON.parse(specializations);
        if (linkedIn) user.profile.linkedIn = linkedIn;
        if (website) user.profile.website = website;
        await user.save();
        // User response
        const userResponse = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };
        return res.status(200).json({
            message: "Profile updated successfully.",
            user: userResponse,
            success: true
        });
    } catch (error) {
        // Error
        console.error('Profile update error:', error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};