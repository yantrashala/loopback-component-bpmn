const path = require('path');
const staticPath = path.join(__dirname, '/bpmn-js-seed');
const loopback = require('loopback');

module.exports = (app) => {
	app.use('/design',loopback.static(staticPath));
}