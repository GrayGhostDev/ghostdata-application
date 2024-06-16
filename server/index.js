const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const LoanDiskApi = require('./src/api/LoanDiskApi');
const transactionRoutes = require('./src/routes/transactionRoutes');
const logger = require('./src/utils/logger');

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
const corsOptions = {
  origin: '*', // Allow requests from any origin (adjust for production)
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization',
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Handle URL-encoded data as well

// Logger middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.use('/api', LoanDiskApi);
app.use('/api/transactions', transactionRoutes);

// Error handling middleware (more specific)
app.use((err, req, res, next) => {
  logger.error(err.stack); // Log the error for debugging
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
    },
  });
});

// Handler 404 (catch-all for undefined routes)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
