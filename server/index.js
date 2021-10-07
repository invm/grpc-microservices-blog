const blogs = require('./protos/blog_pb');
const blogService = require('./protos/blog_grpc_pb');
const grpc = require('grpc');
const assert = require('assert');
const fs = require('fs');
require('dotenv').config('./.env');
assert(process.env.HOST, 'Error starting up, no environment variables');

//Knex requires
const config = require('./knexfile')[process.env.NODE_ENV];
const knex = require('knex')(config);

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

const listBlog = (call, callback) => {
	console.log('Received list blog request');
	knex('blogs').then((data) => {
		data.forEach((element) => {
			const blog = new blogs.Blog();
			blog.setId(element.id);
			blog.setAuthor(element.author);
			blog.setTitle(element.title);
			blog.setContent(element.content);

			console.log('Blogs ', blog.toString());

			const blogResponse = new blogs.ListBlogResponse();
			blogResponse.setBlog(blog);

			//write to the stream
			call.write(blogResponse);
		});
		call.end(); // we are done writing!!
	});
};

const main = () => {
	try {
		const server = new grpc.Server();

		server.addService(blogService.BlogServiceService, {
			listBlog: listBlog
		});

		server.bind(process.env.HOST, credentials);
		server.start();

		console.log(`Server running on ${process.env.HOST}`);
	} catch (err) {
		console.error(err);
		process.exit(1);
	}
};

main();
