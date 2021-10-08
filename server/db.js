const { DB_CLIENT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_NAME } = process.env;

const db = require('knex')({
	client: DB_CLIENT,
	connection: {
		host: DB_HOST,
		port: DB_PORT,
		user: DB_USERNAME,
		password: DB_PASSWORD,
		database: DB_NAME
	},
	useNullAsDefault: true
});

const establishConnection = (tries = 5) => {
	if (tries > 0) {
		db.raw('SELECT 1')
			.then(() => {
				console.log(`DB ${DB_CLIENT} connected`);
			})
			.catch((e) => {
				console.log(`$DB {DB_CLIENT} not connected`);
				console.error(e);
				console.error('Retrying');
				// I suggest using some variable to avoid the infinite loop.
				setTimeout(() => {
					establishConnection(tries - 1);
				}, 2000);
			});
		return db;
	} else {
		console.log('Server could not connect to db for 5 attempts, shutting down');
		process.exit(0);
	}
};

module.exports = establishConnection;
