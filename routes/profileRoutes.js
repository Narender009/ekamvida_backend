// // profileRoutes.js
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const authenticate = require('../middlewares/authenticate');

// // Update Profile
// router.put('/profile', authenticate, async (req, res) => {
//     try {
//         const { firstName, lastName, email } = req.body;
        
//         // Check if email is being changed and if it's already in use
//         if (email !== req.user.email) {
//             const existingUser = await User.findOne({ email });
//             if (existingUser) {
//                 return res.status(400).json({ error: 'Email already in use' });
//             }
//         }

//         // Update user profile
//         const updatedUser = await User.findByIdAndUpdate(
//             req.user._id,
//             {
//                 firstName,
//                 lastName,
//                 email,
//                 updatedAt: Date.now()
//             },
//             { new: true, runValidators: true }
//         ).select('-password');

//         res.json({
//             success: true,
//             message: 'Profile updated successfully',
//             user: updatedUser
//         });
//     } catch (error) {
//         console.error('Profile update error:', error);
//         res.status(500).json({ error: 'Failed to update profile' });
//     }
// });

// // Change Password
// router.put('/change-password', authenticate, async (req, res) => {
//     try {
//         const { currentPassword, newPassword } = req.body;

//         // Verify current password
//         const isMatch = await bcrypt.compare(currentPassword, req.user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: 'Current password is incorrect' });
//         }

//         // Hash new password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(newPassword, salt);

//         // Update password
//         await User.findByIdAndUpdate(req.user._id, {
//             password: hashedPassword,
//             updatedAt: Date.now()
//         });

//         res.json({
//             success: true,
//             message: 'Password changed successfully'
//         });
//     } catch (error) {
//         console.error('Password change error:', error);
//         res.status(500).json({ error: 'Failed to change password' });
//     }
// });

// // Delete Account
// router.delete('/delete-account', authenticate, async (req, res) => {
//     try {
//         const { password } = req.body;

//         // Verify password before deletion
//         const isMatch = await bcrypt.compare(password, req.user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: 'Password is incorrect' });
//         }

//         // Delete user account
//         await User.findByIdAndDelete(req.user._id);

//         res.json({
//             success: true,
//             message: 'Account deleted successfully'
//         });
//     } catch (error) {
//         console.error('Account deletion error:', error);
//         res.status(500).json({ error: 'Failed to delete account' });
//     }
// });

// // Logout (Blacklist Token)
// router.post('/logout', authenticate, async (req, res) => {
//     try {
//         // Note: In a production environment, you should implement token blacklisting
//         // Here's a simple response for now
//         res.json({
//             success: true,
//             message: 'Logged out successfully'
//         });
//     } catch (error) {
//         console.error('Logout error:', error);
//         res.status(500).json({ error: 'Failed to logout' });
//     }
// });

// module.exports = router;