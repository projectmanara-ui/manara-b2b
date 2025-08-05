const express = require('express');
const db = require('../database/connection');
const { optionalAuth } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Get all organizations (public endpoint for registration)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const organizations = await db('organizations')
      .select('id', 'name', 'description', 'logo_url', 'monthly_allowance', 'currency')
      .where('is_active', true)
      .orderBy('name');

    res.json({
      success: true,
      data: { organizations }
    });

  } catch (error) {
    logger.error('Get organizations error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch organizations'
    });
  }
});

// Get specific organization
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const organizationId = req.params.id;

    const organization = await db('organizations')
      .select('id', 'name', 'description', 'logo_url', 'monthly_allowance', 'currency', 'settings')
      .where('id', organizationId)
      .where('is_active', true)
      .first();

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: 'Organization not found'
      });
    }

    res.json({
      success: true,
      data: { organization }
    });

  } catch (error) {
    logger.error('Get organization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch organization'
    });
  }
});

module.exports = router;