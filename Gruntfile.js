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
              src: ['**/*.hbs'],
              dest: 'app/views'
            }
          ],
        },
        files: {
          'public/scripts.js': ['app/entry.js', 'app/views/**/*.hbs'],
        },
      },
    }

  });

  grunt.loadNpmTasks('grunt-browserify');

  grunt.registerTask('default', ['browserify']);
};
