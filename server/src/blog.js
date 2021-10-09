const establishConnection = require('../db');
const { dbError } = require('../utils/index');
const db = establishConnection();
const grpc = require('@grpc/grpc-js');
const blogs = require('../protos/blog_pb');

/*
   Blog CRUD 
*/

const listBlog = (call) => {
	console.log('Received list blog call');

	db('blog')
		.then((data) => {
			data.forEach((element) => {
				const blog = new blogs.Blog();
				blog.setId(`${element.id}`);
				blog.setAuthor(element.author);
				blog.setTitle(element.title);
				blog.setContent(element.content);

				const blogResponse = new blogs.ListBlogResponse();
				blogResponse.setBlog(blog);

				// streaming back all data one entry at a time
				call.write(blogResponse);
			});
			call.end();
		})
		.catch(dbError);
};

const createBlog = (call, callback) => {
	console.log('Received create blog call');

	const blog = call.request.getBlog();

	db('blog')
		.insert({
			author: blog.getAuthor(),
			title: blog.getTitle(),
			content: blog.getContent()
		})
		.returning(['id', 'author', 'title', 'content'])
		.then(([{ id, author, title, content }]) => {
			const addedBlog = new blogs.Blog();

			addedBlog.setId(`${id}`);
			addedBlog.setAuthor(author);
			addedBlog.setTitle(title);
			addedBlog.setContent(content);

			const blogResponse = new blogs.CreateBlogResponse();

			blogResponse.setBlog(addedBlog);

			callback(null, blogResponse);
		})
		.catch(dbError);
};

const readBlog = (call, callback) => {
	console.log('Received read blog call');
	const blog_id = call.request.getBlogId();

	db('blog')
		.where({ id: +blog_id })
		.then((data) => {
			if (data.length) {
				const { id, author, title, content } = data[0];
				const blog = new blogs.Blog();

				blog.setId(`${id}`);
				blog.setAuthor(author);
				blog.setTitle(title);
				blog.setContent(content);

				const readBlogResponse = new blogs.ReadBlogResponse();

				readBlogResponse.setBlog(blog);

				callback(null, readBlogResponse);
			} else {
				return callback({
					code: grpc.status.NOT_FOUND,
					message: 'Blog not found'
				});
			}
		})
		.catch(dbError);
};

module.exports = {
	createBlog,
	listBlog,
  readBlog
};
