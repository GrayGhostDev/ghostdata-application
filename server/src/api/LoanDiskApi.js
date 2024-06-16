const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const logger = require('../utils/logger');

const router = express.Router();

// Rate limiting middleware
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

router.use(apiLimiter);

// Middleware to handle authentication
router.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Basic ${process.env.LOANDISK_AUTH_CODE}`) {
    logger.error('Unauthorized access attempt');
    res.status(403).json({ error: 'Unauthorized' });
  } else {
    next();
  }
});

// Middleware to handle validation
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    res.status(400).json({ errors: errors.array() });
  };
};

// Example endpoint to get borrower details
router.get('/borrower/:id',
  validate([
    check('id').isInt().withMessage('Borrower ID must be an integer')
  ]),
  async (req, res) => {
    try {
      const response = await axios.get(`https://api.loandisk.com/borrower/${req.params.id}`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.LOANDISK_PUBLIC_KEY}:${process.env.LOANDISK_BRANCH_ID}`).toString('base64')}`
        }
      });
      res.json(response.data);
    } catch (error) {
      logger.error(`Error fetching borrower details: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
);

// Endpoint to get saving transactions
router.get('/savings/:borrowerId',
  validate([
    check('borrowerId').isInt().withMessage('Borrower ID must be an integer')
  ]),
  async (req, res) => {
    try {
      const response = await axios.get(`https://api.loandisk.com/savings/${req.params.borrowerId}`, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.LOANDISK_PUBLIC_KEY}:${process.env.LOANDISK_BRANCH_ID}`).toString('base64')}`
        }
      });
      res.json(response.data);
    } catch (error) {
      logger.error(`Error fetching savings transactions: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
);

// Endpoint to create a new savings transaction
router.post('/savings',
  validate([
    check('accountId').isString().withMessage('Account ID must be a string'),
    check('amount').isNumeric().withMessage('Amount must be a number')
  ]),
  async (req, res) => {
    const { accountId, amount } = req.body;
    try {
      const response = await axios.post('https://api.loandisk.com/savings', {
        accountId,
        amount
      }, {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${process.env.LOANDISK_PUBLIC_KEY}:${process.env.LOANDISK_BRANCH_ID}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });
      res.json(response.data);
    } catch (error) {
      logger.error(`Error creating savings transaction: ${error.message}`);
      res.status(500).json({ error: error.message });
    }
  }
);

module.exports = router;
