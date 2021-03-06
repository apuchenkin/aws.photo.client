// Generated on 2015-04-02 using generator-angular 0.10.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    ngconstant: {
      options: {
        name: 'aws.config',
        dest: '.tmp/scripts/config.js',
        constants: {
          'TRANSLATION': {
            'EN': grunt.file.readJSON('app/translation/en.json'),
            'RU': grunt.file.readJSON('app/translation/ru.json')
          }
        }
      },
      dev: {
        constants: {
          CONFIG: grunt.file.readJSON('app/config/default.json')
        }
      },
      prod: {
        constants: {
          CONFIG: grunt.file.readJSON('app/config/production.json')
        }
      }
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      gruntfile: {
        files: ['Gruntfile.js']
      },
      bower: {
        files: ['bower.json']
      },
      json: {
        files: ['<%= yeoman.app %>/{,*/}*.json'],
        tasks: ['ngconstant:dev']
      },
      js: {
        files: [
          '<%= yeoman.app %>/scripts/{,*/}*.js',
          '<%= yeoman.app %>/module/admin/scripts/{,*/}*.js'
        ],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      less: {
        files: [
          '<%= yeoman.app %>/styles/{,*/}*.less',
          '<%= yeoman.app %>/module/admin/styles/{,*/}*.less'
        ],
        tasks: ['less'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,*/}*.html'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: false,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/',
                connect.static('.tmp/app')
              ),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect().use(
                '/test',
                connect.static('./test')
              ),
              connect().use(
                '/static',
                connect.static('./static')
              ),
              connect().use(
                '/admin',
                connect.static('.tmp/module/admin')
              ),
              connect().use(
                '/admin',
                connect.static(appConfig.app + '/module/admin')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      //test: {
      //  options: {
      //    port: 9001,
      //    middleware: function (connect) {
      //      return [
      //        connect.static('.tmp'),
      //        connect.static('test'),
      //        connect().use(
      //          '/bower_components',
      //          connect.static('./bower_components')
      //        ),
      //        connect().use(
      //          '/test',
      //          connect.static('./test')
      //        ),
      //        connect.static(appConfig.app)
      //      ];
      //    }
      //  }
      //},
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/scripts/{,*/}*.js',
          '<%= yeoman.app %>/module/admin/scripts/{,*/}*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/{,*/}*',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: [
          '<%= yeoman.app %>/index.html',
          '<%= yeoman.app %>/modules/admin/index.html'
        ],
        ignorePath:  /\.\.\//
      }
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      }
    },

    less: {
      css: {
        files: {
          '.tmp/styles/client.css': '<%= yeoman.app %>/styles/app.less',
          '.tmp/styles/admin.css': '<%= yeoman.app %>/module/admin/styles/admin.less'
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      client: {
        src: ['.tmp/app/index.html'],
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      },
      admin: {
        src: ['.tmp/app/module/admin/index.html'],
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    purifycss: {
      options: {},
      target: {
        src: ['app/index.html', '.tmp/concat/scripts/client.js', '.tmp/concat/scripts/vendor-client.js'],
        css: ['.tmp/concat/styles/main.css'],
        dest: '.tmp/concat/styles/main.css'
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: [
        '<%= yeoman.dist %>/{,*/}*.html',
        '<%= yeoman.dist %>/module/admin/{,*/}*.html'
      ],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>',
          '<%= yeoman.dist %>/styles',
          '<%= yeoman.dist %>/images'
        ]
      }
    },

    // The following *-min tasks will produce minified files in the dist folder
    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },
    //
    //imagemin: {
    //  dist: {
    //    files: [{
    //      expand: true,
    //      cwd: '<%= yeoman.app %>/images',
    //      src: '{,*/}*.{png,jpg,jpeg,gif}',
    //      dest: '<%= yeoman.dist %>/images'
    //    }]
    //  }
    //},
    //
    //svgmin: {
    //  dist: {
    //    files: [{
    //      expand: true,
    //      cwd: '<%= yeoman.app %>/images',
    //      src: '{,*/}*.svg',
    //      dest: '<%= yeoman.dist %>/images'
    //    }]
    //  }
    //},

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,*/}*.html', 'module/admin/*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: [
          '<%= yeoman.dist %>/*.html',
          '<%= yeoman.dist %>/module/admin/*.html'
        ]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '.tmp/app',
          dest: '<%= yeoman.dist %>',
          src: [
            'index.html',
            'module/admin/index.html'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            'sitemap.xml',
            '*.{ico,png,txt,gif}',
            'resolution.json',
            '.htaccess',
            'views/{,*/}{,*/}*.html',
            'module/admin/views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          //for icomoon
          expand: true,
          dot: true,
          cwd: 'bower_components/icomoon/dist',
          src: ['fonts/*.*'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    //// Run some tasks in parallel to speed up the build process
    //concurrent: {
    //  server: [
    //    'copy:styles'
    //  ],
    //  test: [
    //    'copy:styles'
    //  ],
    //  dist: [
    //    'copy:styles'
    //    //'imagemin',
    //    //'svgmin'
    //  ]
    //},

    // Test settings
    //karma: {
    //  unit: {
    //    configFile: 'test/karma.conf.js',
    //    singleRun: true
    //  }
    //},

    ngTemplateCache: {
      client: {
        files: {
          '.tmp/scripts/views-client.js': [
            '<%= yeoman.app %>/views/*.html',
            '<%= yeoman.app %>/views/landing/*.html',
            '<%= yeoman.app %>/views/gallery/*.html'
          ]
        },
        options: {
          module: 'aws.photo.client',
          trim: 'app/'
        }
      },
      admin: {
        files: {
          '.tmp/scripts/views-admin.js': [
            '<%= yeoman.app %>/module/admin/views/*.html'
          ]
        },
        options: {
          module: 'aws.photo.admin',
          trim: 'app/'
        }
      }
    },

    replace: {
      dev: {
        options: {
          patterns: [
            {
              json: grunt.file.readJSON('grunt/dev.json')
            }
          ]
        },
        files: [
          {
            expand: true,
            flatten: false,
            src: [
              '<%= yeoman.app %>/index.html',
              '<%= yeoman.app %>/module/admin/index.html'
            ],
            dest: '.tmp/'
          }
        ]
      },
      dist: {
        options: {
          patterns: [
            {
              json: grunt.file.readJSON('grunt/dist.json')
            }
          ]
        },
        files: [
          {
            expand: true,
            flatten: false,
            src: [
              '<%= yeoman.app %>/index.html',
              '<%= yeoman.app %>/module/admin/index.html'
            ],
            dest: '.tmp/'
          }
        ]
      }
    },

    execute: {
      target: {
        src: ['sitemap.js']
      }
    }

  });



  grunt.registerTask('serve', 'Compile then start a connect web server', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'less',
      'autoprefixer',
      'ngconstant:dev',
      'replace:dev',
      'connect:livereload',
      'watch'
    ]);
  });

  //grunt.registerTask('test', [
  //  'clean:server',
  //  'concurrent:test',
  //  'autoprefixer',
  //  'connect:test',
  //  'karma'
  //]);

  grunt.registerTask('build', [
    'clean:dist',
    'ngconstant:prod',
    'less',
    'replace:dist',
    'useminPrepare',
    'ngTemplateCache',
    'autoprefixer',
    'concat',
    'purifycss',
    'execute',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'filerev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
