// models/Service.js
const mongoose = require('mongoose');

// Models
const serviceSchema = new mongoose.Schema({
  service_name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  what_to_expect: [{
    type: String,
    required: true
  }],
  benefits: [{
    type: String,
    required: true
  }],
  suitable_for: [{
    type: String,
    required: true
  }]
});

// const Service = mongoose.model('Service', serviceSchema);


module.exports = mongoose.model('Service', serviceSchema);





