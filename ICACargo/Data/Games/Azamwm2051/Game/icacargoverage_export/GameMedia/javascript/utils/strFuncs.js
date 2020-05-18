/**
 * ...
 * @author Milbert Cale@Playware Studios
 */

var strFuncs = new function() {
    this.arrayRandomize = function(_ar) {
        var ar=[];
        for(var i=0;i<_ar.length;i++){
            ar.push(_ar[i]);
        }
        var temp;
        var rndNum;
        for(var i=0;i<ar.length;i++){
            rndNum=parseInt(Math.random()*ar.length);
            temp = ar[i];
            ar[i] = ar[rndNum];
            ar[rndNum] = temp;
        }
        return ar;
    };
    this.multiplier = function(s,e){
        return e/s;
    };
    this.trimDown = function(str){
        while(str.search(" ")>=0)str = str.replace(" ","");
        return str;
    };
    this.lowerCase = function(str){
        return str.toLowerCase();
    };
    
    this.setImg=function(id,imagepath){
        thisFrame.parent.engine.call("EventCoherentUIBinder.RequestImage","/GameMedia/Minigames/" + imagepath).then(function(data){
            if(data != "") $(id).attr("src",'data:image/png;base64,' + data);
        });
    };
    this.setBGImg=function(id,imagepath){
        thisFrame.parent.engine.call("EventCoherentUIBinder.RequestImage","/GameMedia/Minigames/" + imagepath).then(function(data){
            if(data != "") {
                $(id).css({
                    backgroundImage:"url(data:images/png;base64,"+data+")"
                });
            }
        });
    };
	this.getImgScaleWidthHeight=function(GivenImgWdth,GivenImgHt,ContainerWidth,ContainerHeight,resizeOption){
		var aspectRatioImage = GivenImgWdth/GivenImgHt;
		var aspectRatioWindow = ContainerWidth/ContainerHeight;      
        var imgw;
        var imgh;
        if(resizeOption == "fit"){
            if(aspectRatioWindow > aspectRatioImage)
            {
                imgh = ContainerHeight;
                imgw= ContainerHeight * aspectRatioImage;
            }else{
                imgw = ContainerWidth;
                imgh = ContainerWidth/aspectRatioImage;
            }
        }else{
            if(aspectRatioWindow > aspectRatioImage)
            {
                imgw = ContainerWidth;
                imgh= ContainerWidth/aspectRatioImage;
            }else{
                imgh = ContainerHeight;
                imgw = ContainerHeight*aspectRatioImage;
            }
        }
        var imgScale = new Object();
        imgScale.width = imgw;
        imgScale.height = imgh;
        imgScale.multiplier= imgw/GivenImgWdth;
        debugger;
        return imgScale;
            
    }

    this.log=function(str){
        //return;
        if($("#logWindow").length==0)$("body").append("<div id='logWindow' style='position:absolute;right:0px;top:0px;width:50%;height:100%;background-color:rgba(0,0,0,.5);color:white; overflow-y: auto; z-index:9999999999 !important; pointer-events:none'></div>");
        $("#logWindow").append(str+"<br/>")
    }
};