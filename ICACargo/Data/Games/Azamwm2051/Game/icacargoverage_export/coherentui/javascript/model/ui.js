/**
 * ...
 * @author Milbert Cale@Playware Studios
 */

var ui = new function(){
    this.previewImg = function(path){
        $("#minigameWrapper").append("<div id='imgPreviewID'><img src='"+path+"'/><div>Tap to close</span></div>");
        $("#imgPreviewID").click(function(){
            $(this).remove();
        });
        FontUtils.resize("#imgPreviewID div");
    };
 };
