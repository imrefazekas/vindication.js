'use strict'

let gulp = require('gulp'),
	plugins = require('gulp-load-plugins')( { scope: ['devDependencies'] } )

gulp.task( 'lint', function (callback) {
	return gulp.src( 'vindication.js' )
		.pipe( plugins.eslint() )
        .pipe( plugins.eslint.format() )
        .pipe( plugins.eslint.failAfterError() )
} )

gulp.task( 'uglify', function (callback) {
	return gulp.src( 'vindication.js' )
		.pipe( plugins.rename( 'vindication.min.js') )
		.pipe( plugins.uglify( { sourceMap: true } ) )
		.pipe( gulp.dest('./') )
} )

gulp.task( 'default', [ 'lint', 'uglify' ] )
