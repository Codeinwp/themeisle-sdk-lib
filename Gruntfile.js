module.exports = function (grunt) {
	grunt.initConfig(
		{
			version: {
				project: {
					src: [
					'package.json'
					]
				},
				composer: {
					src: [
					'composer.json'
					]
				},
				load_php: {
					options: {
						prefix: '\\.*\\$themeisle_sdk_version\.*\\s=\.*\\s\''
					},
					src: [
					'load.php'
					]
				},
			},
		}
	);
	grunt.loadNpmTasks( 'grunt-version' );
};
