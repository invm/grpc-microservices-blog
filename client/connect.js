const grpc = require('@grpc/grpc-js');
const fs = require('fs');
const blogService = require('./protos/blog_grpc_pb');
const credentials = grpc.credentials.createSsl(
	fs.readFileSync('../certs/ca.crt'),
	fs.readFileSync('../certs/client.key'),
	fs.readFileSync('../certs/client.crt')
);

const establishConnection = (tries = 5) => {
	if (tries > 0)
		try {
			new blogService.BlogServiceClient(process.env.SERVER_HOST, credentials);
			console.log('Client connected to server');
		} catch (error) {
			console.log('Client could not connect to server, retrying in 3 seconds,', error);
			setTimeout(() => {
				establishConnection(tries - 1);
			}, 3000);
		}
	else {
		console.log('Client could not connect to server for 5 attempts, shutting down');
		process.exit(0);
	}
};

module.exports = { establishConnection, credentials };
