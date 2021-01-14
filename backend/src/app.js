const express = require('express');
const morgan = require('morgan');
const path = require('path');
const routes = require('./routes');

function App() {
  const app = express();

  // Configuring application middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan('dev'));
  app.use(
    '/files', 
    express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
  );

  // Configuring application routes
  routes.forEach(route => app.use(route));

  return app;
}

module.exports = App();