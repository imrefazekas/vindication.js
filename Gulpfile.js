var gulp = global.gulp = require('gulp'),
	plugins = global.plugins = require("gulp-load-plugins")( { scope: ['devDependencies'] } );;

gulp.task('eslint', function() {
	return gulp.src( 'vindication.js' )
		.pipe( global.plugins.eslint() )
		.pipe( global.plugins.eslint.format() )
		.pipe( global.plugins.eslint.failOnError() );
});

gulp.task( 'uglify', function(callback) {
	return gulp.src( 'vindication.js' )
		.pipe( global.plugins.rename( 'vindication.min.js') )
		.pipe( global.plugins.uglify( {outSourceMap: true} ) )
		.pipe( gulp.dest('./') );
} );

gulp.task( 'default', [ 'eslint', 'uglify' ] );
