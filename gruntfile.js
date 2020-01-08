const sass = require('node-sass');
const Fiber = require('fibers');

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: {
                src: ['dist']
            },
        },
        copy: {
            templates: {
                src: 'src/index.html',
                dest: 'dist/index.html'
            },
            favicon: {
                expand: true,
                flatten: true,
                src: ['src/favicon/*', '!**/*.html'],
                dest: 'dist/'
            }
        },
        concat: {
            js: {
                files: {
                    'src/js/<%= pkg.name %>.js': ['src/js/vendor/*.js', 'src/js/modules/*.js'],
                },
            }
        },
        uglify: {
            build: {
                src: 'src/js/<%= pkg.name %>.js',
                dest: 'dist/js/<%= pkg.name %>.min.js'
            }
        },
        sass: {
            options: {
                implementation: sass,
                fiber: Fiber,
                sourceMap: false
            },
            dist: {
                files: {
                    'dist/css/<%= pkg.name %>.css': 'src/scss/main.scss',
                    'dist/css/<%= pkg.name %>.behavior.css': 'src/scss/behavior.scss'
                }
            }
        },
        cssmin: {
            options: {
                mergeIntoShorthands: true,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'dist/css/<%= pkg.name %>.min.css': [
                        'dist/css/<%= pkg.name %>.css',
                        'dist/css/<%= pkg.name %>.behavior.css',
                    ]
                }
            }
        },
        responsive_images: {
            mood: {
                options: {
                    sizes: [{
                        width: 540
                    },{
                        width: 720
                    },{
                        width: 960
                    },{
                        width: 1140
                    },{
                        width: 1080,
                        suffix: "-x2",
                    },{
                        width: 1440,
                        suffix: "-x2",
                    },{
                        width: 1920,
                        suffix: "-x2",
                    },{
                        width: 2280,
                        suffix: "-x2",
                    }]
                },
                files: [{
                    expand: true,
                    src: ['**/*.{jpg,gif,png}'],
                    cwd: 'src/images/mood',
                    dest: 'dist/images/mood/'
                }]
            },
            profile: {
                options: {
                    sizes: [{
                        width: 320,
                    },{
                        width: 640,
                        suffix: "-x2",
                    },{
                        width: 540,
                    },{
                        width: 1080,
                        suffix: "-x2",
                    }]
                },
                files: [{
                    expand: true,
                    src: ['**/*.{jpg,gif,png}'],
                    cwd: 'src/images/profile',
                    dest: 'dist/images/profile/'
                }]
            }
        },
        image: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'dist/images',
                    //cwd: 'src/images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/images'
                }]
            }
        },
        cwebp: {
            dynamic: {
                //options: {
                //    q: 50
                //},
                files: [{
                    expand: true,
                    cwd: 'dist/images',
                    //cwd: 'src/images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'dist/images'
                }]
            }
        },
        watch: {
            livereload: {
                // Here we watch the files the sass task will compile to
                // These files are sent to the live reload server after sass compiles to them
                options: { livereload: true },
                files: ['dist/**/*'],
            },
            css: {
                files: 'src/scss/**/*.scss',
                tasks: ['sass', 'cssmin']
            },
            html: {
                files: 'src/**/*.html',
                tasks: ['copy']
            },
            javascript: {
                files: 'src/**/*.js',
                tasks: [
                    'concat',
                    'uglify'
                ]
            },
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer')({}),
                    require('postcss-combine-media-query')(),
                    require('postcss-uncss')({
                        html: ['dist/index.html'],
                        ignore: [/[\.#]fp-./]
                    }),
                    require('cssnano')({
                        preset: ['default', {
                            discardComments: {
                                removeAll: true,
                            }
                        }]
                    }),
                ]
            },
            dist: {
                src: [
                    'dist/css/*.css',
                    '!**/*behavior*.css',
                    '!**/*.min.css',
                ],
                html: ['index.html']
            }
        },
        critical: {
            extract: {
                options: {
                    base: './',
                    width: 1024,
                    height: 768,
                    minify: true
                },
                src: 'dist/index.html',
                dest: 'dist/index.html'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-image');
    grunt.loadNpmTasks('grunt-cwebp');
    grunt.loadNpmTasks('grunt-responsive-images');

    grunt.registerTask('default', ['copy', 'sass']);

    grunt.registerTask('css', [
        'sass',
        'postcss',
        'cssmin',
        'critical'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'concat',
        'uglify',
        'sass',
        'postcss',
        'cssmin',
        'critical',
        'responsive_images',
        'image',
        'cwebp',
    ]);
};
