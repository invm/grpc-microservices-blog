const dbError = (error) => {
	console.log('DB Error', error);
};

const handleSignal = (signal) => {
	console.log(`*^!@4=> Received event: ${signal}`);
};

module.exports = { dbError, handleSignal };
