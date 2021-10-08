exports.up = (knex) => {
	return knex.schema.hasTable('blog').then((exists) => {
		if (!exists) {
			return knex.schema
				.createTable('blog', (table) => {
					table.increments();
					table.string('author', 100).notNullable();
					table.string('title', 100).notNullable();
					table.string('content', 1000).notNullable();
				})
		}
	});
};

exports.down = function (knex) {
	return knex.schema.dropTable('blog');
};
