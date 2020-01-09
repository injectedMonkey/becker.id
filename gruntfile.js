const sass = require('node-sass');
const Fiber = require('fibers');

module.exports = function(grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            empty: {
                src: ['docs']
            },
            kondo: {
                src: ['docs/**/*_pre.html']
            },
        },
        copy: {
            favicon: {
                expand: true,
                flatten: true,
                src: ['src/favicon/*', 'src/CNAME', '!**/*.html', '!**/*.md'],
                dest: 'docs/'
            },
            html: {
                expand: true,
                flatten: true,
                src: ['src/**/*.html', '!src/favicon/**/*.html'],
                dest: 'docs/'
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: false,
                    collapseWhitespace: true
                },
                files: {
                    'docs/index.html': 'docs/index_pre.html'
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    'docs/index_pre.html': ['src/index.html']
                }
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
                dest: 'docs/js/<%= pkg.name %>.min.js'
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
                    'docs/css/<%= pkg.name %>.css': 'src/scss/main.scss',
                    'docs/css/<%= pkg.name %>.behavior.css': 'src/scss/behavior.scss'
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
                    'docs/css/<%= pkg.name %>.min.css': [
                        'docs/css/<%= pkg.name %>.css',
                        'docs/css/<%= pkg.name %>.behavior.css',
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
                    dest: 'docs/images/mood/'
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
                    dest: 'docs/images/profile/'
                }]
            }
        },
        image: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'docs/images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'docs/images'
                }]
            }
        },
        cwebp: {
            dynamic: {
                files: [{
                    expand: true,
                    cwd: 'docs/images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'docs/images'
                }]
            }
        },
        watch: {
            livereload: {
                // Here we watch the files the sass task will compile to
                // These files are sent to the live reload server after sass compiles to them
                options: { livereload: true },
                files: ['docs/**/*'],
            },
            css: {
                files: 'src/scss/**/*.scss',
                tasks: ['sass', 'cssmin']
            },
            html: {
                files: 'src/**/*.html',
                tasks: ['copy:html']
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
                        html: ['docs/index.html'],
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
                    'docs/css/*.css',
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
                src: 'docs/index.html',
                dest: 'docs/index.html'
            }
        },
        connect: {
            server: {
                options: {
                    port: 9001,
                    open : true,
                    base: 'docs',
                    livereload : true
                },
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-image');
    grunt.loadNpmTasks('grunt-cwebp');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('default', ['connect', 'watch']);

    grunt.registerTask('css', [
        'sass',
        'postcss',
        'cssmin',
        'critical'
    ]);

    grunt.registerTask('build', [
        'clean:empty',
        'copy:favicon',
        'processhtml',
        'htmlmin',
        'concat',
        'uglify',
        'sass',
        'postcss',
        'cssmin',
        'critical',
        'responsive_images',
        'image',
        'cwebp',
        'clean:kondo',
    ]);
};
