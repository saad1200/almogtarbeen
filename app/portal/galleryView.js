(function(){
    'use strict'

    angular.module('app').controller('gallery', ['galleryView', gallery]);

    function gallery(galleryView){
        galleryView.refresh();
    }
})();