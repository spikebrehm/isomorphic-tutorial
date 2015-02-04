module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    browserify: {
      main: {
        options: {
          debug: true,
          transform: ['reactify'],
          aliasMappings: [
            {
              cwd: 'app/views',
              src: ['**/*.jsx'],
              dest: 'app/views',
              rename: function(cwd, src) {
                // Little hack to ensure that file extension is preserved.
                var ext = src.split('.').pop();
                return cwd + '/' + src + '.' + ext;
              }
            }
          ],
          alias: ['jquery-browserify:jquery'],
        },
        files: {
          'public/scripts.js': 'app/initialize.js',
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

  require('load-grunt-tasks')(grunt);

  grunt.registerTask('compile', ['browserify', 'stylus']);
  grunt.registerTask('default', ['compile']);
  grunt.registerTask('server', ['compile', 'concurrent']);
  grunt.registerTask('server:debug', ['compile', 'concurrent:debug']);
};
