module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '/**\n * <%= pkg.name %>\n * <%= pkg.description %>\n * \n * @version <%= pkg.version %>\n * @homepage <%= pkg.homepage %>\n * @repository <%= pkg.repository.url %>\n * @license <%= pkg.license %>\n */\n'
            },
            build: {
                src: 'src/angular-pubsub.js',
                dest: 'dist/angular-pubsub.min.js'
            }
        },

        removelogging: {
            dev: {
                src: 'src/angular-pubsub.js',
                dest: 'src/angular-pubsub.js',
                options: {}
            },
            dist: {
                src: 'dist/angular-pubsub.min.js',
                dest: 'dist/angular-pubsub.min.js',
                options: {}
            }
        }
    });

    // Load plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-remove-logging');


    // Register task(s).
    grunt.registerTask(
        'build',
        'Minify to dist folder and remove logs.',
        ['uglify', 'removelogging:dist']
    );

    grunt.registerTask(
        'removeloggingDev',
        'Removes logs from src files.',
        ['removelogging:dev']
    );
};
