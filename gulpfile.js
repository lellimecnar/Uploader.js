var gulp = require('gulp'),
	$ = require('gulp-load-plugins')();

gulp.task('build', function() {
	return gulp.src([
		'./src/Private.js',
		'./src/Uploader.js'
	])
		.pipe($.sourcemaps.init())
		.pipe($.babel({
			stage: 0,
			moduleIds: true,
			modules: 'umd'
		}))
		.pipe($.concat('Uploader.min.js'))
		.pipe($.uglify())
		.pipe($.sourcemaps.write('.'))
		.pipe(gulp.dest('.'));
});

gulp.task('watch', ['build'], function(done) {
	gulp.watch('./src/**/*.js', ['build']);
	return done();
})
