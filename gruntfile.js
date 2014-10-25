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
                }
            },
            unit: {
                coverageReporter: {type: 'html', dir:'../coverage/'}
            },
            continuous: { 
                singleRun: true,
                browsers: ['PhantomJS'],
                coverageReporter: {type: 'lcov', dir:'../coverage/'}
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
            updatepackages: { command: 'npm-check-updates -u' }
        },
        
        coveralls: {
            src: 'coverage/**/lcov.info',
            options: { force: false }
        },

        connect: {
            dev: {
                options: {
                    port: 4000,
                    base: 'src',
                    keepalive: true
                }
            },
            offline: {
                options: {
                    port: 4001,
                    base: 'offline',
                    keepalive: true,
                    middleware: [
                        function myMiddleware(req, res, next) {
                            res.end('Hello, world!');
                        }
                    ]
                }
            }
        }
        
    });
        
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-jslint');
    grunt.loadNpmTasks('grunt-protractor-runner');
    grunt.loadNpmTasks('grunt-coveralls');
    grunt.loadNpmTasks('grunt-contrib-connect');

    grunt.registerTask('lint', ['jslint']);
    //grunt.registerTask('start.server', ['shell:startJekyll']);
    grunt.registerTask('start.server', ['connect:dev']);
    grunt.registerTask('start.offline', ['connect:offline']);
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