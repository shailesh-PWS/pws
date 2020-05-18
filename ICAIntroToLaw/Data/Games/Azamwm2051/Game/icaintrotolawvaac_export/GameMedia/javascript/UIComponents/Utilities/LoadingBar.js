var LoadingBar = new function(){
      this.show=function(rgba,col){//rgba is background color (rgba), col is spinner color (hex)
          if(!col)col="#000000";
          if(!rgba) rgba = 'rgba(0,0,0,0)';
          $('body').append('<div id="loading-page" style="position:absolute; top:0px; left:0px;width:100%;height:100%; z-index:99999"></div>');
          var opts = {
              lines: 13 // The number of lines to draw
              , length: 28 // The length of each line
              , width: 14 // The line thickness
              , radius: 42 // The radius of the inner circle
              , scale: .5 // Scales overall size of the spinner
              , corners: 1 // Corner roundness (0..1)
              , color: col // #rgb or #rrggbb or array of colors
              , opacity: 0.25 // Opacity of the lines
              , rotate: 0 // The rotation offset
              , direction: 1 // 1: clockwise, -1: counterclockwise
              , speed: 1 // Rounds per second
              , trail: 60 // Afterglow percentage
              , fps: 20 // Frames per second when using setTimeout() as a fallback for CSS
              , zIndex: 2e9 // The z-index (defaults to 2000000000)
              , className: 'spinner' // The CSS class to assign to the spinner
              , top: '50%' // Top position relative to parent
              , left: '50%' // Left position relative to parent
              , shadow: false // Whether to render a shadow
              , hwaccel: false // Whether to use hardware acceleration
              , position: 'absolute' // Element positioning
          }
          $("#loading-page").css({
             backgroundColor:rgba 
          });
          var target = document.getElementById('loading-page')
          var spinner = new Spinner(opts).spin(target);
      }
      this.hide=function(){
           $("#loading-page").remove(); 
      }
}