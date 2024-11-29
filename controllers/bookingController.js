const Booking = require('../models/Booking');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const booking = new Booking(req.body);
    const savedBooking = await booking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(400).json({ message: 'Error creating booking', error });
  }
};

// Get all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('service');
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('service');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching booking', error });
  }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'complete', 'approve', 'decline'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('service');

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status', error });
  }
};

// Update booking
exports.updateBooking = async (req, res) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('service');

    if (!updatedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking', error });
  }
};

// Delete a booking
exports.deleteBooking = async (req, res) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error });
  }
};


// // Cancel booking by user
// exports.cancelBooking = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.id);

//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }

//     // Ensure the logged-in user is the owner of the booking
//     if (booking.user.toString() !== req.user.id) {
//       return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
//     }

//     // Cancel booking (update status or delete)
//     booking.status = 'cancelled'; // Optionally delete: `await booking.remove();`
//     await booking.save();

//     res.status(200).json({ message: 'Booking cancelled successfully', booking });
//   } catch (error) {
//     res.status(500).json({ message: 'Error cancelling booking', error });
//   }
// };


// // Get bookings by user ID
// exports.getBookingsByUserId = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user: req.params.userId }).populate('service');
//     if (!bookings.length) {
//       return res.status(404).json({ message: 'No bookings found for this user' });
//     }
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching bookings', error });
//   }
// };
