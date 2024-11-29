// routes/services.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Service = require('../models/Service');

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// GET all services
router.get('/', async (req, res) => {
  try {
    const services = await Service.find();
    const servicesWithFullImageUrl = services.map(service => ({
      ...service.toObject(),
      image: `http://localhost:5000/${service.image}`
    }));
    res.json(servicesWithFullImageUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// In your Express routes
router.get('/by-name/:serviceName', async (req, res) => {
  try {
    const service = await Service.findOne({ 
      service_name: req.params.serviceName 
    });
    
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    
    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
});

// POST new service with JSON parsing
// POST route with safer parsing
router.post('/', upload.single('image'), async (req, res) => {
  try {
    // Safely parse JSON strings or use empty arrays as fallback
    const parseArrayField = (field) => {
      try {
        return field ? JSON.parse(field) : [];
      } catch (error) {
        return Array.isArray(field) ? field : [field];
      }
    };

    const serviceData = {
      service_name: req.body.service_name,
      description: req.body.description,
      image: req.file ? req.file.path : '',
      what_to_expect: parseArrayField(req.body.what_to_expect),
      benefits: parseArrayField(req.body.benefits),
      suitable_for: parseArrayField(req.body.suitable_for)
    };

    const service = await Service.create(serviceData);
    res.status(201).json(service);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(400).json({ message: error.message });
  }
});

// GET single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update service
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const parseArrayField = (field) => {
      try {
        return field ? JSON.parse(field) : [];
      } catch (error) {
        return Array.isArray(field) ? field : [field];
      }
    };

    const updateData = {
      service_name: req.body.service_name,
      description: req.body.description,
      what_to_expect: parseArrayField(req.body.what_to_expect),
      benefits: parseArrayField(req.body.benefits),
      suitable_for: parseArrayField(req.body.suitable_for)
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    res.json(service);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(400).json({ message: error.message });
  }
});

// DELETE service
router.delete('/:id', async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;