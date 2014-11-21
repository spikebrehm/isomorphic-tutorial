module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      main: {
        options: {
          debug: true,
          transform: ['hbsfy'],
          aliasMappings: [
            {
              cwd: 'app/views',
              src: ['**/*.hbs', '**/*.js'],
              dest: 'app/views',
              rename: function(cwd, src) {
                // Little hack to ensure that file extension is preserved.
                // This allows us to have '.hbs' and '.js' files in same
                // directory with same basename.
                var ext = src.split('.').pop();
                return cwd + '/' + src + '.' + ext;
              }
            }
          ],
          alias: ['jquery-browserify:jquery'],
        },
        files: {
          'public/scripts.js': 'app/entry.js',
        },
      },
    },

    stylus: {
      main: {
        options: {
          paths: ['assets/stylesheets'],
          'include css': true
        },
        files: {
          'public/styles.css': 'assets/stylesheets/index.styl'
        }
      }
    },

    nodemon: {
      main: {},
      debug: {
        options: {
          nodeArgs: ['--debug']
        }
      }
    },

    watch: {
      app: {
        files: 'app/**/*',
        tasks: ['browserify'],
        options: {
          interrupt: true
        }
      },
      styles: {
        files: 'assets/stylesheets/**/*',
        tasks: ['stylus'],
        options: {
          interrupt: true
        }
      }
    },

    concurrent: {
      main: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },

      debug: {
        tasks: ['nodemon:debug', 'watch', 'node-inspector'],
        options: {
          logConcurrentOutput: true
        }
      }
    },

    'node-inspector': {
      main: {}
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-node-inspector');

  grunt.registerTask('compile', ['browserify', 'stylus']);
  grunt.registerTask('default', ['compile']);
  grunt.registerTask('server', ['compile', 'concurrent']);
  grunt.registerTask('server:debug', ['compile', 'concurrent:debug']);
};
