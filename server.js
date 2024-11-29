// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const errorHandler = require('./middlewares/errorHandler');
const servicesRoutes = require('./routes/services');
const scheduleRoutes = require('./routes/schedules');
const instructorRoutes = require('./routes/instructorRoutes');
const timeSlotRoutes = require('./routes/timeSlotRoutes');
const contactRoutes = require('./routes/contactRoutes');
const eventRoutes = require('./routes/eventRoutes');
const postRoutes = require('./routes/posts');
const uploadRoutes = require('./routes/upload'); // Import the upload route
const User = require('./models/User');
const Testimonial = require('./models/Testimonial');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
require('dotenv').config();
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bookingRoutes = require('./routes/bookings'); // Import booking routes
const createBookingRoutes = require('./routes/createBooking');
const registrationRoutes = require('./routes/registration');
const queryRoutes = require('./routes/queryRoutes');




dotenv.config();

const app = express();

app.use(bodyParser.json());

// CORS configuration
// Update the CORS configuration at the top of server.js
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // Added Authorization header
    credentials: true
}));


// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve images from the uploads directory
app.use('/uploads', express.static('uploads'));

// Multer configuration for storing images in the uploads directory
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.error('MongoDB connection error:', error));

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Hello, World!');
});




// Middleware to check authentication
const authenticate = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    
    // Check if Authorization header exists
    if (!authHeader) {
        return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Remove 'Bearer ' from token
    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        
        req.user = user;
        next();
    } catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid or expired token. Please authenticate again.' });
    }
};

  
// User Profile Route
app.get('/api/profile', authenticate, (req, res) => {
    if (!req.user) {
        return res.status(404).json({ error: 'User profile not found' });
    }
    res.json({
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        email: req.user.email,
    });
})
  
// Update Profile Route
app.put('/api/profile', authenticate, async (req, res) => {
    const { firstName, lastName, email } = req.body;
    
    try {
        // Validate input
        if (!firstName || !lastName || !email) {
            return res.status(400).json({ 
                error: 'First name, last name, and email are required' 
            });
        }

        // Check if email is already taken by another user
        const existingUser = await User.findOne({ 
            email, 
            _id: { $ne: req.user._id } 
        });
        
        if (existingUser) {
            return res.status(409).json({ 
                error: 'Email is already in use' 
            });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { 
                firstName, 
                lastName, 
                email 
            },
            { 
                new: true, 
                runValidators: true,
                select: '-password' // Exclude password from the response
            }
        );

        if (!updatedUser) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        res.json({ 
            user: updatedUser, 
            success: true 
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ 
            error: 'Failed to update profile. Please try again.' 
        });
    }
});

// Change Password Route
app.put('/api/change-password', authenticate, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    try {
        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ 
                error: 'Current password and new password are required' 
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ 
                error: 'New password must be at least 6 characters long' 
            });
        }

        const user = await User.findById(req.user._id);

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                error: 'Current password is incorrect' 
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.json({ 
            success: true, 
            message: 'Password changed successfully' 
        });
    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ 
            error: 'Failed to change password. Please try again.' 
        });
    }
});

// Delete Account Route
app.delete('/api/delete-account', authenticate, async (req, res) => {
    try {
        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(req.user._id);
        
        if (!deletedUser) {
            return res.status(404).json({ 
                error: 'User not found' 
            });
        }

        // Here you might want to add additional cleanup
        // Such as deleting user's posts, comments, etc.
        
        res.json({ 
            success: true, 
            message: 'Account deleted successfully' 
        });
    } catch (error) {
        console.error('Account deletion error:', error);
        res.status(500).json({ 
            error: 'Failed to delete account. Please try again.' 
        });
    }
});
  


  
  // Logout Route
  app.post('/api/logout', authenticate, (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});



// API Endpoint: Get all users
app.get('/api/users', async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  });
  
  // API Endpoint: Create a new user
  app.post('/api/users', async (req, res) => {
    const { firstName, lastName, email } = req.body;
  
    try {
      const user = new User({ firstName, lastName, email });
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(400).json({ error: 'Failed to create user' });
    }
  });
// Register Route (with password hashing)
// Register Route
app.post('/api/register', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists' });
        }

        // Create a new user
        const user = new User({ firstName, lastName, email, password });
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, success: true });
    } catch (error) {
        res.status(400).json({ error: 'Failed to register user' });
    }
});



// Login Route (already correct)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, success: true });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'An unexpected error occurred. Please try again later.' });
    }
});


// Forgot Password Route
app.post('/api/forgot-password', async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User with this email does not exist' });
        }

        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = Date.now() + 3600000; // 1 hour

        // Save token and expiry to user's document
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = tokenExpiry;
        await user.save();

        // Send reset email
        const resetUrl = `http://localhost:3000/ResetPasswordPage/${resetToken}`;
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: 'Password Reset Request',
            text: `You are receiving this email because you (or someone else) have requested a password reset.\n\n
                   Please click on the following link, or paste it into your browser to complete the process:\n\n
                   ${resetUrl}\n\n
                   If you did not request this, please ignore this email and your password will remain unchanged.\n`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Failed to send reset email. Please try again later.' });
    }
});

// Reset Password Route
app.post('/api/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({ error: 'Password reset token is invalid or has expired' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ error: 'New password must be at least 6 characters long' });
        }

        // Hash and save the new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        // Clear reset token and expiry
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();

        res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Failed to reset password. Please try again.' });
    }
});

// In your Express routes
app.get('/api/testimonials', async (req, res) => {
    try {
      const testimonials = await Testimonial.find();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching testimonials', error });
    }
  });

  app.post('/api/testimonials', async (req, res) => {
    try {
      const { name, message } = req.body;
  
      const newTestimonial = new Testimonial({
        name,
        message,
      });
  
      const savedTestimonial = await newTestimonial.save();
      res.status(201).json(savedTestimonial);
    } catch (error) {
      res.status(400).json({ message: 'Error adding testimonial', error });
    }
  });
  




// Use routes with image upload middleware on the instructors route
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/instructors', instructorRoutes(upload)); // Pass upload middleware to instructor routes
app.use('/api/schedules', scheduleRoutes);
app.use('/api/timeslots', timeSlotRoutes);
app.use('/api/submit', contactRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/posts', postRoutes); // Use the post routes
app.use('/api/upload', uploadRoutes); // Add the upload route
app.use('/api/bookings', bookingRoutes); // Mount booking routes
app.use('/api/book-class', createBookingRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/submit-query', queryRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
