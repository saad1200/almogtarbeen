
exports.config = {

    chromeOnly: true,
    chromeDriver: '../node_modules/protractor/selenium/chromedriver',

    capabilities: {
        'browserName': 'chrome'
    },
    
    baseUrl: 'http://0.0.0.0:4000',
    
    specs: ['../userJourneys/*.js'],

    onPrepare: function () {
			
        global.wait = function(condition, timeout) {
            browser.wait(function () { return browser.driver.isElementPresent(condition); }, timeout);
        };
        browser.visit = function (url) {
            browser.manage().window().maximize();
            return browser.get(url);
        };

    },
    
    jasmineNodeOpts: {
        onComplete: function () {
        },
        showColors: true,
        isVerbose: true,
        includeStackTrace: false,
        defaultTimeoutInterval: 30000
    }
};


