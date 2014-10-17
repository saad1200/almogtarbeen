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
                    pagerTemplate:"<a href='#'><img src='{{background}}' class='col-md-2 thumbnail'></a>"
                });
            });
        }
    }

})();