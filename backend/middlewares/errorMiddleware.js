// Jo koi aevo route khule je nathi, to aa function chalya jase
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error); // Error ne aagal errorHandler ma moklva mate
};

// Main error handler, koi pan error aave to ahiya jase
const errorHandler = (err, req, res, next) => {
  // Jo status code 200 hoy pan error aavi hoy, to ene 500 (Server Error) kari do
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    // Production ma error stack nathi batavvu (Security mate), khali development ma j batavvu
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };
