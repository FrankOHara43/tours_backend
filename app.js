const express = require('express');
const morgan = require('morgan');

const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');

const app = express();

// Use Morgan for logging in development mode
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parser: Parse incoming JSON requests
app.use(express.json());

// Custom middleware to add the request time
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// Mount routers for specific routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Catch all undefined routes and pass an error to the global error handler
app.all('*', (req, res, next) => {
  // Create a new AppError and pass it to the next() function
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

module.exports = app;
