
exports.config = {

    capabilities: {
        'browserName': 'chrome'
    },
        
    specs: ['../features/*.feature'],
    
    framework: 'cucumber',
    
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


