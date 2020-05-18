/**
 * ...
 * @author Milbert Cale@Playware Studios
 */

(function ($) {
    $.fn.scrollbar = function(){
        var parentHeight = this.height();
        var contentHeight = this.children().height();
        var offset = contentHeight-parentHeight;
        var gap=0;
        var ctr = 1;
        
        if(offset>0){
            while (offset / ctr > parentHeight - 30) {
                ctr += .2;
            }
            gap = offset / ctr;
        
            this.children().css({
                maxWidth:this.width()-30
            });
            this.append("<div id='scrollbarthumbID'></div>");
            
            $("#scrollbarthumbID").css({
                position:"absolute",
                width:30,
                height:parentHeight-gap,
                backgroundColor:"gray",
                top:0,
                right:0
            });
            $("#scrollbarthumbID").draggable({
                axis:"y",
                containment:"parent"
            });
            $("#scrollbarthumbID").mousemove(function(){
                if (offset>0) {
                        this.children().css({
                            top:-$("#scrollbarthumbID").position().top * (offset / gap)
                        });
                        if ($("#scrollbarthumbID").position().top <= 0) {
                                //pane.y = 0;
                                $("#scrollbarthumbID").css({
                                    top:0
                                });
                        }
                        if ($("#scrollbarthumbID").position().top >= int(parentHeight - gap)) {
                                $("#scrollbarthumbID").css({
                                    top:parentHeight - gap
                                });
                                //pane.y = -scroll.y * (offset / gap);
                        }
                }
                else {
                    this.children().css({
                        top:0
                    });
                }
            });
        }
    };
})(jQuery);