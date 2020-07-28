Handle errors throwed by other gulp plugins, and showing them as console logs and desktop notifications. Using node-notifier.

## Usage

Just add pipe at start:

```
const errorHandler = require('gulp-error-notify');
gulp.task('something', function(done) {
	gulp.src(files)
	.pipe(errorHandler())
	// Other...
})
```

## Options

**bool console = true** - Show errors in console.

**bool desktop = true** - Show errors via desktop notifications.

**number delay = 1000** - Delay between showing errors. After that delay, same errors will be grouped into one.