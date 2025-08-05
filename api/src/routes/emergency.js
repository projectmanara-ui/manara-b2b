const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// Create emergency alert
router.post('/', authenticateToken, validate(schemas.emergency), async (req, res) => {
  try {
    const { location, message, type } = req.body;
    const userId = req.user.id;

    // Check if user has an active emergency alert
    const existingAlert = await db('emergency_alerts')
      .where('user_id', userId)
      .where('status', 'active')
      .first();

    if (existingAlert) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active emergency alert'
      });
    }

    // Create emergency alert
    const alertId = uuidv4();
    await db('emergency_alerts').insert({
      id: alertId,
      user_id: userId,
      type,
      latitude: location.latitude,
      longitude: location.longitude,
      message: message || `Emergency alert: ${type}`
    });

    // Get user details for notification
    const user = await db('users')
      .select('name', 'phone', 'email', 'emergency_contact')
      .where('id', userId)
      .first();

    // Log emergency alert
    logger.error(`EMERGENCY ALERT: ${type} from user ${user.name} (${user.email}) at ${location.latitude}, ${location.longitude}`);

    // In a real application, you would:
    // 1. Send SMS/call to emergency contacts
    // 2. Notify security team
    // 3. Send push notifications to relevant personnel
    // 4. Integrate with emergency services if needed

    // Create notification for user
    await db('notifications').insert({
      user_id: userId,
      title: 'Emergency Alert Sent',
      message: 'Your emergency alert has been sent to our response team. Help is on the way.',
      type: 'emergency'
    });

    res.status(201).json({
      success: true,
      message: 'Emergency alert sent successfully. Help is on the way.',
      data: {
        alert_id: alertId,
        emergency_contact: process.env.EMERGENCY_CONTACT_PHONE || '+254700000000'
      }
    });

  } catch (error) {
    logger.error('Create emergency alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send emergency alert'
    });
  }
});

// Get user's emergency alerts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, limit = 10, offset = 0 } = req.query;

    let query = db('emergency_alerts')
      .select('*')
      .where('user_id', userId)
      .orderBy('created_at', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    if (status) {
      query = query.where('status', status);
    }

    const alerts = await query;

    const formattedAlerts = alerts.map(alert => ({
      id: alert.id,
      type: alert.type,
      status: alert.status,
      location: alert.latitude && alert.longitude ? {
        latitude: parseFloat(alert.latitude),
        longitude: parseFloat(alert.longitude)
      } : null,
      message: alert.message,
      created_at: alert.created_at,
      resolved_at: alert.resolved_at,
      resolution_notes: alert.resolution_notes
    }));

    res.json({
      success: true,
      data: {
        alerts: formattedAlerts,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: alerts.length
        }
      }
    });

  } catch (error) {
    logger.error('Get emergency alerts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergency alerts'
    });
  }
});

// Cancel emergency alert
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const alertId = req.params.id;
    const userId = req.user.id;

    const alert = await db('emergency_alerts')
      .where('id', alertId)
      .where('user_id', userId)
      .first();

    if (!alert) {
      return res.status(404).json({
        success: false,
        message: 'Emergency alert not found'
      });
    }

    if (alert.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Only active alerts can be cancelled'
      });
    }

    // Update alert status
    await db('emergency_alerts')
      .where('id', alertId)
      .update({
        status: 'cancelled',
        resolved_at: new Date(),
        resolution_notes: 'Cancelled by user'
      });

    logger.info(`Emergency alert cancelled: ${alertId} by user ${userId}`);

    res.json({
      success: true,
      message: 'Emergency alert cancelled successfully'
    });

  } catch (error) {
    logger.error('Cancel emergency alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel emergency alert'
    });
  }
});

// Get emergency contacts
router.get('/contacts', authenticateToken, async (req, res) => {
  try {
    const user = await db('users')
      .select('emergency_contact')
      .where('id', req.user.id)
      .first();

    const emergencyContacts = [
      {
        name: 'Manara Emergency Response',
        phone: process.env.EMERGENCY_CONTACT_PHONE || '+254700000000',
        type: 'primary'
      }
    ];

    if (user.emergency_contact) {
      const personalContact = JSON.parse(user.emergency_contact);
      emergencyContacts.push({
        name: personalContact.name,
        phone: personalContact.phone,
        relationship: personalContact.relationship,
        type: 'personal'
      });
    }

    res.json({
      success: true,
      data: { contacts: emergencyContacts }
    });

  } catch (error) {
    logger.error('Get emergency contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch emergency contacts'
    });
  }
});

module.exports = router;