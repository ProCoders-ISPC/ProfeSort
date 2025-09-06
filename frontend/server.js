const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('mock-admin-docentes.json');
const middlewares = jsonServer.defaults();

const routes = require('./routes.json');
server.use(jsonServer.rewriter(routes));
server.use(middlewares);
server.use(router);
server.listen(3000, () => {
  console.log('JSON Server is running on port 3000');
});