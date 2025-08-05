const jwt = require('jsonwebtoken');
const db = require('../database/connection');
const logger = require('../utils/logger');

const socketHandler = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await db('users')
        .select('id', 'email', 'name', 'organization_id')
        .where('id', decoded.userId)
        .first();

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user.id;
      socket.organizationId = user.organization_id;
      socket.userEmail = user.email;
      
      next();
    } catch (error) {
      logger.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    logger.info(`User connected: ${socket.userEmail} (${socket.userId})`);

    // Join user to their personal room
    socket.join(`user_${socket.userId}`);
    
    // Join user to their organization room
    socket.join(`org_${socket.organizationId}`);

    // Handle trip tracking subscription
    socket.on('subscribe_trip_tracking', (tripId) => {
      // Verify user owns this trip
      db('trips')
        .where('id', tripId)
        .where('user_id', socket.userId)
        .first()
        .then(trip => {
          if (trip) {
            socket.join(`trip_${tripId}`);
            logger.info(`User ${socket.userId} subscribed to trip tracking: ${tripId}`);
          }
        })
        .catch(error => {
          logger.error('Trip subscription error:', error);
        });
    });

    // Handle location updates (for active trips)
    socket.on('location_update', async (data) => {
      try {
        const { tripId, latitude, longitude, timestamp } = data;
        
        // Verify user has an active trip
        const trip = await db('trips')
          .where('id', tripId)
          .where('user_id', socket.userId)
          .where('status', 'in_transit')
          .first();

        if (trip) {
          // Update trip tracking data
          const trackingData = trip.tracking_data || {};
          trackingData.locations = trackingData.locations || [];
          trackingData.locations.push({
            latitude,
            longitude,
            timestamp
          });

          await db('trips')
            .where('id', tripId)
            .update({
              tracking_data: JSON.stringify(trackingData),
              updated_at: new Date()
            });

          // Broadcast location update to trip room
          socket.to(`trip_${tripId}`).emit('trip_location_update', {
            tripId,
            latitude,
            longitude,
            timestamp
          });
        }
      } catch (error) {
        logger.error('Location update error:', error);
      }
    });

    // Handle emergency alerts
    socket.on('emergency_alert', async (data) => {
      try {
        const { latitude, longitude, message, type } = data;
        
        // Create emergency alert in database
        const alertId = require('uuid').v4();
        await db('emergency_alerts').insert({
          id: alertId,
          user_id: socket.userId,
          type: type || 'other',
          latitude,
          longitude,
          message: message || 'Emergency alert from mobile app'
        });

        // Get user details
        const user = await db('users')
          .select('name', 'phone', 'email')
          .where('id', socket.userId)
          .first();

        // Broadcast emergency alert to organization admins
        socket.to(`org_${socket.organizationId}`).emit('emergency_alert_received', {
          alertId,
          user: {
            id: socket.userId,
            name: user.name,
            email: user.email,
            phone: user.phone
          },
          location: { latitude, longitude },
          message,
          type,
          timestamp: new Date()
        });

        // Confirm alert sent to user
        socket.emit('emergency_alert_sent', {
          alertId,
          message: 'Emergency alert sent successfully'
        });

        logger.error(`EMERGENCY ALERT via Socket: ${type} from ${user.name} at ${latitude}, ${longitude}`);

      } catch (error) {
        logger.error('Emergency alert socket error:', error);
        socket.emit('emergency_alert_error', {
          message: 'Failed to send emergency alert'
        });
      }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.userEmail} (${socket.userId})`);
    });
  });

  // Helper function to send notification to user
  const sendNotificationToUser = (userId, notification) => {
    io.to(`user_${userId}`).emit('notification', notification);
  };

  // Helper function to send trip update
  const sendTripUpdate = (tripId, update) => {
    io.to(`trip_${tripId}`).emit('trip_update', update);
  };

  // Export helper functions for use in other parts of the application
  return {
    sendNotificationToUser,
    sendTripUpdate
  };
};

module.exports = socketHandler;