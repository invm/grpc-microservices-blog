const assert = require('assert');
require('dotenv').config('./.env');
assert(process.env.SERVER_HOST, 'Error starting up, no environment variables');
const { establishConnection } = require('./connect');
const { callCreateBlog, callDeleteBlog, callListBlogs, callReadBlog, callUpdateBlog } = require('./src/blog');

const main = () => {
	establishConnection();
	// callListBlogs();
	// callCreateBlog();
	// callReadBlog();
	// callUpdateBlog();
	// callDeleteBlog();
};

main();

const handle = (signal) => {
	console.log(`*^!@4=> Received event: ${signal}`);
};
process.on('SIGHUP', handle);
