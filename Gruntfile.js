module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.initConfig({
		jshint: {
			options: {
				force: true
			},
			all: [ './vindication.js' ]
		},
		uglify: {
			options: {
				mangle: false
			},
			my_target: {
				files: {
					'./vindication.min.js': ['./vindication.js']
				}
			}
		}
	});

	grunt.registerTask('default', 'jshint', 'uglify');
};