import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Route: POST /api/user/register
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields",
            });
        }

        // Check if user already exists in database
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Hash password before storing in database
        const hashPassword = await bcrypt.hash(password, 10);

        // Create new user in database
        const newUser = await User.create({
            name,
            email,
            password: hashPassword,
        });

        // Generate JWT token after successful registration
        // Payload contains user ID
        const token = jwt.sign(
            { id: newUser._id },       // data stored inside token
            process.env.JWT_SECRET,    // secret key from .env
            { expiresIn: "7d" }        // token expiration
        );

        // Store token in HTTP-only cookie
        // This keeps user logged in securely
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send success response (do NOT send password)
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: {
                email: newUser.email,
                name: newUser.name,
            },
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
// Route: POST /api/user/login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the fields"
            });
        }

        // Check if user exists in database
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Account not found. Please register first."
            });
        }


        // if user exists, compare provided password with hashed password in database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Generate JWT token after successful login
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // This keeps user logged in securely
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // Send success response (do NOT send password)
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            user: {
                email: user.email,
                name: user.name,
            },
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// Check Auth: /api/user/is-auth   -> to sheck if user authenticate and get user details
export const checkAuth = async (req, res) => {
    try {
        // first get iserId from request (set by authUser middleware)
        const userId = req.user.id;
        // if userId exists, then user is authenticated
        if (userId) {
            // find user in database by userId
            const user = await User.findById(userId).select("-password"); // exclude password from response
            if (user) {
                return res.status(200).json({
                    success: true,
                    message: "User is authenticated",
                    user
                });
            } else {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized: User not found"
                });
            }
        } else {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No user ID provided"
            });
        }


    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

// Route: POST /api/user/logout
export const logotUser = async (req, res) => {
    try {
        // Clear the token cookie to log out the user
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        })

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}