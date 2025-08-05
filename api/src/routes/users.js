const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// Update user profile
router.patch('/profile', authenticateToken, validate(schemas.updateProfile), async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, emergency_contact } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (emergency_contact) updateData.emergency_contact = JSON.stringify(emergency_contact);

    await db('users')
      .where('id', userId)
      .update({
        ...updateData,
        updated_at: new Date()
      });

    // Get updated user
    const updatedUser = await db('users')
      .select(
        'id', 'name', 'email', 'phone', 'organization_id', 
        'employee_id', 'role', 'emergency_contact', 'shift_preferences'
      )
      .where('id', userId)
      .first();

    logger.info(`User profile updated: ${userId}`);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    logger.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile'
    });
  }
});

// Change password
router.patch('/password', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { current_password, new_password } = req.body;

    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters long'
      });
    }

    // Get current user
    const user = await db('users').select('password_hash').where('id', userId).first();
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(current_password, user.password_hash);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(new_password, saltRounds);

    // Update password
    await db('users')
      .where('id', userId)
      .update({
        password_hash: newPasswordHash,
        updated_at: new Date()
      });

    logger.info(`Password changed for user: ${userId}`);

    res.json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    logger.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change password'
    });
  }
});

// Update shift preferences
router.patch('/shift-preferences', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { regular_shift, work_days, preferred_pickup_time, preferred_drop_time } = req.body;

    const shiftPreferences = {
      regular_shift,
      work_days,
      preferred_pickup_time,
      preferred_drop_time,
      updated_at: new Date().toISOString()
    };

    await db('users')
      .where('id', userId)
      .update({
        shift_preferences: JSON.stringify(shiftPreferences),
        updated_at: new Date()
      });

    logger.info(`Shift preferences updated for user: ${userId}`);

    res.json({
      success: true,
      message: 'Shift preferences updated successfully',
      data: { shift_preferences: shiftPreferences }
    });

  } catch (error) {
    logger.error('Update shift preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update shift preferences'
    });
  }
});

// Get user statistics
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Get trip statistics
    const tripStats = await db('trips')
      .select(
        db.raw('COUNT(*) as total_trips'),
        db.raw('COUNT(CASE WHEN status = \'completed\' THEN 1 END) as completed_trips'),
        db.raw('COUNT(CASE WHEN status = \'cancelled\' THEN 1 END) as cancelled_trips'),
        db.raw('SUM(CASE WHEN status = \'completed\' THEN fare ELSE 0 END) as total_spent')
      )
      .where('user_id', userId)
      .whereRaw('EXTRACT(MONTH FROM created_at) = ?', [currentMonth])
      .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [currentYear])
      .first();

    // Get upcoming trips count
    const upcomingTrips = await db('trips')
      .count('* as count')
      .where('user_id', userId)
      .where('status', 'booked')
      .where('scheduled_time', '>', new Date())
      .first();

    // Get wallet balance
    const wallet = await db('wallets')
      .select('balance', 'monthly_allowance', 'currency')
      .where('user_id', userId)
      .first();

    res.json({
      success: true,
      data: {
        monthly_stats: {
          total_trips: parseInt(tripStats.total_trips) || 0,
          completed_trips: parseInt(tripStats.completed_trips) || 0,
          cancelled_trips: parseInt(tripStats.cancelled_trips) || 0,
          total_spent: parseFloat(tripStats.total_spent) || 0,
          upcoming_trips: parseInt(upcomingTrips.count) || 0
        },
        wallet: wallet ? {
          balance: parseFloat(wallet.balance),
          monthly_allowance: parseFloat(wallet.monthly_allowance),
          currency: wallet.currency
        } : null
      }
    });

  } catch (error) {
    logger.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics'
    });
  }
});

module.exports = router;