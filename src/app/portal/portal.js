(function () {
    'use strict';
    
    var controllerId = 'portal';
    angular.module('app').controller(controllerId, ['common', 'articlesService', 'categoriesService', 'galleryView', 'preloader', portal]);

    function portal(common, articlesService, categoriesService, galleryView, preloader) {
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
            var promises = [getArticles(), getCategories()];
            common.activateController(promises, controllerId)
                .then(function () { 
                    log('Activated Dashboard View'); 
            });
        }

        function getArticles() {
            return articlesService.getAll().then(function (result) {
                var imagesToPreload = [];
                for(var index in result.data)
                    imagesToPreload.push(result.data[index].pictures);

                preloader.preloadImages( imagesToPreload ).then(
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
        
        this.getAll = function(){
            return $http.get('http://www.almogtarbeen.com/articles/getArticles?size=10');
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


(function(){
        angular.module('app').factory(
            "preloader",
            function( $q, $rootScope ) {
 
                // I manage the preloading of image objects. Accepts an array of image URLs.
                function Preloader( imageLocations ) {
 
                    // I am the image SRC values to preload.
                    this.imageLocations = imageLocations;
 
                    // As the images load, we'll need to keep track of the load/error
                    // counts when announing the progress on the loading.
                    this.imageCount = this.imageLocations.length;
                    this.loadCount = 0;
                    this.errorCount = 0;
 
                    // I am the possible states that the preloader can be in.
                    this.states = {
                        PENDING: 1,
                        LOADING: 2,
                        RESOLVED: 3,
                        REJECTED: 4
                    };
 
                    // I keep track of the current state of the preloader.
                    this.state = this.states.PENDING;
 
                    // When loading the images, a promise will be returned to indicate
                    // when the loading has completed (and / or progressed).
                    this.deferred = $q.defer();
                    this.promise = this.deferred.promise;
 
                }
 
 
                // ---
                // STATIC METHODS.
                // ---
 
 
                // I reload the given images [Array] and return a promise. The promise
                // will be resolved with the array of image locations.
                Preloader.preloadImages = function( imageLocations ) {
 
                    var preloader = new Preloader( imageLocations );
 
                    return( preloader.load() );
 
                };
 
 
                // ---
                // INSTANCE METHODS.
                // ---
 
 
                Preloader.prototype = {
 
                    // Best practice for "instnceof" operator.
                    constructor: Preloader,
 
 
                    // ---
                    // PUBLIC METHODS.
                    // ---
 
 
                    // I determine if the preloader has started loading images yet.
                    isInitiated: function isInitiated() {
 
                        return( this.state !== this.states.PENDING );
 
                    },
 
 
                    // I determine if the preloader has failed to load all of the images.
                    isRejected: function isRejected() {
 
                        return( this.state === this.states.REJECTED );
 
                    },
 
 
                    // I determine if the preloader has successfully loaded all of the images.
                    isResolved: function isResolved() {
 
                        return( this.state === this.states.RESOLVED );
 
                    },
 
 
                    // I initiate the preload of the images. Returns a promise.
                    load: function load() {
 
                        // If the images are already loading, return the existing promise.
                        if ( this.isInitiated() ) {
 
                            return( this.promise );
 
                        }
 
                        this.state = this.states.LOADING;
 
                        for ( var i = 0 ; i < this.imageCount ; i++ ) {
 
                            this.loadImageLocation( this.imageLocations[ i ] );
 
                        }
 
                        // Return the deferred promise for the load event.
                        return( this.promise );
 
                    },
 
 
                    // ---
                    // PRIVATE METHODS.
                    // ---
 
 
                    // I handle the load-failure of the given image location.
                    handleImageError: function handleImageError( imageLocation ) {
 
                        this.errorCount++;
 
                        // If the preload action has already failed, ignore further action.
                        if ( this.isRejected() ) {
 
                            return;
 
                        }
 
                        this.state = this.states.REJECTED;
 
                        this.deferred.reject( imageLocation );
 
                    },
 
 
                    // I handle the load-success of the given image location.
                    handleImageLoad: function handleImageLoad( imageLocation ) {
 
                        this.loadCount++;
 
                        // If the preload action has already failed, ignore further action.
                        if ( this.isRejected() ) {
 
                            return;
 
                        }
 
                        // Notify the progress of the overall deferred. This is different
                        // than Resolving the deferred - you can call notify many times
                        // before the ultimate resolution (or rejection) of the deferred.
                        this.deferred.notify({
                            percent: Math.ceil( this.loadCount / this.imageCount * 100 ),
                            imageLocation: imageLocation
                        });
 
                        // If all of the images have loaded, we can resolve the deferred
                        // value that we returned to the calling context.
                        if ( this.loadCount === this.imageCount ) {
 
                            this.state = this.states.RESOLVED;
 
                            this.deferred.resolve( this.imageLocations );
 
                        }
 
                    },
 
 
                    // I load the given image location and then wire the load / error
                    // events back into the preloader instance.
                    // --
                    // NOTE: The load/error events trigger a $digest.
                    loadImageLocation: function loadImageLocation( imageLocation ) {
 console.log(imageLocation);
                        var preloader = this;
 
                        // When it comes to creating the image object, it is critical that
                        // we bind the event handlers BEFORE we actually set the image
                        // source. Failure to do so will prevent the events from proper
                        // triggering in some browsers.
                        var image = $( new Image() )
                            .load(
                                function( event ) {
 
                                    // Since the load event is asynchronous, we have to
                                    // tell AngularJS that something changed.
                                    $rootScope.$apply(
                                        function() {
 
                                            preloader.handleImageLoad( event.target.src );
 
                                            // Clean up object reference to help with the
                                            // garbage collection in the closure.
                                            preloader = image = event = null;
 
                                        }
                                    );
 
                                }
                            )
                            .error(
                                function( event ) {
 
                                    // Since the load event is asynchronous, we have to
                                    // tell AngularJS that something changed.
                                    $rootScope.$apply(
                                        function() {
 
                                            preloader.handleImageError( event.target.src );
 
                                            // Clean up object reference to help with the
                                            // garbage collection in the closure.
                                            preloader = image = event = null;
 
                                        }
                                    );
 
                                }
                            )
                            .prop( "src", imageLocation )
                        ;
 
                    }
 
                };
 
 
                // Return the factory instance.
                return( Preloader );
 
            }
        );
})();
    