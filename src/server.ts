import app from './app/app';
const gracefulShutdown = require('http-graceful-shutdown');

const PORT:number = Number(process.env.PORT) || 3001;

const server = app.listen(PORT);

gracefulShutdown(server);