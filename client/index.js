const blogs = require('./protos/blog_pb');
const blogService = require('./protos/blog_grpc_pb');
const assert = require('assert');
require('dotenv').config('./.env');
assert(process.env.SERVER_HOST, 'Error starting up, no environment variables');
const { establishConnection, credentials } = require('./connect');

const callListBlogs = () => {
	const client = new blogService.BlogServiceClient(process.env.SERVER_HOST, credentials);

	const emptyBlogRequest = new blogs.ListBlogRequest();
	const call = client.listBlog(emptyBlogRequest, () => {});

	call.on('data', (response) => {
		console.log('Client Streaming Response ', response.getBlog().toString());
	});

	call.on('error', (error) => {
		console.error(error);
	});

	call.on('end', () => {
		console.log('End');
	});
};

const main = () => {
	establishConnection();
	callListBlogs();
};

main();

const handle = (signal) => {
	console.log(`*^!@4=> Received event: ${signal}`);
};
process.on('SIGHUP', handle);

