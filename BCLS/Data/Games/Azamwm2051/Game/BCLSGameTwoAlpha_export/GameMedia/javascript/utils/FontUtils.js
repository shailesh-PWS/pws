var FontUtils = new function(){
    this.resize = function(id){
        var curfontsize = $(id).css("font-size");
        curfontsize = parseInt(curfontsize);
        var fontscale = $("#minigameWrapper").height()/480;
        var newfontsize = Math.round(curfontsize*fontscale);
        $(id).css("font-size",newfontsize);
    }
}