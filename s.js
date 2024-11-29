// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// const errorHandler = require('./middlewares/errorHandler');
// const servicesRoutes = require('./routes/services');
// const scheduleRoutes = require('./routes/schedules');
// const instructorRoutes = require('./routes/instructorRoutes');
// const timeSlotRoutes = require('./routes/timeSlotRoutes');
// const contactRoutes = require('./routes/contactRoutes');
// const eventRoutes = require('./routes/eventRoutes');
// const postRoutes = require('./routes/posts');
// const uploadRoutes = require('./routes/upload'); // Import the upload route
// const User = require('./models/User');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const bodyParser = require('body-parser');
// require('dotenv').config();



// dotenv.config();

// const app = express();

// app.use(bodyParser.json());

// // CORS configuration
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://localhost:3001'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type']
// }));

// // Serve static files from the uploads directory
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // Serve images from the uploads directory
// app.use('/uploads', express.static('uploads'));

// // Multer configuration for storing images in the uploads directory
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + path.extname(file.originalname));
//     }
// });

// const upload = multer({ storage });

// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch((error) => console.error('MongoDB connection error:', error));

// // Basic route for testing
// app.get('/', (req, res) => {
//     res.send('Hello, World!');
// });




// // Middleware to check authentication
// const authenticate = async (req, res, next) => {
//     const authHeader = req.header('Authorization');
    
//     // Check if Authorization header exists
//     if (!authHeader) {
//         return res.status(401).json({ error: 'Authorization header missing' });
//     }

//     // Remove 'Bearer ' from token
//     const token = authHeader.replace('Bearer ', '');

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await User.findById(decoded.id);
//         if (!user) return res.status(404).json({ error: 'User not found' });
        
//         req.user = user;
//         next();
//     } catch (error) {
//         console.error('Authentication error:', error);
//         res.status(401).json({ error: 'Invalid or expired token. Please authenticate again.' });
//     }
// };

  
// // User Profile Route
// app.get('/api/profile', authenticate, (req, res) => {
//     if (!req.user) {
//         return res.status(404).json({ error: 'User profile not found' });
//     }
//     res.json({
//         firstName: req.user.firstName,
//         lastName: req.user.lastName,
//         email: req.user.email,
//     });
// })
  
// // Update Profile
// app.put('/api/profile', authenticate, async (req, res) => {
//     const { firstName, lastName, email } = req.body;
//     try {
//         const updatedUser = await User.findByIdAndUpdate(
//             req.user._id,
//             { firstName, lastName, email },
//             { new: true, runValidators: true }
//         );

//         if (!updatedUser) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         res.json({ user: updatedUser, success: true });
//     } catch (error) {
//         console.error('Profile update error:', error);
//         res.status(400).json({ error: 'Failed to update profile' });
//     }
// });


  
//   // Change Password Route
// // Change Password
// app.put('/api/change-password', authenticate, async (req, res) => {
//     const { currentPassword, newPassword } = req.body;
//     try {
//         const user = await User.findById(req.user._id);

//         const isMatch = await bcrypt.compare(currentPassword, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: 'Current password is incorrect' });
//         }

//         user.password = newPassword;
//         await user.save();

//         res.json({ success: true, message: 'Password changed successfully' });
//     } catch (error) {
//         console.error('Change password error:', error);
//         res.status(400).json({ error: 'Failed to change password' });
//     }
// });


  
//   // Delete Account Route
//   app.delete('/api/delete-account', authenticate, async (req, res) => {
//     try {
//         const user = await User.findById(req.user._id);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         await User.findByIdAndDelete(req.user._id);
//         res.json({ success: true, message: 'Account deleted successfully' });
//     } catch (error) {
//         console.error('Account deletion error:', error.message || error);
//         res.status(500).json({ error: 'Failed to delete account. Please try again later.' });
//     }
// });



  
//   // Logout Route
//   app.post('/api/logout', authenticate, (req, res) => {
//     res.json({ success: true, message: 'Logged out successfully' });
// });

// // Register Route (with password hashing)
// // Register Route
// app.post('/api/register', async (req, res) => {
//     const { firstName, lastName, email, password } = req.body;
//     try {
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(409).json({ error: 'User already exists' });
//         }

//         // Create a new user
//         const user = new User({ firstName, lastName, email, password });
//         await user.save();

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.status(201).json({ token, success: true });
//     } catch (error) {
//         res.status(400).json({ error: 'Failed to register user' });
//     }
// });



// // Login Route (already correct)
// app.post('/api/login', async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }

//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ error: 'Invalid email or password' });
//         }

//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         res.json({ token, success: true });
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
//     }
// });




// // Use routes with image upload middleware on the instructors route
// const apiRoutes = require('./routes/api');
// app.use('/api', apiRoutes);
// app.use('/api/services', servicesRoutes);
// app.use('/api/instructors', instructorRoutes(upload)); // Pass upload middleware to instructor routes
// app.use('/api/schedules', scheduleRoutes);
// app.use('/api/timeslots', timeSlotRoutes);
// app.use('/api/submit', contactRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/posts', postRoutes); // Use the post routes
// app.use('/api/upload', uploadRoutes); // Add the upload route


// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
// });
