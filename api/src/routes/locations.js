const express = require('express');
const db = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// Get all pickup locations
router.get('/pickup-points', authenticateToken, async (req, res) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query; // radius in km

    let query = db('locations')
      .select('*')
      .where('type', 'pickup_point')
      .where('is_active', true)
      .where(function() {
        this.whereNull('organization_id')
          .orWhere('organization_id', req.user.organization_id);
      });

    // If coordinates provided, calculate distance and filter by radius
    if (latitude && longitude) {
      query = query.whereRaw(`
        (6371 * acos(cos(radians(?)) * cos(radians(latitude)) * 
        cos(radians(longitude) - radians(?)) + sin(radians(?)) * 
        sin(radians(latitude)))) <= ?
      `, [latitude, longitude, latitude, radius]);
    }

    const locations = await query.orderBy('name');

    const formattedLocations = locations.map(location => ({
      id: location.id,
      name: location.name,
      address: location.address,
      coordinates: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude)
      },
      type: location.type,
      metadata: location.metadata,
      distance: latitude && longitude ? calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(location.latitude),
        parseFloat(location.longitude)
      ) : null
    }));

    res.json({
      success: true,
      data: { locations: formattedLocations }
    });

  } catch (error) {
    logger.error('Get pickup points error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pickup points'
    });
  }
});

// Get office locations for user's organization
router.get('/offices', authenticateToken, async (req, res) => {
  try {
    const locations = await db('locations')
      .select('*')
      .where('type', 'office')
      .where('organization_id', req.user.organization_id)
      .where('is_active', true)
      .orderBy('name');

    const formattedLocations = locations.map(location => ({
      id: location.id,
      name: location.name,
      address: location.address,
      coordinates: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude)
      },
      type: location.type,
      metadata: location.metadata
    }));

    res.json({
      success: true,
      data: { locations: formattedLocations }
    });

  } catch (error) {
    logger.error('Get office locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch office locations'
    });
  }
});

// Search locations
router.get('/search', authenticateToken, async (req, res) => {
  try {
    const { q, type, latitude, longitude } = req.query;

    if (!q || q.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    let query = db('locations')
      .select('*')
      .where('is_active', true)
      .where(function() {
        this.where('name', 'ilike', `%${q}%`)
          .orWhere('address', 'ilike', `%${q}%`);
      })
      .where(function() {
        this.whereNull('organization_id')
          .orWhere('organization_id', req.user.organization_id);
      });

    if (type) {
      query = query.where('type', type);
    }

    const locations = await query.limit(20).orderBy('name');

    const formattedLocations = locations.map(location => ({
      id: location.id,
      name: location.name,
      address: location.address,
      coordinates: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude)
      },
      type: location.type,
      metadata: location.metadata,
      distance: latitude && longitude ? calculateDistance(
        parseFloat(latitude),
        parseFloat(longitude),
        parseFloat(location.latitude),
        parseFloat(location.longitude)
      ) : null
    }));

    res.json({
      success: true,
      data: { locations: formattedLocations }
    });

  } catch (error) {
    logger.error('Search locations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search locations'
    });
  }
});

// Get specific location
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const locationId = req.params.id;

    const location = await db('locations')
      .select('*')
      .where('id', locationId)
      .where('is_active', true)
      .where(function() {
        this.whereNull('organization_id')
          .orWhere('organization_id', req.user.organization_id);
      })
      .first();

    if (!location) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    const formattedLocation = {
      id: location.id,
      name: location.name,
      address: location.address,
      coordinates: {
        latitude: parseFloat(location.latitude),
        longitude: parseFloat(location.longitude)
      },
      type: location.type,
      metadata: location.metadata,
      created_at: location.created_at
    };

    res.json({
      success: true,
      data: { location: formattedLocation }
    });

  } catch (error) {
    logger.error('Get location error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location'
    });
  }
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return Math.round(distance * 100) / 100; // Round to 2 decimal places
}

module.exports = router;