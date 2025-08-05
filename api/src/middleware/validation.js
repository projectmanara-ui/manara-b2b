const Joi = require('joi');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    
    if (error) {
      const errorMessage = error.details.map(detail => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errorMessage
      });
    }
    
    next();
  };
};

// Validation schemas
const schemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^\+254[0-9]{9}$/).required(),
    organization_id: Joi.string().uuid().required(),
    employee_id: Joi.string().max(50).required(),
    emergency_contact: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      phone: Joi.string().pattern(/^\+254[0-9]{9}$/).required(),
      relationship: Joi.string().max(50).required()
    }).required()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  bookTrip: Joi.object({
    pickup_location_id: Joi.string().uuid().required(),
    drop_location_id: Joi.string().uuid().required(),
    scheduled_time: Joi.date().iso().required(),
    trip_type: Joi.string().valid('to_work', 'from_work').required(),
    notes: Joi.string().max(500).optional()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().pattern(/^\+254[0-9]{9}$/).optional(),
    emergency_contact: Joi.object({
      name: Joi.string().min(2).max(100).required(),
      phone: Joi.string().pattern(/^\+254[0-9]{9}$/).required(),
      relationship: Joi.string().max(50).required()
    }).optional()
  }),

  createLocation: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    address: Joi.string().min(5).max(200).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    type: Joi.string().valid('pickup_point', 'office', 'home').required(),
    organization_id: Joi.string().uuid().optional()
  }),

  emergency: Joi.object({
    location: Joi.object({
      latitude: Joi.number().min(-90).max(90).required(),
      longitude: Joi.number().min(-180).max(180).required()
    }).required(),
    message: Joi.string().max(500).optional(),
    type: Joi.string().valid('medical', 'security', 'breakdown', 'other').required()
  })
};

module.exports = {
  validate,
  schemas
};