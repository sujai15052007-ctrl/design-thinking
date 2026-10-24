export function notFound(req, res) {
  res.status(404).json({ error: 'Endpoint not found' });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }
  console.error(error);
  const status = Number(error.statusCode || error.status) || 500;
  const message = status >= 500 ? 'Internal server error' : error.message;
  return res.status(status).json({ error: message });
}
