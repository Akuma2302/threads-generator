// Central error handler. Every controller forwards errors here via next(err)
// so the API always returns a consistent JSON shape instead of leaking stack
// traces or crashing the process.

function notFound(req, res, next) {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.error('[error]', err.message);

  const status = err.status || 500;
  const message =
    status === 500 ? 'Something went wrong generating your content. Please try again.' : err.message;

  res.status(status).json({
    success: false,
    error: message,
  });
}

module.exports = { notFound, errorHandler };
