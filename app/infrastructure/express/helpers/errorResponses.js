module.exports = {
  unauthorized: (res, { message = 'Unauthorized', ...meta }) =>
    res.status(401).json({
      ...meta,
      message,
      statusCode: 401,
      error: 'Unauthorized',
    }),
  badImplementation: (res, { message = 'Internal Server Error', ...meta }) =>
    res.status(500).json({
      ...meta,
      message,
      statusCode: 500,
      error: 'Internal Server Error',
    }),
};
