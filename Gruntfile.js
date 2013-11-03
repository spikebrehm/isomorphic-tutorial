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
              dest: 'app/views'
            }
          ],
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
      main: {}
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
      }
    }

  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('compile', ['browserify', 'stylus']);
  grunt.registerTask('default', ['compile']);
  grunt.registerTask('server', ['compile', 'concurrent']);
};
