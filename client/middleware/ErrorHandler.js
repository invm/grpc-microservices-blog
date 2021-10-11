const grpc = require('@grpc/grpc-js');
const ErrorResponse = require('../utils/ErrorResponse');

const ErrorHandler = (err, req, res, next) => {
	console.log(err.stack);
	const error = { ...err };

	if (err.code === grpc.status.NOT_FOUND) {
		error = new ErrorResponse('Resource not found', 404);
	}

	res.status(error.statusCode || 500).json({ success: false, error: error.message || 'Unexpected error ocurred' });
};

module.exports = ErrorHandler;
