const mongoose = require('mongoose');
//const host = process.env.DB_HOST || '127.0.0.1/Loc8r'
const host = process.env.DB_HOST || 'mongo-mongo/Loc8r'
const mongodbnet_id = process.env.MONGODBNET_ID;
const mongodbnet_pwd = process.env.MONGODBNET_PWD;
const mongodbnet_url = process.env.MONGODBNET_URL;
let dbURL = ''
if(mongodbnet_url && mongodbnet_pwd && mongodbnet_id){
  console.log('using mongodbnet');
  dbURL = `mongodb+srv://${mongodbnet_id}:${mongodbnet_pwd}@${mongodbnet_url}/loc8r?retryWrites=true&w=majority`;
}else{
  console.log(`using: ${host}`);
  dbURL = `mongodb://${host}`;
}
const readLine = require('readline');

console.log('KEN_ENV: ' + process.env.KEN_ENV);

const connect = () => {
  setTimeout(() => mongoose.connect(dbURL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }), 1000);
}

mongoose.connection.on('connected', () => {
  console.log('connected');
});

mongoose.connection.on('error', err => {
  console.log('error: ' + err);
  return connect();
});

mongoose.connection.on('disconnected', () => {
  console.log('disconnected');
});

if (process.platform === 'win32') {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on ('SIGINT', () => {
    process.emit("SIGINT");
  });
}

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close( () => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

process.once('SIGUSR2', () => {
  gracefulShutdown('nodemon restart', () => {
    process.kill(process.pid, 'SIGUSR2');
  });
});
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});
process.on('SIGTERM', () => {
  gracefulShutdown('Heroku app shutdown', () => {
    process.exit(0);
  });
});

connect();

require('./locations');
