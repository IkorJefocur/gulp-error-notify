const plumber = require('gulp-plumber'),
desktop = require('node-notifier').notify,
debounce = require('throttle-debounce').debounce,
path = require('path');


const errorNotify = {

	icon: path.join(__dirname, 'icons/bug.svg'),
	options: {},
	cache: [],

	use(error) {
		const {plugin, message} = error;
		const notification = this.cache.find(notif => plugin === notif.plugin && message === notif.message);

		if (notification !== undefined) {
			notification.count++;
			return;
		}

		this.cache.push({
			plugin, message,
			full: error,
			count: 1
		});
		this.send();
	},

	send() {
		for (let {plugin, message, count, full} of this.cache) {
			if (this.options.console)
				console.error(`Error in "${plugin}" (${count}):\n`, full);

			if (this.options.desktop)
				desktop({
					title: '!!! ERROR !!!',
					message: `Plugin: ${plugin}\nMessage:\n${message}` + (count > 1 ? `\n(${count} times)` : ''),
					icon: this.icon
				});
		}

		this.cache = [];
	}

}

function notify() {
	return errorNotify.use.apply(errorNotify, arguments);
}


function main(options = {}) {
	errorNotify.options = Object.assign({
		delay: 1000,
		console: true,
		desktop: true
	}, options);

	errorNotify.send = debounce(errorNotify.options.delay, true, errorNotify.send);

	return plumber({errorHandler: notify});
}

module.exports = main;