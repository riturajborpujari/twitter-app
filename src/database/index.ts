import mongoose from 'mongoose';

const {DATABASE_HOST: host, DATABASE_PORT:port, DATABASE_DB: dbName, 
    DATABASE_USER: user, DATABASE_PASS: pass} = process.env

const dbURI = `mongodb://${host}:${port}`;

const options = {
    useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	autoIndex: true,
    poolSize: 10, // Maintain up to 10 socket connections
    
	// If not connected, return errors immediately rather than waiting for reconnect
	bufferMaxEntries: 0,
	connectTimeoutMS: 10000, // Give up initial connection after 10 seconds
	socketTimeoutMS: 45000 // Close sockets after 45 seconds of inactivity
};

mongoose.connect(dbURI, {...options, dbName, user, pass})
    .then( _ => {
        console.log('Mongoose Connection done.')
    })
    .catch(err => {
        console.log('Mongoose connection error.')
        console.error(err)
    })

// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', () => {
	console.log('Mongoose default connection open to ' + dbURI);
});

// If the connection throws an error
mongoose.connection.on('error', err => {
	console.error('Mongoose default connection error: ' + err);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
	console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
	mongoose.connection.close(() => {
		console.log('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});