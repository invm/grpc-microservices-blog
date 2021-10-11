require('dotenv').config('./.env');
const assert = require('assert');
const spdy = require('spdy');
const express = require('express');
const fs = require('fs');
const app = express();
const { establishConnection } = require('./connect');
const { callCreateBlog, callDeleteBlog, callListBlogs, callReadBlog, callUpdateBlog } = require('./src/blog');
const ErrorHandler = require('./middleware/ErrorHandler');
const AsyncHandler = require('./middleware/AsyncHanlder');

assert(process.env.SERVER_HOST, 'Error starting up, no environment variables');

app.use(express.json());

app.get(
	'/',
	AsyncHandler(async (req, res) => {
		callListBlogs(req, res);
	})
);

app.get(
	'/blog/:id',
	AsyncHandler(async (req, res) => {
		callReadBlog(req, res);
	})
);

app.post(
	'/blog/',
	AsyncHandler(async (req, res) => {
		callCreateBlog(req, res);
	})
);

app.patch(
	'/blog/:id',
	AsyncHandler(async (req, res) => {
		callUpdateBlog(req, res);
	})
);

app.delete(
	'/blog/:id',
	AsyncHandler(async (req, res) => {
		callDeleteBlog(req, res);
	})
);

app.use((_, res) => {
	res.status(404).send();
});

app.use(ErrorHandler);

spdy.createServer(
	{
		key: fs.readFileSync('./public.key'),
		cert: fs.readFileSync('./public.crt')
	},
	app
).listen(8000, (err) => {
	if (err) {
		throw new Error(err);
	}
	establishConnection();
	console.log('Listening on port 8000');
});

const handle = (signal) => {
	console.log(`*^!@4=> Received event: ${signal}`);
};
process.on('SIGHUP', handle);
