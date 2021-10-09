const blogService = require('./protos/blog_grpc_pb');
const grpc = require('@grpc/grpc-js');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config('./.env');
assert(process.env.SERVER_HOST, 'Error starting up, no environment variables');
const { createBlog, listBlog, readBlog, updateBlog, deleteBlog } = require('./src/blog');
const { handleSignal } = require('./utils');

// terminate on kill and other signals
process.on('SIGHUP', handleSignal);

let credentials = grpc.ServerCredentials.createSsl(
	fs.readFileSync('../certs/ca.crt'),
	[
		{
			cert_chain: fs.readFileSync('../certs/server.crt'),
			private_key: fs.readFileSync('../certs/server.key')
		}
	],
	true
);

const main = () => {
	try {
		const server = new grpc.Server();

		server.addService(blogService.BlogServiceService, {
			listBlog: listBlog,
			createBlog: createBlog,
			readBlog: readBlog,
			updateBlog: updateBlog,
			deleteBlog: deleteBlog
		});

		server.bindAsync(process.env.SERVER_HOST, credentials, (error, port) => {
			if (error) {
				console.error(error);
				process.exit(1);
			}

			server.start();
		});

		console.log(`Server running on ${process.env.SERVER_HOST}`);
	} catch (error) {
		console.error(error);
		process.exit(1);
	}
};

main();
