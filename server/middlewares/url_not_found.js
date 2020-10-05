'use strict';

module.exports = () => {
  return function raiseUrlNotFoundError(req, res) {
    const notFound = {
      error: {
        statusCode: 404,
        message: `Cannot found '${req.url}' on this server`,
        code: 'NOT_FOUND',
      },
    };
    return res.status(404).json(notFound);
  };
};
