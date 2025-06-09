import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;
         
        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Invalid email format",
                success: false
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters",
                success: false
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Use local default avatar for reliability
        let profilePhotoUrl = '/default-avatar.png'; // default avatar

        // Handle file upload if present
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

        const hashedPassword = await bcrypt.hash(password, 10);

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
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Check if JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not configured');
        }

        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            });
        }

        const tokenData = {
            userId: user._id
        };

        const token = jwt.sign(tokenData, process.env.JWT_SECRET, { 
            expiresIn: '1d' 
        });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

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
        console.error('Login error:', error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};

export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, bio, location, companyRole, expertise, specializations, linkedIn, website } = req.body;
        const userId = req.id;

        let user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Handle file upload if present
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

        // Update user fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        
        // Update profile fields
        if (bio) user.profile.bio = bio;
        if (location) user.profile.location = location;
        if (companyRole) user.profile.companyRole = companyRole;
        if (expertise) user.profile.expertise = JSON.parse(expertise);
        if (specializations) user.profile.specializations = JSON.parse(specializations);
        if (linkedIn) user.profile.linkedIn = linkedIn;
        if (website) user.profile.website = website;

        await user.save();

        // Format user response
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
        console.error('Profile update error:', error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: error.message
        });
    }
};