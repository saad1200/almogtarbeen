(function () {
    'use strict';
    
    var controllerId = 'portal';
    angular.module('app').controller(controllerId, ['common', 'articlesService', 'categoriesService', 'galleryView', 'preloaderImageService', portal]);

    function portal(common, articlesService, categoriesService, galleryView, preloaderImageService) {
        var getLogFn = common.logger.getLogFn;
        var log = getLogFn(controllerId);

        var vm = this;
        vm.articles = [];
        vm.slids = [];
        vm.categories = [];
        vm.pictures = ['http://malsup.github.com/images/beach1.jpg']
        vm.isLoading = true;
        vm.isSuccessful = false;
        vm.percentLoaded = 0;
        
        activate();

        function activate() {
            var promises = [getArticles(), getWritersArticles(), getCategories()];
            common.activateController(promises, controllerId)
                .then(function () { 
                    log('Activated Dashboard View'); 
            });
        }

        function getArticles() {
            return articlesService.getLatest().then(function (result) {
                var imagesToPreload = [];
                for(var index in result.data)
                    imagesToPreload.push(result.data[index].pictures);

                preloaderImageService.preloadImages( imagesToPreload ).then(
                    function handleResolve( imageLocations ) {
                        vm.articles = result.data;
                        galleryView.refresh();
                });
                
                return vm.articles ;
            });
        }
        
        function getCategories(){
            return categoriesService.getAll().then(function (result) {
                vm.categories = result.data;
                return vm.categories ;
            });
        }
        
        function preloadImages(preloadImages){
            preloader.preloadImages( preloadImages ).then(
                function handleResolve( imageLocations ) {

                    // Loading was successful.
                    vm.isLoading = false;
                    vm.isSuccessful = true;

                    console.info( "Preload Successful" );

                },
                function handleReject( imageLocation ) {

                    // Loading failed on at least one image.
                    vm.isLoading = false;
                    vm.isSuccessful = false;

                    console.error( "Image Failed", imageLocation );
                    console.info( "Preload Failure" );

                },
                function handleNotify( event ) {

                    vm.percentLoaded = event.percent;

                    console.info( "Percent loaded:", event.percent );

                }
            );
        }
    }
    
})();

(function () {
    'use strict';
    
    angular.module('app').service('articlesService', ['$http', articlesService]);
    
    function articlesService($http){
        
        this.getLatest = function(){
            return $http.get('http://www.almogtarbeen.com/articles/getArticles?size=10&notCategoies=(17,5)');
        }
    }
    
})();
    
(function () {
    'use strict';
    
    angular.module('app').service('categoriesService', ['$http', articlesService]);
    
    function articlesService($http){
        
        this.getAll = function(){
            return $http.get('http://www.almogtarbeen.com/categories/getall');
        }
    }
    
})();


(function () {

    angular.module('app').service('galleryView', galleryView);
    
    function galleryView(){
        
        this.refresh = function(){
            setTimeout(function(){ 

            $('.cycle-slideshow').on('cycle-before', function (opts) {
                var slideshow = $(this);
                var img = slideshow.find('.banner-background').css('background-image');
                slideshow.css('background-image', img);
            });

            var progress = $('#progress'),
                slideshow = $( '.cycle-slideshow' );

            slideshow.on( 'cycle-initialized cycle-before', function( e, opts ) {
                progress.stop(true).css( 'width', 0 );
            });

            slideshow.on( 'cycle-initialized cycle-after', function( e, opts ) {
                if ( ! slideshow.is('.cycle-paused') )
                    progress.animate({ width: '100%' }, opts.timeout, 'linear' );
            });

            slideshow.on( 'cycle-paused', function( e, opts ) {
               progress.stop(); 
            });

            slideshow.on( 'cycle-resumed', function( e, opts, timeoutRemaining ) {
                progress.animate({ width: '100%' }, timeoutRemaining, 'linear' );
            });
                            
            $('.cycle-slideshow').cycle({
                slides:"a",
                fx:'scrollHorz',
                speed:'700',
                timeout:'7000',
                pauseOnHover:"true",
                prev:".prev",
                next:".next",    
                overlayTemplate:"<div class=banner-background style=background-image:url({{background}})></div>",
                captionTemplate:"<span class=caption1>{{caption1}}</span>",
                easing:"easeOutBack",
                pager:"#adv-custom-pager",
                pagerTemplate:"<a href='#'><img src='{{background}}' width='40' height='40' class='col-md-1 thumbnail'></a>"
            });
        });
        }
    }
    
})();
    