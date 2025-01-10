const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken")

// Route to register a new user (signup)
router.post('/signup', async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ 
            $or: [
                { email: req.body.email },
                { username: req.body.username }
            ]
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        const savedUser = await newUser.save();
        
        // Generate JWT token
        const token = jwt.sign(
            { id: savedUser._id, username: savedUser.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });

        res.status(201).json({
            _id: savedUser._id,
            username: savedUser.username,
            email: savedUser.email
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Route to login user (signin)
router.post('/signin', async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Check password using bcrypt
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Set token in cookie
        res.cookie('token', token);

        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            token: token
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Note: Add these fields to User Schema in models/user.js
// resetPasswordToken: { type: String },
// resetPasswordExpires: { type: Date }

// Route to handle forgot password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Generate password reset token
        const resetToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '15m' }
        );

        // Hash the reset token before saving
        const salt = await bcrypt.genSalt(10);
        const hashedResetToken = await bcrypt.hash(resetToken, salt);

        // Save the hashed reset token and expiration
        user.resetPasswordToken = hashedResetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        // In a real application, you would send this token via email
        // For development, we'll return it in the response
        res.json({ 
            message: "Password reset token generated successfully",
            resetToken: resetToken // In production, remove this and send via email
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to reset password using token from request body
router.post('/reset-password', async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;
        
        // Verify the token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your-secret-key');
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify token hasn't expired
        if (user.resetPasswordExpires < Date.now()) {
            return res.status(400).json({ message: "Password reset token has expired" });
        }

        // Verify stored hashed token matches
        const isValidToken = await bcrypt.compare(resetToken, user.resetPasswordToken);
        if (!isValidToken) {
            return res.status(400).json({ message: "Invalid or expired password reset token" });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password and clear reset token fields
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: "Password has been reset successfully" });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: "Invalid token" });
        }
        res.status(500).json({ message: error.message });
    }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update user profile
router.post('/profile', authenticateToken, async (req, res) => {
    try {
        const { username, bio, location, phoneNumber, socialLinks, preferences } = req.body;
        
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update fields if provided
        if (username !== undefined) user.username = username;
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (socialLinks) {
            if (socialLinks.twitter !== undefined) user.socialLinks.twitter = socialLinks.twitter;
            if (socialLinks.instagram !== undefined) user.socialLinks.instagram = socialLinks.instagram;
            if (socialLinks.facebook !== undefined) user.socialLinks.facebook = socialLinks.facebook;
        }
        if (preferences) {
            if (preferences.emailNotifications !== undefined) user.preferences.emailNotifications = preferences.emailNotifications;
            if (preferences.darkMode !== undefined) user.preferences.darkMode = preferences.darkMode;
        }

        user.lastUpdated = Date.now();
        await user.save();

        // Return updated user without sensitive information
        const updatedUser = await User.findById(req.user.id).select('-password -resetPasswordToken -resetPasswordExpires');
        res.json(updatedUser);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = router;