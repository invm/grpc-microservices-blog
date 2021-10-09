const blogs = require('./protos/blog_pb');
const blogService = require('./protos/blog_grpc_pb');
const grpc = require('@grpc/grpc-js');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config('./.env');
assert(process.env.SERVER_HOST, 'Error starting up, no environment variables');
const establishConnection = require('./db');
const db = establishConnection();

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

/*
   Blog CRUD 
*/

const dbError = (error) => {
	console.log('DB Error', error);
};

const handle = (signal) => {
	console.log(`*^!@4=> Received event: ${signal}`);
};

process.on('SIGHUP', handle);

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

const main = () => {
	try {
		const server = new grpc.Server();

		server.addService(blogService.BlogServiceService, {
			listBlog: listBlog,
			createBlog: createBlog
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
