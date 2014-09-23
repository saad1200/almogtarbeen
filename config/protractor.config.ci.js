
exports.config = {

    capabilities: {
        'browserName': 'phantomjs'
    },
        
    specs: ['../userJourneys/*.js'],
    
    baseUrl: 'http://0.0.0.0:4000',
    
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
        showColors: true,
        defaultTimeoutInterval: 30000
    }
};


