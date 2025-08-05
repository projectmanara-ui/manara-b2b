const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');
const logger = require('../utils/logger');

const router = express.Router();

// Get user's trips
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { status, type, limit = 20, offset = 0 } = req.query;
    
    let query = db('trips')
      .select(
        'trips.*',
        'pickup_locations.name as pickup_location_name',
        'pickup_locations.address as pickup_location_address',
        'pickup_locations.latitude as pickup_latitude',
        'pickup_locations.longitude as pickup_longitude',
        'drop_locations.name as drop_location_name',
        'drop_locations.address as drop_location_address',
        'drop_locations.latitude as drop_latitude',
        'drop_locations.longitude as drop_longitude'
      )
      .leftJoin('locations as pickup_locations', 'trips.pickup_location_id', 'pickup_locations.id')
      .leftJoin('locations as drop_locations', 'trips.drop_location_id', 'drop_locations.id')
      .where('trips.user_id', req.user.id)
      .orderBy('trips.scheduled_time', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    if (status) {
      query = query.where('trips.status', status);
    }

    if (type) {
      query = query.where('trips.type', type);
    }

    const trips = await query;

    // Format trips for response
    const formattedTrips = trips.map(trip => ({
      id: trip.id,
      type: trip.type,
      status: trip.status,
      pickup_location: {
        id: trip.pickup_location_id,
        name: trip.pickup_location_name,
        address: trip.pickup_location_address,
        coordinates: {
          latitude: parseFloat(trip.pickup_latitude),
          longitude: parseFloat(trip.pickup_longitude)
        }
      },
      drop_location: {
        id: trip.drop_location_id,
        name: trip.drop_location_name,
        address: trip.drop_location_address,
        coordinates: {
          latitude: parseFloat(trip.drop_latitude),
          longitude: parseFloat(trip.drop_longitude)
        }
      },
      scheduled_time: trip.scheduled_time,
      actual_pickup_time: trip.actual_pickup_time,
      actual_drop_time: trip.actual_drop_time,
      fare: parseFloat(trip.fare),
      estimated_duration: trip.estimated_duration,
      notes: trip.notes,
      payment_status: trip.payment_status,
      created_at: trip.created_at,
      updated_at: trip.updated_at
    }));

    res.json({
      success: true,
      data: {
        trips: formattedTrips,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: trips.length
        }
      }
    });

  } catch (error) {
    logger.error('Get trips error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trips'
    });
  }
});

// Book a new trip
router.post('/', authenticateToken, validate(schemas.bookTrip), async (req, res) => {
  try {
    const { pickup_location_id, drop_location_id, scheduled_time, trip_type, notes } = req.body;
    const userId = req.user.id;

    // Validate locations exist
    const pickupLocation = await db('locations').where('id', pickup_location_id).first();
    const dropLocation = await db('locations').where('id', drop_location_id).first();

    if (!pickupLocation || !dropLocation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pickup or drop location'
      });
    }

    // Check if scheduled time is in the future
    const scheduledDate = new Date(scheduled_time);
    if (scheduledDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Scheduled time must be in the future'
      });
    }

    // Check if user has sufficient balance
    const wallet = await db('wallets').where('user_id', userId).first();
    if (!wallet) {
      return res.status(400).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Calculate fare (simplified - in real app, this would be more complex)
    const baseFare = 200; // KES
    const fare = baseFare;

    if (wallet.balance < fare) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance for this trip'
      });
    }

    // Create trip and deduct from wallet
    const tripId = uuidv4();
    
    await db.transaction(async (trx) => {
      // Create trip
      await trx('trips').insert({
        id: tripId,
        user_id: userId,
        type: trip_type,
        pickup_location_id,
        drop_location_id,
        scheduled_time: scheduledDate,
        fare,
        notes,
        estimated_duration: 30 // Default 30 minutes
      });

      // Deduct from wallet
      await trx('wallets')
        .where('user_id', userId)
        .decrement('balance', fare);

      // Create transaction record
      await trx('transactions').insert({
        user_id: userId,
        wallet_id: wallet.id,
        type: 'deduction',
        amount: -fare,
        description: `Trip booking - ${pickupLocation.name} to ${dropLocation.name}`,
        trip_id: tripId
      });
    });

    // Get the created trip with location details
    const createdTrip = await db('trips')
      .select(
        'trips.*',
        'pickup_locations.name as pickup_location_name',
        'pickup_locations.address as pickup_location_address',
        'drop_locations.name as drop_location_name',
        'drop_locations.address as drop_location_address'
      )
      .leftJoin('locations as pickup_locations', 'trips.pickup_location_id', 'pickup_locations.id')
      .leftJoin('locations as drop_locations', 'trips.drop_location_id', 'drop_locations.id')
      .where('trips.id', tripId)
      .first();

    logger.info(`Trip booked: ${tripId} by user ${userId}`);

    res.status(201).json({
      success: true,
      message: 'Trip booked successfully',
      data: { trip: createdTrip }
    });

  } catch (error) {
    logger.error('Book trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to book trip'
    });
  }
});

// Get specific trip
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const tripId = req.params.id;

    const trip = await db('trips')
      .select(
        'trips.*',
        'pickup_locations.name as pickup_location_name',
        'pickup_locations.address as pickup_location_address',
        'pickup_locations.latitude as pickup_latitude',
        'pickup_locations.longitude as pickup_longitude',
        'drop_locations.name as drop_location_name',
        'drop_locations.address as drop_location_address',
        'drop_locations.latitude as drop_latitude',
        'drop_locations.longitude as drop_longitude'
      )
      .leftJoin('locations as pickup_locations', 'trips.pickup_location_id', 'pickup_locations.id')
      .leftJoin('locations as drop_locations', 'trips.drop_location_id', 'drop_locations.id')
      .where('trips.id', tripId)
      .where('trips.user_id', req.user.id)
      .first();

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    const formattedTrip = {
      id: trip.id,
      type: trip.type,
      status: trip.status,
      pickup_location: {
        id: trip.pickup_location_id,
        name: trip.pickup_location_name,
        address: trip.pickup_location_address,
        coordinates: {
          latitude: parseFloat(trip.pickup_latitude),
          longitude: parseFloat(trip.pickup_longitude)
        }
      },
      drop_location: {
        id: trip.drop_location_id,
        name: trip.drop_location_name,
        address: trip.drop_location_address,
        coordinates: {
          latitude: parseFloat(trip.drop_latitude),
          longitude: parseFloat(trip.drop_longitude)
        }
      },
      scheduled_time: trip.scheduled_time,
      actual_pickup_time: trip.actual_pickup_time,
      actual_drop_time: trip.actual_drop_time,
      fare: parseFloat(trip.fare),
      estimated_duration: trip.estimated_duration,
      notes: trip.notes,
      tracking_data: trip.tracking_data,
      payment_status: trip.payment_status,
      created_at: trip.created_at,
      updated_at: trip.updated_at
    };

    res.json({
      success: true,
      data: { trip: formattedTrip }
    });

  } catch (error) {
    logger.error('Get trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch trip'
    });
  }
});

// Cancel trip
router.patch('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const tripId = req.params.id;
    const userId = req.user.id;

    const trip = await db('trips')
      .where('id', tripId)
      .where('user_id', userId)
      .first();

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }

    if (trip.status !== 'booked') {
      return res.status(400).json({
        success: false,
        message: 'Only booked trips can be cancelled'
      });
    }

    // Check if cancellation is allowed (e.g., at least 1 hour before scheduled time)
    const scheduledTime = new Date(trip.scheduled_time);
    const now = new Date();
    const timeDiff = scheduledTime.getTime() - now.getTime();
    const hoursDiff = timeDiff / (1000 * 3600);

    if (hoursDiff < 1) {
      return res.status(400).json({
        success: false,
        message: 'Trip cannot be cancelled less than 1 hour before scheduled time'
      });
    }

    await db.transaction(async (trx) => {
      // Update trip status
      await trx('trips')
        .where('id', tripId)
        .update({ 
          status: 'cancelled',
          updated_at: new Date()
        });

      // Refund to wallet
      const wallet = await trx('wallets').where('user_id', userId).first();
      await trx('wallets')
        .where('user_id', userId)
        .increment('balance', trip.fare);

      // Create refund transaction
      await trx('transactions').insert({
        user_id: userId,
        wallet_id: wallet.id,
        type: 'refund',
        amount: trip.fare,
        description: `Trip cancellation refund - Trip ${tripId}`,
        trip_id: tripId
      });
    });

    logger.info(`Trip cancelled: ${tripId} by user ${userId}`);

    res.json({
      success: true,
      message: 'Trip cancelled successfully'
    });

  } catch (error) {
    logger.error('Cancel trip error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel trip'
    });
  }
});

module.exports = router;