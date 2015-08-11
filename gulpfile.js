var gulp = require('gulp'),
	$ = require('gulp-load-plugins')();

gulp.task('build', function(done) {
	var compiled = gulp.src([
		'./src/Private.js',
		'./src/Uploader.js'
	])
		.pipe($.sourcemaps.init())
		.pipe($.babel({
			stage: 0,
			moduleIds: true,
			modules: 'umd'
		}))
		.pipe($.concat('Uploader.js'));

	compiled
		.pipe($.clone())
		.pipe($.license('MIT', {
			organization: 'Lance Miller'
		}))
		.pipe(gulp.dest('.'));

	compiled
		.pipe($.clone())
		.pipe($.rename({
			extname: '.min.js'
		}))
		.pipe($.uglify())
		.pipe($.license('MIT', {
			organization: 'Lance Miller',
			tiny: true
		}))
		.pipe(gulp.dest('.'));

	return done();
});

gulp.task('watch', ['build'], function(done) {
	gulp.watch('./src/**/*.js', ['build']);
	return done();
});
