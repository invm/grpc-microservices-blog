const blogs = require('./protos/blog_pb');
const blogService = require('./protos/blog_grpc_pb');
const assert = require('assert');
const faker = require('faker');
const grpc = require('@grpc/grpc-js');
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

const callCreateBlog = () => {
	const client = new blogService.BlogServiceClient(process.env.SERVER_HOST, credentials);

	const blog = new blogs.Blog();

	blog.setAuthor(`${faker.name.firstName()} ${faker.name.lastName()}`);
	blog.setTitle(`${faker.lorem.words(5)}`);
	blog.setContent(`${faker.lorem.paragraph()}`);

	const blogRequest = new blogs.CreateBlogRequest();
	blogRequest.setBlog(blog);

	client.createBlog(blogRequest, (error, response) => {
		if (!error) {
			console.log('Received create blog response', response.toString());
		} else {
			console.log('Error creating blog', error);
		}
	});
};

const callReadBlog = () => {
	const client = new blogService.BlogServiceClient(process.env.SERVER_HOST, credentials);

	const blog_id = 480;

	const readBlogRequest = new blogs.ReadBlogRequest();
	readBlogRequest.setBlogId(`${blog_id}`);

	client.readBlog(readBlogRequest, (error, response) => {
		if (!error) {
			console.log('Received read blog response', response.toString());
		} else {
			if (error.code === grpc.status.NOT_FOUND) {
				console.log('Blog not found');
			} else {
				console.log('Error reading blog', error);
			}
		}
	});
};

const main = () => {
	establishConnection();
	// callListBlogs();
	// callCreateBlog();
	callReadBlog();
};

main();

const handle = (signal) => {
	console.log(`*^!@4=> Received event: ${signal}`);
};
process.on('SIGHUP', handle);
