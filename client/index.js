const blogs = require('./protos/blog_pb');
const blogService = require('./protos/blog_grpc_pb');
const grpc = require('grpc');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config('./.env');
assert(process.env.HOST, 'Error starting up, no environment variables');

let credentials = grpc.credentials.createSsl(
	fs.readFileSync('../certs/ca.crt'),
	fs.readFileSync('../certs/client.key'),
	fs.readFileSync('../certs/client.crt')
);

const callListBlogs = () => {
	const client = new blogService.BlogServiceClient(process.env.HOST, credentials);

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
	callListBlogs();
};

main();
