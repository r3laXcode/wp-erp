'use strict';
module.exports = function(grunt) {
    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        // setting folder templates
        dirs: {
            css: 'assets/css',
            images: 'assets/images',
            js: 'assets/js',
            less: 'assets/less'
        },

        // Compile all .less files.
        less: {

            admin: {
                files: {
                    '<%= dirs.css %>/admin.css': '<%= dirs.less %>/admin/admin.less',
                    '<%= dirs.css %>/setup.css': '<%= dirs.less %>/admin/setup.less'
                }
            }
        },

        uglify: {
            minify: {
                expand: true,
                cwd: '<%= dirs.js %>',
                src: '**/*.js',
                dest: '<%= dirs.js %>/',
                ext: '.min.js'
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= dirs.js %>/*.js',
                '!<%= dirs.js %>/*.min.js',
            ]
        },

        // Generate POT files.
        makepot: {
            target: {
                options: {
                    exclude: ['build/.*', 'node_modules/*', 'assets/*'],
                    domainPath: '/i18n/languages/', // Where to save the POT file.
                    potFilename: 'wp-erp.pot', // Name of the POT file.
                    type: 'wp-plugin', // Type of project (wp-plugin or wp-theme).
                    potHeaders: {
                        'report-msgid-bugs-to': 'http://wperp.com/support/',
                        'language-team': 'LANGUAGE <EMAIL@ADDRESS>'
                    }
                }
            }
        },

        watch: {
            less: {
                files: ['<%= dirs.less %>/*.less', '<%= dirs.less %>/admin/*.less' ],
                tasks: ['less:admin'],
                options: {
                    livereload: true
                }
            }
        },

        // Clean up build directory
        clean: {
            main: ['build/']
        },

        // Copy the plugin into the build directory
        copy: {
            main: {
                src: [
                    '**',
                    '!node_modules/**',
                    '!.codekit-cache/**',
                    '!.idea/**',
                    '!build/**',
                    '!bin/**',
                    '!.git/**',
                    '!Gruntfile.js',
                    '!package.json',
                    '!composer.json',
                    '!composer.lock',
                    '!debug.log',
                    '!phpunit.xml',
                    '!.gitignore',
                    '!.gitmodules',
                    '!npm-debug.log',
                    '!plugin-deploy.sh',
                    '!export.sh',
                    '!config.codekit',
                    '!nbproject/*',
                    '!assets/less/**',
                    '!tests/**',
                    '!README.md',
                    '!CONTRIBUTING.md',
                    '!**/*~'
                ],
                dest: 'build/'
            }
        },

        //Compress build directory into <name>.zip and <name>-<version>.zip
        compress: {
            main: {
                options: {
                    mode: 'zip',
                    archive: './build/wp-erp-v' + pkg.version + '.zip'
                },
                expand: true,
                cwd: 'build/',
                src: ['**/*'],
                dest: 'wp-erp'
            }
        },

    });

    // Load NPM tasks to be used here
    grunt.loadNpmTasks( 'grunt-contrib-less' );
    grunt.loadNpmTasks( 'grunt-contrib-concat' );
    grunt.loadNpmTasks( 'grunt-contrib-jshint' );
    grunt.loadNpmTasks( 'grunt-wp-i18n' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-contrib-copy' );
    grunt.loadNpmTasks( 'grunt-contrib-compress' );
    grunt.loadNpmTasks( 'grunt-text-replace' );

    grunt.registerTask('default', ['less']);

    grunt.registerTask( 'release', [
        'makepot',
    ]);

    grunt.registerTask( 'zip', [
        'clean', 'copy', 'compress'
    ]);
};
