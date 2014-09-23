var assert = require("assert");
var should = require('should');

module.exports = function() {

	this.Given(/^i am on the home page$/, function (callback) {
	  browser.visit('').then(function(){
          callback();
      });
	});

	this.Given(/^i should see "([^"]*)" message$/, function (message, callback) {
        
        
        var title = element(by.id('heading')).getText();
        console.log(title);
        assert.equal(title, 'Map');
//        element(by.id('heading')).getText().should.equal('Map');
    });

};