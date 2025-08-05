const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const db = require('../database/connection');
const { validate, schemas } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// Register new user
router.post('/register', validate(schemas.register), async (req, res) => {
  try {
    const { name, email, password, phone, organization_id, employee_id, emergency_contact } = req.body;

    // Check if user already exists
    const existingUser = await db('users').where('email', email).first();
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Check if organization exists
    const organization = await db('organizations').where('id', organization_id).first();
    if (!organization) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organization'
      });
    }

    // Check if employee ID is unique within organization
    const existingEmployee = await db('users')
      .where('organization_id', organization_id)
      .where('employee_id', employee_id)
      .first();
    
    if (existingEmployee) {
      return res.status(400).json({
        success: false,
        message: 'Employee ID already exists in this organization'
      });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create user
    const userId = uuidv4();
    const verificationToken = uuidv4();

    await db.transaction(async (trx) => {
      // Insert user
      await trx('users').insert({
        id: userId,
        name,
        email,
        password_hash,
        phone,
        organization_id,
        employee_id,
        emergency_contact: JSON.stringify(emergency_contact),
        verification_token
      });

      // Create wallet for user
      await trx('wallets').insert({
        user_id: userId,
        monthly_allowance: organization.monthly_allowance,
        balance: organization.monthly_allowance,
        currency: organization.currency,
        allowance_reset_date: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
      });

      // Create initial allowance transaction
      const walletId = await trx('wallets').where('user_id', userId).first().then(w => w.id);
      await trx('transactions').insert({
        user_id: userId,
        wallet_id: walletId,
        type: 'allowance',
        amount: organization.monthly_allowance,
        description: `Monthly Transport Allowance - ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
      });
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId, email, organizationId: organization_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: userId,
          name,
          email,
          phone,
          organization: organization.name,
          employee_id
        },
        token
      }
    });

  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Login user
router.post('/login', validate(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user with organization details
    const user = await db('users')
      .select(
        'users.*',
        'organizations.name as organization_name',
        'organizations.currency'
      )
      .leftJoin('organizations', 'users.organization_id', 'organizations.id')
      .where('users.email', email)
      .first();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated. Please contact your administrator.'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update last login
    await db('users').where('id', user.id).update({ last_login: new Date() });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, organizationId: user.organization_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          organization_id: user.organization_id,
          organization_name: user.organization_name,
          employee_id: user.employee_id,
          role: user.role,
          emergency_contact: user.emergency_contact,
          shift_preferences: user.shift_preferences
        },
        token
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Refresh token
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = req.user;

    // Generate new token
    const token = jwt.sign(
      { userId: user.id, email: user.email, organizationId: user.organization_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    res.json({
      success: true,
      message: 'Token refreshed successfully',
      data: { token }
    });

  } catch (error) {
    logger.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      message: 'Token refresh failed'
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await db('users')
      .select(
        'users.id',
        'users.name',
        'users.email',
        'users.phone',
        'users.organization_id',
        'users.employee_id',
        'users.role',
        'users.profile_image_url',
        'users.emergency_contact',
        'users.shift_preferences',
        'users.email_verified',
        'users.last_login',
        'organizations.name as organization_name',
        'organizations.currency'
      )
      .leftJoin('organizations', 'users.organization_id', 'organizations.id')
      .where('users.id', req.user.id)
      .first();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: { user }
    });

  } catch (error) {
    logger.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile'
    });
  }
});

// Logout (optional - mainly for logging purposes)
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    logger.info(`User logged out: ${req.user.email}`);
    
    res.json({
      success: true,
      message: 'Logged out successfully'
    });

  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

module.exports = router;