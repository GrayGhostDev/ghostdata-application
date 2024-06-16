// src/config/db.js
const { Sequelize, DataTypes } = require('sequelize');
const dotenv = require('dotenv');
const logger = require("../utils/logger");

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,        // Database name (from .env)
  process.env.DB_USER,        // Database user
  process.env.DB_PASSWORD,    // Database password
  {
    host: process.env.DB_HOST, // Database host
    dialect: process.env.DB_DIALECT, // Database dialect (e.g., 'postgres')
    logging: process.env.NODE_ENV === 'development' ? (msg) => logger.info(msg) : false, // Log only in development
    pool: {
      max: 5,         // Maximum number of connections in pool
      min: 0,         // Minimum number of connections in pool
      acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
      idle: 10000     // The maximum time, in milliseconds, that a connection can be idle before being released
    },
  }
);

// Define the User model
const User = sequelize.define('User', {
  userId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // ... other attributes you might need (e.g., firstName, lastName, etc.)
});

// Define the Transaction model
const Transaction = sequelize.define('Transaction', {
  transactionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2), // Adjust precision and scale as needed
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'userId'
    },
    allowNull: false,
  },
  // ... other attributes you might need (e.g., transactionType, description, etc.)
});

// Define the Loan model
const Loan = sequelize.define('Loan', {
  loanId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2), // Adjust precision and scale as needed
    allowNull: false,
  },
  interestRate: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'userId'
    },
    allowNull: false,
  },
  // ... other attributes you might need (e.g., loanType, status, etc.)
});

// Associations
User.hasMany(Transaction, { foreignKey: 'userId' });
Transaction.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Loan, { foreignKey: 'userId' });
Loan.belongsTo(User, { foreignKey: 'userId' });

// Test the connection and sync the model with the database
(async () => {
  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
    await User.sync(); // Sync the User model
    logger.info('User table synced.');
    await Transaction.sync(); // Sync the Transaction model
    logger.info('Transaction table synced.');
    await Loan.sync(); // Sync the Loan model
    logger.info('Loan table synced.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
})();

module.exports = { sequelize, User, Transaction, Loan };
