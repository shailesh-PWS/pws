/**
 * ...
 * @author Milbert Cale@Playware Studios
 */

var closeOption;
var disableOption;
var menuWidth;
var menuHeight;
var minigameMenuManager = new function(){
    this.populate = function(){
        minigameControl.MenuObject={};
        minigameControl.MenuObject.minigameClass="menu";
        minigameControl.MenuObject.status = "Started";
        minigameControl.MenuObject.name = minigameXmlName;
        minigameControl.MenuObject.title = minigameXMLManager.getName();
        minigameControl.MenuObject.description = minigameXMLManager.getDescription();
        if(!backToMenuBool)
        Log.addAction("menuMinigame",minigameControl.MenuObject);
        
        
        var html="<div id='minigameMenuWrapper'></div>";   
        $("#minigameWrapper").html(html);
        var w=minigameXMLManager.getMenuWidth();
        var h=minigameXMLManager.getMenuHeight();
        var size = minigameXMLManager.getMenuImageSize();
        $("#minigameMenuWrapper").height(h);
        $("#minigameMenuWrapper").width(w);
        
        var scaleMultiplier;
        if(size=="contain"){
            scaleMultiplier = Math.min($("#minigameWrapper").height()/$("#minigameMenuWrapper").height(),$("#minigameWrapper").width()/$("#minigameMenuWrapper").width());
        }
        else{
            scaleMultiplier = Math.max($("#minigameWrapper").height()/$("#minigameMenuWrapper").height(),$("#minigameWrapper").width()/$("#minigameMenuWrapper").width());
        }
        
        menuWidth=w*scaleMultiplier;
        menuHeight=h*scaleMultiplier;
        $("#minigameMenuWrapper").css({
            width:menuWidth,
            height:menuHeight
        });
        
        $("#minigameMenuWrapper").css({
            left:($("#minigameWrapper").width()-$("#minigameMenuWrapper").width())/2,
            top:($("#minigameWrapper").height()-$("#minigameMenuWrapper").height())/2
        });
        
        
        var path = minigameXMLManager.getMenuBG();
        
        if(path!=""){
            $("#minigameMenuWrapper").css({
                backgroundImage:"url("+path+")",
                backgroundSize:size
            });
        }
        
        closeOption = parseInt(minigameXMLManager.getcloseOption());
        disableOption = parseInt(minigameXMLManager.getdisableOption());
        
        var imageAr=minigameXMLManager.getMenuImageArray();
        var div;
        
        for(var i=0;i<imageAr.length;i++){
            div = $("<img src='"+imageAr[i].path+"'/>");
            div.css({
                position:"absolute",
                width:menuWidth*imageAr[i].width,
                height:menuHeight*imageAr[i].height,
                left:menuWidth*imageAr[i].xPos,
                top:menuHeight*imageAr[i].yPos
            });
            $("#minigameMenuWrapper").append(div);
        }
        
        var triggerAr=minigameXMLManager.getMenuTriggerArray();
        
        
        if(triggerQueueManager.previousMenuXML!=""){
            console.log("triggerQueueManager.previousMenuXML:"+triggerQueueManager.previousMenuXML);
            var result = $.grep(triggerQueueManager.objectTriggerArray, function(e){ return e.id == triggerQueueManager.previousMenuXML; });
            if(result.length>0){
                var obj = result[0];
                var ctr=0;
                var ctr1=0;
                console.log("obj previous:"+JSON.stringify(obj));
                for(var i=0;i<obj.ar.length;i++){
                    if(obj.ar[i].status=="1")ctr++;
                    if(obj.ar[i].status=="2")ctr1++;
                }
                console.log(ctr+":"+obj.ar.length);
                console.log(triggerQueueManager.currentMenuXML+":"+triggerQueueManager.currentIndex);
                if(ctr==obj.ar.length){
                    var result = $.grep(triggerQueueManager.objectTriggerArray, function(e){ return e.id == triggerQueueManager.currentMenuXML; });
                    if(result.length>0){
                        var obj = result[0];
                        obj.ar[triggerQueueManager.currentIndex].status = "1";
                    }
                }
                if(ctr1==obj.ar.length){
                    var result = $.grep(triggerQueueManager.objectTriggerArray, function(e){ return e.id == triggerQueueManager.currentMenuXML; });
                    if(result.length>0){
                        var obj = result[0];
                        obj.ar[triggerQueueManager.currentIndex].status = "2";
                    }
                }
            }
        }
        
        var passed=false;
        var allclicked=false;
        var oneClicked=false;
        var onePassed=false;
        if(triggerQueueManager.currentMenuXML!=""){
            var result = $.grep(triggerQueueManager.objectTriggerArray, function(e){ return e.id == triggerQueueManager.currentMenuXML; });
            if(result.length>0){
                var obj = result[0];
                console.log("obj current:"+JSON.stringify(obj));
                var ctr=0;
                var ctr1=0;
                for(var i=0;i<obj.ar.length;i++){
                    if(obj.ar[i].status=="1")ctr++;
                    if(obj.ar[i].clicked)ctr1++;
                }
                if(ctr>=1)onePassed=true;
                if(ctr1>=1)oneClicked=true;
                if(ctr==obj.ar.length)passed=true;
                if(ctr1==obj.ar.length)allclicked=true;
            }
        }
        
        
        console.log("allclicked:"+allclicked)
        for(var i=0;i<triggerAr.length;i++){
            if(triggerAr[i].linkageID!=""){
                div = $("<div></div>");
                div.data("linkageID",triggerAr[i].linkageID);
                div.data("id",i);
                div.css({
                    position:"absolute",
                    width:menuWidth*triggerAr[i].width,
                    height:menuHeight*triggerAr[i].height,
                    left:menuWidth*triggerAr[i].xPos,
                    top:menuHeight*triggerAr[i].yPos,
                    backgroundColor:"blue",
                    opacity:"0"
                });
                
                //Insert each menu trigger in the array
                triggerQueueManager.addObjectTriggerItem(i);
                
                
                
                div.click(function(){
                    minigameMenuManager.executeClickedXMLFile($(this).data("linkageID"));
                    triggerQueueManager.setClickedMinigame($(this).data("id"));
                });
                $("#minigameMenuWrapper").append(div);
                
                var obj = triggerQueueManager.getObjectTriggerItem(i);
                console.log("========================:"+JSON.stringify(triggerQueueManager.objectTriggerArray));
                var w = parseFloat(menuWidth*triggerAr[i].width);
                var h = parseFloat(menuHeight*triggerAr[i].height);
                var xpos = parseFloat(menuWidth*triggerAr[i].xPos);
                var ypos = parseFloat(menuHeight*triggerAr[i].yPos);
                
                if(disableOption==1){
                    console.log("inside:"+obj.id);
                    if(obj.clicked){
                        var mark = $("<img class='markClass' src='images/minigames/pass_icon.png' alt=''/>");
                        mark.css({
                            width:"30",
                            height:"25",
                            left:xpos+(w-30)/2,
                            top:ypos+(h-25)/2
                        });
                        $("#minigameMenuWrapper").append(mark);
                        
                        div.hide();
                    }
                }
                else if(disableOption==2){
                    if(obj.status!=undefined && obj.status=="1"){
                        var mark = $("<img class='markClass' src='images/minigames/pass_icon.png' alt=''/>");
                        mark.css({
                            width:"30",
                            height:"25",
                            left:xpos+(w-30)/2,
                            top:ypos+(h-25)/2
                        });
                        $("#minigameMenuWrapper").append(mark);
                        div.hide();
                    }
                    else if(obj.status!=undefined && obj.status=="2"){
                        var mark = $("<img class='markClass' src='images/minigames/fail_icon.png' alt=''/>");
                        mark.css({
                            width:"25",
                            height:"25",
                            left:xpos+(w-30)/2,
                            top:ypos+(h-25)/2
                        });
                        $("#minigameMenuWrapper").append(mark);
                    }
                }
            }
        }
        $("#minigameWrapper").append($("<img id='closeMenuBtnImg' src='images/minigames/exit_on.png' alt=''/>"));
        minigameMenuManager.setupListener();
        
        $("#minigameMenuWrapper").show();
        $("#minigameWrapper").show();
        
        if(backToMenuBool){
            switch(closeOption)
            {
                case 1: //Close if All trigger is clicked
                    if(allclicked)$("#closeMenuBtnImg").click(); 
                    break;
                case 2: //Close if All trigger is passed.
                    if(passed)$("#closeMenuBtnImg").click();
                    break;
                case 3://Close if atleast 1 is clicked
                    if(oneClicked)$("#closeMenuBtnImg").click();
                    break;
                case 4://Close if atlease 1 is passed
                    if(onePassed)$("#closeMenuBtnImg").click();
                    break;
            }
            
        }
    };
    this.executeClickedXMLFile=function(minigameQueue){
        $("#minigameMenuWrapper").stop().animate({
           top: -$("#minigameMenuWrapper").height()
        },250,function(){
            Content.Minigame(minigameQueue);
        });
    };
    this.setupListener=function(){
        $("#closeMenuBtnImg").click(function(){
            minigameControl.MenuObject.status = "Ended";
            Log.addAction("menuMinigame",minigameControl.MenuObject);
            minigameControl.Array=[];
            var _qid = triggerQueueManager.getStepUpTheQueueData();
            closeNow();
        });
    };
};