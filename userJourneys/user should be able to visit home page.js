(function () {
    'use strict';
    describe("user should be able to visit home page", function () {

        var url = '';

        it("Then see the page heading", function () {

            browser.visit(url);

            expect(element(by.id('heading')).getText()).toBe('Map');
        });

    });
}());