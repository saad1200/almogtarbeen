module.exports = function(config) {
  config.set({

    basePath: '',
      
    frameworks: ['jasmine'],
	
    files: [
              '../src/bower_components/angular/angular.js',
              '../src/bower_components/angular-mocks/angular-mocks.js',
              '../src/app/app.js',
              '../src/app/**/*.js',
              '../spec/**/*.js'
            ],
      
    port: 9876,

    captureTimeout: 60000,
      
    preprocessors: {
        '../src/app/**/*.js': ['coverage']
    },

    reporters: ['progress', 'coverage','threshold'],

  });
};
