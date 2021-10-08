const path = require('path');
require('dotenv').config('./.env');
const { DB_CLIENT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

module.exports = {
	development: {
		client: DB_CLIENT,
		connection: {
			host: DB_HOST,
			user: DB_USERNAME,
			password: DB_PASSWORD,
			port: DB_PORT,
			database: DB_NAME
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			tableName: 'migrations',
			directory: path.join(__dirname, 'db', 'migrations')
		},
		seeds: {
			directory: path.join(__dirname, 'db', 'seeds')
		}
	}
};
