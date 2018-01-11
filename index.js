const boot = require('./lib/boot');

module.exports = (app, configs) => {
	boot(app, configs);
}