// const express = require('express');
// const router = express.Router();
// const { body } = require('express-validator');
// const userController = require('../controllers/userController');
// const auth = require('../middlewares/auth');

// // Register validation and route
// router.post('/register', [
//   body('firstName').trim().notEmpty().withMessage('First name is required'),
//   body('lastName').trim().notEmpty().withMessage('Last name is required'),
//   body('email').isEmail().withMessage('Please enter a valid email'),
//   body('password')
//     .isLength({ min: 6 })
//     .withMessage('Password must be at least 6 characters long'),
//   body('confirmPassword')
//     .isLength({ min: 6 })
//     .withMessage('Confirm password must be at least 6 characters long')
// ], userController.register);

// // Login validation and route
// router.post('/login', [
//   body('email').isEmail().withMessage('Please enter a valid email'),
//   body('password').notEmpty().withMessage('Password is required')
// ], userController.login);

// // Update profile validation and route
// router.put('/profile', [
//   auth,
//   body('firstName').trim().notEmpty().withMessage('First name is required'),
//   body('lastName').trim().notEmpty().withMessage('Last name is required'),
//   body('email').isEmail().withMessage('Please enter a valid email')
// ], userController.updateProfile);

// // Change password validation and route
// router.put('/change-password', [
//   auth,
//   body('currentPassword').notEmpty().withMessage('Current password is required'),
//   body('newPassword')
//     .isLength({ min: 6 })
//     .withMessage('New password must be at least 6 characters long'),
//   body('confirmNewPassword')
//     .isLength({ min: 6 })
//     .withMessage('Confirm password must be at least 6 characters long')
// ], userController.changePassword);

// // Delete account route
// router.delete('/delete-account', auth, userController.deleteAccount);

// // Logout route
// router.post('/logout', auth, userController.logout);

// module.exports = router;