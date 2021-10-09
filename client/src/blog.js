const blogs = require('../protos/blog_pb');
const blogService = require('../protos/blog_grpc_pb');
const faker = require('faker');
const grpc = require('@grpc/grpc-js');
const { credentials } = require('../connect');

const callListBlogs = (req, res) => {
	const client = new blogService.BlogServiceClient(process.env.SERVER_HOST, credentials);

	const emptyBlogRequest = new blogs.ListBlogRequest();
	const call = client.listBlog(emptyBlogRequest, () => {});

	let data = {};
	let status = 200;
	let error = null;
	let success = true;

	let _blogs = [];
	call.on('data', (response) => {
		console.log('Client Streaming Response ', response.getBlog().toString());
		_blogs.push(response.array[0]);
	});

	call.on('error', (error) => {
		success = false;
		error = 'Error retrieving all blogs';
		status = 400;
		console.error(error);

		res.status(status).json({ success, data, error });
	});

	call.on('end', () => {
		data = { blogs: _blogs };
		console.log('End');
		res.status(status).json({ success, data, error });
	});
};

const callCreateBlog = (req, res) => {
	const client = new blogService.BlogServiceClient(process.env.SERVER_HOST, credentials);

	const blog = new blogs.Blog();

	const { author, title, content } = req.body;

	blog.setAuthor(author);
	blog.setTitle(title);
	blog.setContent(content);

	const blogRequest = new blogs.CreateBlogRequest();
	blogRequest.setBlog(blog);

	client.createBlog(blogRequest, (_error, response) => {
		let data = {};
		let status = 200;
		let error = null;
		let success = true;
		if (!_error) {
			console.log('Received create blog response', response.toString());
			data = {
				id: response.array[0][0],
				author: response.array[0][1],
				title: response.array[0][2],
				content: response.array[0][3]
			};
		} else {
			success = false;
			error = 'Blog not created';
			status = 400;
			console.log('Error creating blog', _error);
		}
		res.status(status).json({ success, data, error });
	});
};

const callReadBlog = (req, res) => {
	const client = new blogService.BlogServiceClient(process.env.SERVER_HOST, credentials);

	const blog_id = req.params.id;

	const readBlogRequest = new blogs.ReadBlogRequest();
	readBlogRequest.setBlogId(`${blog_id}`);

	client.readBlog(readBlogRequest, (_error, response) => {
		let data = {};
		let status = 200;
		let error = null;
		let success = true;
		if (!_error) {
			console.log('Received read blog response', response.toString());
			data = {
				id: response.array[0][0],
				author: response.array[0][1],
				title: response.array[0][2],
				content: response.array[0][3]
			};
		} else {
			status = 400;
			success = false;
			if (_error.code === grpc.status.NOT_FOUND) {
				error = 'Blog not found';
			} else {
				error = 'Error reading blog' + _error?.message ? _error.message : '';
			}
		}
		res.status(status).json({ success, data, error });
	});
};

const callUpdateBlog = (req, res) => {
	const client = new blogService.BlogServiceClient(process.env.SERVER_HOST, credentials);

	const { id } = req.params;
	const { author, title, content } = req.body;

	const updateBlogRequest = new blogs.UpdateBlogRequest();
	updateBlogRequest.setBlogId(id);
	updateBlogRequest.setAuthor(author);
	updateBlogRequest.setTitle(title);
	updateBlogRequest.setContent(content);

	client.updateBlog(updateBlogRequest, (_error, response) => {
		let data = {};
		let status = 200;
		let error = null;
		let success = true;
		if (!_error) {
			console.log('Received update blog response', response.toString());
			data = {
				id: response.array[0][0],
				author: response.array[0][1],
				title: response.array[0][2],
				content: response.array[0][3]
			};
		} else {
			status = 400;
			success = false;
			if (_error.code === grpc.status.NOT_FOUND) {
				error = 'Blog not found';
			} else {
				error = 'Error updating blog' + _error?.message ? _error.message : '';
			}
		}
		res.status(status).json({ success, data, error });
	});
};

const callDeleteBlog = (req, res) => {
	const client = new blogService.BlogServiceClient(process.env.SERVER_HOST, credentials);

	const { id } = req.params;

	const deleteBlogRequest = new blogs.DeleteBlogRequest();
	deleteBlogRequest.setBlogId(`${id}`);

	client.deleteBlog(deleteBlogRequest, (_error, response) => {
		let data = {};
		let status = 200;
		let error = null;
		let success = true;
		if (!_error) {
			console.log('Received delete blog response', response);
			data = {
				id: response.array[0]
			};
		} else {
			status = 400;
			success = false;
			if (_error.code === grpc.status.NOT_FOUND) {
				error = 'Blog not found';
			} else {
				error = 'Error deleting blog' + _error?.message ? _error.message : '';
			}
		}
		res.status(status).json({ success, data, error });
	});
};

module.exports = {
	callCreateBlog,
	callDeleteBlog,
	callListBlogs,
	callReadBlog,
	callUpdateBlog
};
