const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Ensure the correct path to db.js

const Transaction = sequelize.define('Transaction', {
  transactionId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  transactionDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'transactions',
  timestamps: false,
});

module.exports = Transaction;