module.exports = function(grunt) {
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        karma: {
            options: { 
                configFile: 'config/karma.conf.js', 
                thresholdReporter: {
                  statements: 90,
                  branches: 60,
                  functions: 85,
                  lines: 90
                },
            },
            unit: {
                coverageReporter: {type: 'html', dir:'../coverage/'}
            },
            continuous: { 
                singleRun: true,
                browsers: ['PhantomJS'],
                coverageReporter: {type: 'lcov', dir:'../coverage/'},
            }
        },
        
        protractor: {
            options: { configFile: "node_modules/protractor/referenceConf.js" },
            local: { options: {configFile: "config/protractor.config.js" } },
            ci: { options: { configFile: "config/protractor.config.ci.js" }},
            cucumber: { options: { configFile: "config/protractor.config.cucumber.js" }}
        },

        jslint: {
            client : {
                src: ['src/app/**/*.js','userJourneys/**/*.js','spec/**/*.js'],
                directives: {
                  browser: true,
                  predef: ['jQuery', 'angular','describe','it','browser','expect','element','by', '$broadcast']
                },
                options: {}
            }

        },
        
        shell: { 
            updateLocalWebdriver: { command: './node_modules/protractor/bin/webdriver-manager update' },
            updateCiWebdriver: { command: './node_modules/grunt-protractor-runner/node_modules/protractor/bin/webdriver-manager update' },
            startJekyll: { command: 'jekyll serve --watch' },
            updatepackages: { command: 'npm-check-updates -u' },
        },
        
        coveralls: {
            src: 'coverage/**/lcov.info',
            options: { force: false }
        },
        
    });
        
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-coveralls');
    
    grunt.registerTask('lint', ['jslint']);
    grunt.registerTask('start.server', ['shell:startJekyll']);
    grunt.registerTask('acceptance', ['shell:updateLocalWebdriver', 'protractor:local']);
    grunt.registerTask('acceptance-ci', ['protractor:ci']);
    grunt.registerTask('acceptance-cucumber', ['protractor:cucumber']);
    grunt.registerTask('all', []);
    grunt.registerTask('unit', ['karma:unit']);
    grunt.registerTask('continuous', ['karma:continuous']);
    grunt.registerTask('submit.coverage', ['coveralls']);
    grunt.registerTask('update.packages', ['shell:updatepackages']);
    grunt.registerTask('default', ['']);
    
};