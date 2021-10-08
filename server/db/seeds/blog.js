const faker = require('faker');

let data = Array(1)
	.fill('')
	.map((_) => ({
		author: `${faker.name.firstName()} ${faker.name.lastName()}`,
		title: `${faker.lorem.words(2)}`,
		content: `${faker.lorem.paragraph(1)}`
	}));

exports.seed = function (knex) {
	// Deletes ALL existing entries
	return knex('blog')
		.del()
		.then(function () {
			// Inserts seed entries
			return knex('blog').insert(data);
		});
};
