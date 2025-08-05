const express = require('express');
const db = require('../database/connection');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Get user's wallet
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const wallet = await db('wallets')
      .select('*')
      .where('user_id', userId)
      .first();

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.json({
      success: true,
      data: {
        wallet: {
          id: wallet.id,
          balance: parseFloat(wallet.balance),
          monthly_allowance: parseFloat(wallet.monthly_allowance),
          currency: wallet.currency,
          allowance_reset_date: wallet.allowance_reset_date,
          last_updated: wallet.updated_at
        }
      }
    });

  } catch (error) {
    logger.error('Get wallet error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet'
    });
  }
});

// Get wallet transactions
router.get('/transactions', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0, type } = req.query;

    let query = db('transactions')
      .select(
        'transactions.*',
        'trips.pickup_location_id',
        'trips.drop_location_id',
        'pickup_locations.name as pickup_location_name',
        'drop_locations.name as drop_location_name'
      )
      .leftJoin('trips', 'transactions.trip_id', 'trips.id')
      .leftJoin('locations as pickup_locations', 'trips.pickup_location_id', 'pickup_locations.id')
      .leftJoin('locations as drop_locations', 'trips.drop_location_id', 'drop_locations.id')
      .where('transactions.user_id', userId)
      .orderBy('transactions.created_at', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    if (type) {
      query = query.where('transactions.type', type);
    }

    const transactions = await query;

    const formattedTransactions = transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      amount: parseFloat(transaction.amount),
      description: transaction.description,
      trip_id: transaction.trip_id,
      trip_details: transaction.trip_id ? {
        pickup_location: transaction.pickup_location_name,
        drop_location: transaction.drop_location_name
      } : null,
      reference_id: transaction.reference_id,
      metadata: transaction.metadata,
      timestamp: transaction.created_at
    }));

    res.json({
      success: true,
      data: {
        transactions: formattedTransactions,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          total: transactions.length
        }
      }
    });

  } catch (error) {
    logger.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions'
    });
  }
});

// Get wallet summary/stats
router.get('/summary', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Get wallet
    const wallet = await db('wallets')
      .where('user_id', userId)
      .first();

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Get monthly spending
    const monthlySpending = await db('transactions')
      .where('user_id', userId)
      .where('type', 'deduction')
      .whereRaw('EXTRACT(MONTH FROM created_at) = ?', [currentMonth])
      .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [currentYear])
      .sum('amount as total')
      .first();

    // Get trip count this month
    const monthlyTrips = await db('trips')
      .where('user_id', userId)
      .whereRaw('EXTRACT(MONTH FROM created_at) = ?', [currentMonth])
      .whereRaw('EXTRACT(YEAR FROM created_at) = ?', [currentYear])
      .count('* as count')
      .first();

    // Calculate usage percentage
    const totalSpent = Math.abs(parseFloat(monthlySpending.total) || 0);
    const usagePercentage = (totalSpent / parseFloat(wallet.monthly_allowance)) * 100;

    res.json({
      success: true,
      data: {
        wallet: {
          balance: parseFloat(wallet.balance),
          monthly_allowance: parseFloat(wallet.monthly_allowance),
          currency: wallet.currency
        },
        monthly_stats: {
          total_spent: totalSpent,
          trips_count: parseInt(monthlyTrips.count),
          usage_percentage: Math.round(usagePercentage * 100) / 100,
          remaining_balance: parseFloat(wallet.balance)
        }
      }
    });

  } catch (error) {
    logger.error('Get wallet summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wallet summary'
    });
  }
});

module.exports = router;