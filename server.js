const express = require('express');

const projectRouter = require('./project/projectRouter');
const actionRouter = require('./action/actionRouter');

const server = express();
server.use(logger);
server.use(express.json());

server.use('/api/action', actionRouter);
server.use('/api/project', projectRouter);

function logger(req, res, next) {
  const time = new Date();
  console.log(`${req.method} to ${req.path} at ${time.toISOString()}`);
  next();
}

module.exports = server;
