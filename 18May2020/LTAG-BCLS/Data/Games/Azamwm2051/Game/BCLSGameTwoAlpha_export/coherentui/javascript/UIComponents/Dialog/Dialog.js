var gestureTO=0;
var emotionTO=0;
var gestureObj={};
var emotionObj={};
var stopGesture;
var persistentreward="";
var multiplayerreward="";
var reward="";
var multiDialogIdx;
var alreadyHaveHint;
var dialogBGImage;
var dialogBGScale;
var cameraEffect=0;
var cameraFadeDuration;
var cameraFadeColor;
var hidePanel=false;
var dialogCount;
var portrait;
var imagepath;
var myid;
var id;
var who;
var link;
var nick;
var audiofile;
var audiotime;
var gesture;
var gestureLoop;
var gestureTiming;
var gestureTime;
var emotion;
var emotionTiming;
var emotionTime;
var stopEmotion;//not in used atm. just using stopGesture to reset gesture and emotion
var cameraShakeDuration;
var cameraShakeMagnitude;
var cameraBindingFunction;
var shotType;
var cameraPosition;
var cameraRange;
var cameraPanState;
var cameraHeight;
var cameraOffsetX;
var cameraOffsetY;
var cameraOffsetZ;
var cameraDuration;
var dialogMinigame="";
var DialogHistory = new function()
{
    this.conversationhistory = [];
    
    this.addConversationItem = function(type,val)
    {
        DialogHistory.conversationhistory.push({type:type,val:val});
    }
    this.finishConversationItem = function()
    {
        Log.addAction("conversation",this.conversationhistory);
    }
}

var DialogRunner = new function()
{
    //JSON REFACTOR
    this.dialogjson = null;
    this.currentdialogobject = null;
    
	this.dialogxmlobject = null;
	this.currentdialogxmlobject = null;
	this.childindex = 0;
	this.historyarray = new Array();
	this.dialogobject = null;
	this.sound;

	this.resetToStartDialog = function()
	{
		//RESET COUNTER VARIABLES
		DialogRunner.childindex = 0;
		DialogRunner.historyarray = new Array();
        DialogHistory.conversationhistory = [];

		//REMOVE EXISTING CONTENT AND DIALOG
		clearInterval(Dialog.dialoginterval)
		Dialog.dialogtextcounter = 0;
		$("#dialogContent").empty();
        

		//SET TEXT TO NOTHING
		$("#dialogHistoryActive").text("");
		$("#dialogContent").text("");

		//RESET IMAGE
		$("#dialogViewPort").empty();
	}
	this.addToHistoryElement = function(str)
	{
        
	}
	this.updateHistoryVisual = function(type)
	{
        //TODO: MULTIPLE CHOICE SUPPORT
        if(type == "multiple")
        {
            console.log("MULTIPLE CHOICE UPDATE")
            //ADD SELECTED CHOICE
            $("#dialogHistoryActive").text($('.dialogbranchselected').text());
            
            //NEXT STORE THE LAST VALUE TO THE HISTORY PANEL
            DialogRunner.updateAndInsertCurrentHistoryItem(type)
        }
        else
        {
            console.log("SINGLE CHOICE UPDATE")
            
            //FIRST UPDATE THE ACTIVE HISTORY ELEMENT
            $("#dialogHistoryActive").text($('#dialogContent').text());

            //NEXT STORE THE LAST VALUE TO THE HISTORY PANEL
            DialogRunner.updateAndInsertCurrentHistoryItem(type)
        }
		
	}
	this.updateAndInsertCurrentHistoryItem = function(type)
	{
		var str = "";

		//TODO: MULTIPLE CHOICE SUPPORT
        
        var currentSelectedDialog = DialogRunner.childindex;
        if(type == "multiple")
        {
            currentSelectedDialog = DialogRunner.childindex + DialogRunner.multipleChoiceIndex;
        }

            //CHECK WHAT TYPE OF DIALOGUE IT IS
            switch($(Global.tmp[currentSelectedDialog]).attr("who"))
            {
                //THIS IS NON SPECIFIC
                case "0" :

                    str += "<div class='blob dialogBlobCustom'><h4>" + $(Global.tmp[currentSelectedDialog]).attr("nick") + "</h4><p>" + $($(Global.tmp[currentSelectedDialog]).find("text")[0]).text() + "</p></div>";

                break;

                //THIS IS PLAYER CHARACTER
                case "1" :

                    str += "<div class='blob dialogBlobPlayer'><h4>"+Global.playerAvatarName+"</h4><p>" + $($(Global.tmp[currentSelectedDialog]).find("text")[0]).text() + "</p></div>";

                break;

                //THIS IS NON PLAYER CHARACTER
                case "2" :

                    str += "<div class='blob dialogBlobOther'><h4>"+DialogRunner.dialogobject.NpcName+"</h4><p>" + $($(Global.tmp[currentSelectedDialog]).find("text")[0]).text() + "</p></div>";

                break;
            }

            //CHECK IF THERE IS A REWARD
            if($(Global.tmp[currentSelectedDialog]).attr("reward") != "")
            {
             //   str += "<div class='blob dialogBlobReward'><p>You were given a reward.</p></div>";
            }

            //APPEND
            $('.interactionBlock[data-interactionid="' + Dialog.dialogcounterid + '"]').append($(str));

            //SCROLL TO BOTTOM
             $('#dialogHistoryAll').scrollTop(1E10);
		

	}
	this.initiateStartDialog = function(xml)
	{
        dialogBGImage = null;
        //TEMPORARY STORE FOCUS MODE
        Global.tmpFocusMode = Global.focusModeActivated;
        engine.trigger("EventCoherentUIBinder.ChangeMode", false, "dialog");

		//AUTO SCROLL DOWN TO CONVERSATION HISTORY
		 $('#dialogHistoryAll').scrollTop(1E10);

		//SETUP COUNTER ID FOR INTERACTIONS
		if(Dialog.dialogcounterid == -1)
		{
			Dialog.dialogcounterid = 0;
		}
		else
		{
			Dialog.dialogcounterid += 1
		}

		//SETUP DIALOG CHUNK
		var shs = "";
		var date = new Date();
		shs += "<div class='interactionBlock' data-interactionid='" + Dialog.dialogcounterid + "'><h2>Conversation with " + ((DialogRunner.dialogobject.NpcName==null) ? "NPC" : DialogRunner.dialogobject.NpcName) + " at " + date.getHours() + ":" + date.getMinutes() + "</h2><div class='interactionBlockLine'></div></div>"
		$("#dialogHistoryAll").append($(shs));

		DialogRunner.childindex = 0;
		

		//SHOW DIALOG
		Dialog.showPanel(true);

		//ASSIGN XML OBJECT
		DialogRunner.dialogxmlobject = xml;

        
        if(xml != null || xml != undefined || xml != "")
		{
			DialogRunner.dialogjson = $.xml2json(xml);
            console.log(DialogRunner.dialogjson)
        }

		//START DIALOG TRAVERSAL MANAGER
		DialogRunner.currentdialogxmlobject = $(DialogRunner.dialogxmlobject).children()[0];
        
        //JSON REFACTOR
        DialogRunner.currentdialogobject = DialogRunner.dialogjson.dialog;

		DialogRunner.startDialogTraversal();
	}
	this.startDialogTraversal = function()
	{
        if(cameraEffect==1){
            $("#fading-effect-wrapper").css({
                backgroundColor:"rgba("+cameraFadeColor+")"
            });
            if(hidePanel)$("#mainDialogPanel").hide();
            else $("#mainDialogPanel").show();
            $("#fading-effect-wrapper,#mainDialogPanel").fadeIn(1000*cameraFadeDuration,function(){
                $("#fading-effect-wrapper,#dialogActivePanel").unbind().click(function(){
                    $("#mainDialogPanel").hide();
                    $("#fading-effect-wrapper,#dialogActivePanel").unbind();
                    DialogRunner.afterCameraEffects();
                });
            });
        }
        else if(cameraEffect==3){
            $("#fading-effect-wrapper").css({
                backgroundColor:"rgba("+cameraFadeColor+")"
            });
            $("#mainDialogPanel").hide();
            $("#fading-effect-wrapper").fadeIn(1000*cameraFadeDuration/2,function(){
                DialogRunner.afterCameraEffects();
                $("#fading-effect-wrapper").fadeOut(1000*cameraFadeDuration/2,function(){
                    $("#fading-effect-wrapper").css({
                        backgroundColor:"transparent"  
                    })
                })
            })
        }
        else {
            $("#mainDialogPanel").hide();
            DialogRunner.afterCameraEffects();
        }
	}
    
    this.afterCameraEffects=function(){
        cameraEffect=0;
        if(dialogMinigame!=""){
            Dialog.tempClose();
            TriggerManager.initMinigameFromDialog(dialogMinigame);
        }
        else{
            DialogRunner.checkRewards();
        }
    }
    
    this.checkRewards=function(){
        //GIVE THE REWARD
        if(reward!=""){
            DialogHistory.addConversationItem("reward",reward)
            ItemManager.getReward(reward,1,"");
        }
        else if(persistentreward !="")
        {
            DialogHistory.addConversationItem("persistent",persistentreward)
            ItemManager.getPersistentReward(persistentreward,1,"");
        }
        else if(multiplayerreward !="")
        {
            DialogHistory.addConversationItem("multiplayer",multiplayerreward)
            ItemManager.getMultiplayerReward(multiplayerreward,1,"");
        }
        if(gestureObj.gesture!=undefined){
            engine.call("EventCoherentUIBinder.PlayGesture", gestureObj.gesture, gestureObj.targetChar, gestureObj.gestureLoop);   
        }
        if(emotionObj.emotion!=undefined){
            engine.call("EventCoherentUIBinder.PlayEmotions", emotionObj.emotion, emotionObj.targetChar);
        }
		Global.tmp = $(DialogRunner.currentdialogxmlobject).children();

		dialogCount = Global.tmp.length;
		if(Global.tmp[0].tagName=="text"){
			DialogRunner.childindex = 1;
			dialogCount--;
		}
		else{
			DialogRunner.childindex=0;
		}
        
        clearTimeout(gestureTO);
        clearTimeout(emotionTO);
        
		portrait = $(Global.tmp[DialogRunner.childindex]).attr("portrait");
		imagepath = $(Global.tmp[DialogRunner.childindex]).attr("imagepath");
		myid = $(Global.tmp[DialogRunner.childindex]).attr("myid");
		id = $(Global.tmp[DialogRunner.childindex]).attr("id");
		reward = $(Global.tmp[DialogRunner.childindex]).attr("reward");
        persistentreward =  $(Global.tmp[DialogRunner.childindex]).attr("persistentreward");
        multiplayerreward =  $(Global.tmp[DialogRunner.childindex]).attr("multiplayerreward");
		who = $(Global.tmp[DialogRunner.childindex]).attr("who");
		link = $(Global.tmp[DialogRunner.childindex]).attr("link");
		nick = $(Global.tmp[DialogRunner.childindex]).attr("nick");
		audiofile = $(Global.tmp[DialogRunner.childindex]).attr("audiofile");
		audiotime = $(Global.tmp[DialogRunner.childindex]).attr("audiotime");
        gesture = DialogManager.getGesture($(Global.tmp[DialogRunner.childindex]).attr("gesture"));
        gestureLoop = ($(Global.tmp[DialogRunner.childindex]).attr("gestureLoop")=="true")?true:false;
        gestureTiming = $(Global.tmp[DialogRunner.childindex]).attr("gestureTiming");
        gestureTime = $(Global.tmp[DialogRunner.childindex]).attr("gestureTime");
        stopGesture = ($(Global.tmp[DialogRunner.childindex]).attr("stopGesture")=="true")?true:false;
        emotion = DialogManager.getEmotion($(Global.tmp[DialogRunner.childindex]).attr("emotion"));
        emotionTiming = $(Global.tmp[DialogRunner.childindex]).attr("emotionTiming");
        emotionTime = $(Global.tmp[DialogRunner.childindex]).attr("emotionTime");
        stopEmotion = ($(Global.tmp[DialogRunner.childindex]).attr("stopEmotion")=="true")?true:false;//not in used atm. just using stopGesture to reset gesture and emotion
        cameraEffect = parseInt($(Global.tmp[DialogRunner.childindex]).attr("cameraeffect"));
        cameraShakeDuration;
        cameraShakeMagnitude;
        cameraBindingFunction;
        hidePanel = ($(Global.tmp[DialogRunner.childindex]).attr("hidePanel")=="true")?true:false;
        
        if(cameraEffect==1||cameraEffect==3){
            cameraFadeDuration = parseFloat($(Global.tmp[DialogRunner.childindex]).attr("cameraFadeDuration"));
            cameraFadeColor = $(Global.tmp[DialogRunner.childindex]).attr("cameraFadeColor");
        }
        else if(cameraEffect==2){
            cameraFadeDuration = parseFloat($(Global.tmp[DialogRunner.childindex]).attr("cameraFadeDuration"));
        }
        else if(cameraEffect==6){
            cameraBindingFunction="CameraControlBinder.ShakeCamera";
            cameraShakeDuration = parseFloat($(Global.tmp[DialogRunner.childindex]).attr("cameraShakeDuration"));
            cameraShakeMagnitude = parseFloat($(Global.tmp[DialogRunner.childindex]).attr("cameraShakeMagnitude"));
        }
        else if(cameraEffect==7){
            cameraBindingFunction="CameraControlBinder.ShakeRotateCamera";
            cameraShakeDuration = parseFloat($(Global.tmp[DialogRunner.childindex]).attr("cameraShakeDuration"));
            cameraShakeMagnitude = parseFloat($(Global.tmp[DialogRunner.childindex]).attr("cameraShakeMagnitude"));
        }
        
        shotType = $(Global.tmp[DialogRunner.childindex]).attr("shotType");
        if(shotType=="twoshot")shotType="TwoShot";
        else if(shotType=="shoulder")shotType="OTSShot";
        else if(shotType=="target")shotType="TargetShot";
        cameraPosition = $(Global.tmp[DialogRunner.childindex]).attr("cameraPosition");
        if(cameraPosition=="front")cameraPosition="Front";
        else if(cameraPosition=="back")cameraPosition="Back";
        else if(cameraPosition=="left")cameraPosition="Left";
        else if(cameraPosition=="right")cameraPosition="Right";
        cameraRange = $(Global.tmp[DialogRunner.childindex]).attr("cameraRange");
        if(cameraRange=="default")cameraRange="Default";
        else if(cameraRange=="close")cameraRange="CloseRange";
        else if(cameraRange=="mid")cameraRange="MidRange";
        else if(cameraRange=="long")cameraRange="LongRange";
        cameraPanState = $(Global.tmp[DialogRunner.childindex]).attr("cameraPanState");
        if(cameraPanState=="snap")cameraPanState="Snap";
        else if(cameraPanState=="interpolate")cameraPanState="Interpolate";
        cameraHeight = $(Global.tmp[DialogRunner.childindex]).attr("cameraHeight");
        if(cameraHeight=="low")cameraHeight="Low";
        else if(cameraHeight=="eye")cameraHeight="Eye";
        else if(cameraHeight=="high")cameraHeight="High";
        else if(cameraHeight=="birdeye")cameraHeight="BirdsEye";
        cameraOffsetX = ($(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetX")!="")?$(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetX"):0;
        cameraOffsetY = ($(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetY")!="")?$(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetY"):0;
        cameraOffsetZ = ($(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetZ")!="")?$(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetZ"):0;
        cameraDuration = $(Global.tmp[DialogRunner.childindex]).attr("cameraDuration");
        
		//RESET EXISTING PORTRAITE
		engine.call("ScreenCaptureBinder.StopCapture");

        $("#dialogViewPort").hide();
        $("#objectViewPort").hide();
		
        $("#dialogContent").css({
            left:0   
        })
        $("#dialogHistoryActive").css({
            left:0   
        })
        
        if(imagepath != undefined && imagepath != "")
        {
            if(who == "1" || who=="2")
            {
                // $("#dialogViewPort").attr("src",encodeURI("Conversation/" + imagepath));
                // $("#dialogViewPort").css({
                //     width:$(document).innerHeight()*.25,
                //     height:"auto"
                // });
                
                // $("#dialogContent").css({
                //     left:$("#dialogViewPort").width()
                // })
                // $("#dialogHistoryActive").css({
                //     left:$("#dialogViewPort").width()   
                // })
                
                // $("#dialogViewPort").show();


                // $("#dialogViewPort").css({
                //     backgroundImage:"url(" + encodeURI("Conversation/" + imagepath) + ")",
                // });
                $("#dialogContent").hide();
                $("#dialogViewPort").css({
                    backgroundImage:"url(" + encodeURI("Conversation/" + imagepath) + ")",
                    width:$(document).innerHeight()*.25,
                });

                $("#dialogViewPort").show();
                $("#dialogViewPort").data("img","Conversation/" + imagepath);
                TweenMax.from($('#dialogViewPort'),.250,{left:"-100%",opacity:0, onComplete:this.setDialogContentPosition});
                $("#dialogViewPort").off('click').on("click",function(){
                    var img =$(this).data("img");
                    DialogManager.previewImg(img);
                });
            }
            else
            {
                $("#dialogContent").hide();              
                $("#objectViewPort").css({
                    backgroundImage:"url(" + encodeURI("Conversation/" + imagepath) + ")",
                });
                $("#objectViewPort").show();
                $("#objectViewPort").data("img","Conversation/" + imagepath);
                TweenMax.from($('#objectViewPort'),.250,{left:"-100%",opacity:0, onComplete:this.setObjectViewDialogContentPosition});
                $("#objectViewPort").off('click').on("click",function(){
                    var img =$(this).data("img");
                    DialogManager.previewImg(img);
                });
            }

        }
		
        
        //Implementing Camera Effect
        if(cameraEffect!=""&&cameraEffect!=0&&cameraEffect!=1&&cameraEffect!=3){
            if(cameraEffect==2){
                $("#fading-effect-wrapper").fadeOut(cameraFadeDuration*1000,function(){
                    $("#fading-effect-wrapper").css({
                        backgroundColor:"transparent"  
                    })
                    DialogRunner.continueDialog();   
                });
            }
            else if(cameraEffect==6){
                engine.call(cameraBindingFunction,cameraShakeDuration,cameraShakeMagnitude);
                DialogRunner.continueDialog();
            }
            else DialogRunner.continueDialog();
        }
        else DialogRunner.continueDialog();
    }

    this.setObjectViewDialogContentPosition = function(){
        debugger;
        $("#dialogContent").show();
        $("#dialogContent").css({
            left:$("#objectViewPort").width()
        });
        $("#dialogHistoryActive").css({
            left:$("#objectViewPort").width()   
        });
    }

    this.setDialogContentPosition = function(){
        $("#dialogContent").show();
        $("#dialogContent").css({
            left:$("#dialogViewPort").width()
        });
        $("#dialogHistoryActive").css({
            left:$("#dialogViewPort").width()   
        });
    }
    
    this.continueDialog = function(){
        var targetChar = null;
        var notTargetChar=null;
        if(who=="1")
        {
            if(Global.playerAvatarInstanceID != null)targetChar = Global.playerAvatarInstanceID;
            if(DialogRunner.dialogobject.NpcInstanceID != null)notTargetChar = DialogRunner.dialogobject.NpcInstanceID;
        }
        else if(who=="2")
        {
            if(DialogRunner.dialogobject.NpcInstanceID != null)targetChar = DialogRunner.dialogobject.NpcInstanceID;
            if(Global.playerAvatarInstanceID != null)notTargetChar = Global.playerAvatarInstanceID;
        }

        emotionObj={};
        gestureObj = {};
        if(gesture!="" && gesture!=null){
            if(gestureTiming==0)engine.call("EventCoherentUIBinder.PlayGesture", gesture, targetChar, gestureLoop);
            else if(gestureTiming==1){
                gestureObj.gesture = gesture;
                gestureObj.targetChar = targetChar;
                gestureObj.gestureLoop = gestureLoop;

            }
            else gestureTO = setTimeout(function(){
                engine.call("EventCoherentUIBinder.PlayGesture", gesture, targetChar, gestureLoop);
            },gestureTime*1000);
        }
        if(emotion!="" && emotion!=null){
            if(emotionTiming==0)engine.call("EventCoherentUIBinder.PlayEmotions", emotion, targetChar);
            else if(emotionTiming==1){
                emotionObj.emotion = emotion;
                emotionObj.targetChar = targetChar;
            }
            else emotionTO = setTimeout(function(){
                engine.call("EventCoherentUIBinder.PlayEmotions", emotion, targetChar);
            },emotionTime*1000); 
        }

        if(shotType!=""&&shotType!=null){
            engine.call("CameraControlBinder.SwitchToMachinima", shotType+"|"+cameraPanState, targetChar+"|"+notTargetChar,cameraPosition+"|"+cameraRange+"|"+cameraHeight,cameraDuration+"|"+cameraOffsetX+"|"+cameraOffsetY+"|"+cameraOffsetZ);
        }

        var usePreviousBG=($(Global.tmp[DialogRunner.childindex]).attr("usePreviousBG")=="true")?true:false;
        if(!usePreviousBG){
            dialogBGImage=$(Global.tmp[DialogRunner.childindex]).attr("bgImage");
            if(dialogBGImage==undefined || dialogBGImage=="")dialogBGImage=null;
            dialogBGScale=$(Global.tmp[DialogRunner.childindex]).attr("scale");
            if(dialogBGScale=="fit")dialogBGScale="contain";
            else dialogBGScale="cover";
        }
        var bgTransparent = ($(Global.tmp[DialogRunner.childindex]).attr("bgTransparent")=="false")?false:true;
        var bgColor=$(Global.tmp[DialogRunner.childindex]).attr("bgColor");
        if(bgColor==undefined || bgColor=="")bgColor="rgba(0,0,0,1)";

        if(dialogBGImage){
            $("#dialog-bg-wrapper").css({
                backgroundImage:"url(Conversation/"+dialogBGImage+")",
                backgroundSize:dialogBGScale
            });
        }
        else{
            $("#dialog-bg-wrapper").css({
                backgroundImage:"none"
            });   
        }

        if(!bgTransparent){
            $("#dialog-bg-wrapper").css({
                backgroundColor:bgColor 
            });
        }
        else{
            $("#dialog-bg-wrapper").css({
                backgroundColor:"rgba(0,0,0,.05)"
            }); 
        }

        if(dialogCount==1)
        { 
            var panelColor=$(Global.tmp[DialogRunner.childindex]).attr("panelColor");
            if(panelColor==undefined || panelColor=="")panelColor="rgba(0,0,0,0.8)";
            var textColor=$(Global.tmp[DialogRunner.childindex]).attr("textColor");
            if(textColor==undefined || textColor=="")textColor="rgba(255,255,255,0.8)";
            var textAlign=$(Global.tmp[DialogRunner.childindex]).attr("textAlign");
            if(textAlign==undefined || textAlign=="")textAlign="left";
            var hidePanel=$(Global.tmp[DialogRunner.childindex]).attr("hidePanel");
            hidePanel = (hidePanel==undefined)?false:(hidePanel=="true")?true:false;
            
            var textAnimate = $(Global.tmp[DialogRunner.childindex]).attr("textAnimate");
            textAnimate = (textAnimate==undefined)?true:(textAnimate=="true")?true:false;
            
            var score =$(Global.tmp[DialogRunner.childindex]).attr("score");
            if(score!=undefined)ItemManager.getDialogScore(Number(score));
            
            dialogMinigame = $(Global.tmp[DialogRunner.childindex]).attr("minigame");
            if(dialogMinigame==undefined)dialogMinigame="";
            $("#dialogContentPanel").css({
                backgroundColor:panelColor,
                backgroundImage:"none"
            }) 

            $("#dialogContent").css({
                color:textColor,
                textAlign:textAlign
            })
            if(hidePanel)$("#mainDialogPanel").hide();
            else $("#mainDialogPanel").show();

            $('.tapStatusMessage').text('tap to continue');

            DialogHistory.addConversationItem("conversation",{type:"single",id:id,name:DialogRunner.dialogobject.URI})

            //WRITE TO CONTENT
            if(who=="0")
            {
                if(nick != "" && nick!=" ")
                {
                    Dialog.writeSingleDialogToContent(nick,DialogRunner.currentdialogobject.text[0],textAnimate);
                }
                else
                {
                    Dialog.writeSingleDialogToContent("",DialogRunner.currentdialogobject.text[0],textAnimate);
                }
            }
            else if(who=="1")
            {
                if(nick != "" && nick!=" ")
                {
                    Dialog.writeSingleDialogToContent(nick,DialogRunner.currentdialogobject.text[0],textAnimate);
                }
                else if(nick == " "){
                    Dialog.writeSingleDialogToContent("",DialogRunner.currentdialogobject.text[0],textAnimate);
                }
                else
                {
                    Dialog.writeSingleDialogToContent(Global.playerAvatarName,DialogRunner.currentdialogobject.text[0],textAnimate);
                }
            }
            else
            {
                if(nick != "" && nick!=" ")
                {
                    Dialog.writeSingleDialogToContent(nick,DialogRunner.currentdialogobject.text[0],textAnimate);
                }
                else if(nick == " "){
                    Dialog.writeSingleDialogToContent("",DialogRunner.currentdialogobject.text[0],textAnimate);
                }
                else
                {
                    Dialog.writeSingleDialogToContent(DialogRunner.dialogobject.NpcName,DialogRunner.currentdialogobject.text[0],textAnimate);
                }
            }

            //PLAY THE SOUND
            if(audiofile != "")
            {
                SoundPlayer.PlaySoundFile("dialog",audiofile)
            }

            $("#dialogActivePanel,#dialog-bg-wrapper").unbind().click(function(){
                DialogRunner.gotoNextDialog();
            });

        }
        else if(dialogCount>1)
        {
            var str = "";

            $('.tapStatusMessage').text('double tap a selection to continue');

            //Remove the click listener to allow for multiple selection
            $("#dialogActivePanel").unbind();

            //Clear the content
            $('#dialogContent').empty();

            //Generate Multiple Choices       
            $('#mainDialogPanel').hide();

            var html = "<div id='multiSelectionPanel'>";
            multiDialogIdx=0;
            alreadyHaveHint=false;
            for(var i = 0; i < DialogRunner.currentdialogobject.length; i++){
                html+=Dialog.generateMultipleChoiceDialog(DialogRunner.currentdialogobject[i],i);
            }
            html+="<div id='viewFinderMultiSelection'></div>";
            html+="</div>";

            $("body").append(html);

            if(alreadyHaveHint){
                $("body").append($(".hintClass"));
                $("body").append("<img src='images/icons/hint.png' id='hintImg'/>");
            }
            $("#hintImg").unbind().click(function(){
                // if($(".hintClass").css("display")=="none")$(".hintClass").fadeIn(50);
                //else $(".hintClass").fadeOut(50);
            });

            var w = $("#multiSelectionPanel").width()-$(".multiDialogContentClass").width()*2 + 5;
            $("#viewFinderMultiSelection").css({
                width:  w,
                height: w,
                left:($("#multiSelectionPanel").width()-w)/2,
                top:($("#multiSelectionPanel").height=w)/2,
                borderRadius:($("#multiSelectionPanel").width()-$(".multiDialogContentClass").width()*2 + 5)/2
            });

            if(imagepath != undefined && imagepath != "")
            {
                $("#viewFinderMultiSelection").css({
                    backgroundImage:"url(" + encodeURI("Conversation/" + imagepath) + ")"
                });
            }

            $(".multiDialogContentClass").unbind().click(Dialog.confirmMultipleChoice);
        }
        else
        {
            var str = "";

            //CHECK IF THERE IS A REWARD
            str += "<div class='blob dialogBlobFinished'><p>You finished the conversation flow.</p></div>";

            //APPEND
            $('.interactionBlock[data-interactionid="' + Dialog.dialogcounterid + '"]').append($(str));

            //DIALOG FINISHED
            DialogHistory.addConversationItem("dialogend","usercompleted")
            DialogHistory.finishConversationItem();

            if(stopGesture){
                if(DialogRunner.dialogobject.NpcInstanceID != null)
                {
                    engine.call("EventCoherentUIBinder.ResetGestureNEmotion", DialogRunner.dialogobject.NpcInstanceID);
                }
            }
            engine.call("EventCoherentUIBinder.ResetGestureNEmotion", Global.playerAvatarInstanceID);
            //CLOSE DIALOG
            Dialog.close();
        }
    }
	this.gotoNextDialog=function(){
        $("#dialogActivePanel,#dialog-bg-wrapper").unbind();
        console.log("DIALOG ACTIVE PANEL")

        $("#dialog-bg-wrapper").css({
            backgroundColor:"rgba(0,0,0,.05)",
            backgroundImage:"none"
        });  
        //SET LAST SELECTION OR TEXT TO LAST AND HISTORY PANEL
        //NEED TO TAKE INTO CONSIDERATION CHOICE AND SINGLE ENTITIES
        DialogRunner.updateHistoryVisual("single");

        //SETUP THE NEW CHILD ELEMTNS
        if(Global.tmp.length>1)
        {
            DialogRunner.currentdialogxmlobject = Global.tmp[1];
        }
        else
        {
            DialogRunner.currentdialogxmlobject = Global.tmp[0];   
        }

        //UPDATE THE OBJECT
        if(DialogRunner.currentdialogobject.dialog)DialogRunner.currentdialogobject = DialogRunner.currentdialogobject.dialog;

        //TRAVERSE AND DISPLAY NEXT CHILD ELEMENTS
        DialogRunner.startDialogTraversal();
    }
}
var Dialog = new function()
{

	this.historyfocused = false;
	this.firstrun = true;
	this.testtext = "This is a test"
	this.timefortextinmiliseconds = 3000;
	this.dialogtextcounter = 0;
	this.dialoginterval;
	this.dialogcounterid = -1;

	//CURRENT DIALOG VARIABLES
	this.currentdialogxml = null;
    
    this.generateMultipleChoiceDialog = function(data,currentDialogIndex)
    {
        reward = data.reward;
        persistentreward = data.persistentreward;
        multiplayerreward = data.multiplayerreward;
        var dialogid=data.id;
        var hint=(data.hint=="false")?false:true;
        var html="";
        var style="";
        if(data.panelColor!="" && data.panelColor!=undefined)style = "style='background-color:"+data.panelColor;
        if(data.textColor!="" && data.textColor!=undefined){
            if(style=="")style = "style='color:"+data.textColor;
            else style+=";color:"+data.textColor;
        }
        if(data.textAlign!="" && data.textAlign!=undefined){
            if(style=="")style = "style='text-align:"+data.textAlign;
            else style+=";text-align:"+data.textAlign;
        }
        if(style!="")style+="'";
        
        var score =data.score;
        if(score==undefined)score=0;
        
        var minigame = data.minigame;
        if(minigame==undefined)minigame="";
        
        if((data.text[0] != '') && (data.text[0] != undefined))
        {
            if(hint && !alreadyHaveHint){
                html+="<div class='multiDialogContentClass hintClass' "+style+" minigame='"+minigame+"' score='"+score+"' multiplayerreward='"+multiplayerreward+"' persistentreward='"+persistentreward+"' reward='"+reward+"' id='multiDialogContentHint' current-dialogindex='" + currentDialogIndex + "' data-dialogindex=0' dialogid='"+dialogid+"'><div>"+data.text[0]+"</div></div>";
                alreadyHaveHint=true;
            }
            else {
                html+="<div class='multiDialogContentClass' "+style+" minigame='"+minigame+"' score='"+score+"' multiplayerreward='"+multiplayerreward+"' persistentreward='"+persistentreward+"' reward='"+reward+"' id='multiDialogContent"+multiDialogIdx+"' current-dialogindex='" + currentDialogIndex + "' data-dialogindex=0' dialogid='"+dialogid+"'><div>"+data.text[0]+"</div></div>";
                multiDialogIdx++;
            }
        }
        return html;
    }
    this.selectMultipleChoice = function()
    {
        //Reset All Multiple Choice
        $('.dialogbranch').unbind().unbind().click(Dialog.selectMultipleChoice);
        $('.dialogbranchtext').removeClass('dialogbranchselected')
        
        //Unbind Listener for Selected Option and Add New Selection Listener
        $(this).unbind().click(Dialog.confirmMultipleChoice).find('.dialogbranchtext').addClass('dialogbranchselected')
    }
    this.confirmMultipleChoice = function(e)
    {
        //Confirm and Process
        e.stopPropagation();
        console.log("CONFIRMED: " + $(this).attr("current-dialogindex") + "::" + $(this).attr("data-dialogindex"));

        var currentSelectedRow = parseInt($(this).attr("current-dialogindex"));
        
        console.log("currentSelectedRow:"+currentSelectedRow);
        DialogRunner.multipleChoiceIndex = currentSelectedRow;
        var selectedDialog = parseInt($(this).attr("data-dialogindex"));
        var currentSelectedDialog = DialogRunner.currentdialogobject[currentSelectedRow];
        var currentSelectedText = currentSelectedDialog.text[selectedDialog];
        
        //NEED TO TAKE INTO CONSIDERATION CHOICE AND SINGLE ENTITIES
        DialogRunner.updateHistoryVisual("multiple");

        DialogRunner.currentdialogobject = currentSelectedDialog.dialog;
        console.log("updated current object")
        console.log(DialogRunner.currentdialogobject)
        
        //SETUP THE NEW CHILD ELEMTNS
        if(Global.tmp.length>1)DialogRunner.currentdialogxmlobject = Global.tmp[currentSelectedRow + 1];
        else DialogRunner.currentdialogxmlobject = Global.tmp[0];
        
        $('#mainDialogPanel').show();
        $("#multiSelectionPanel").remove();
        //TRAVERSE AND DISPLAY NEXT CHILD ELEMENTS
        
        reward = $(this).attr("reward");
        persistentreward = $(this).attr("persistentreward");
        multiplayerreward = $(this).attr("multiplayerreward");
        if(reward!=""){
            DialogHistory.addConversationItem("reward",reward)
            ItemManager.getReward(reward,1,"");
            reward="";
        }
        else if(persistentreward!=""){
            DialogHistory.addConversationItem("persistentreward",persistentreward)
            ItemManager.getPersistentReward(persistentreward,1,"");
            persistentreward="";
        }
        else if(multiplayerreward!=""){
            DialogHistory.addConversationItem("multiplayerreward",multiplayerreward)
            ItemManager.getMultiplayerReward(multiplayerreward,1,"");
            multiplayerreward="";
        }
        
        var score = $(this).attr("score");
        if(score.toString()!="0")ItemManager.getDialogScore(Number(score));
        
        var id = $(this).attr("dialogid");
        
        var minigame = $(this).attr("minigame");
        if(minigame!="")dialogMinigame = minigame;
        
        DialogHistory.addConversationItem("conversation",{type:"multiple",id:id,name:DialogRunner.dialogobject.URI})
        
        $(".hintClass").remove();
        $("#hintImg").remove();
        setTimeout(DialogRunner.startDialogTraversal,250);
    }
	this.startDialogFromXML = function(dialogobj)
    {
        //RESET DIALOG
		DialogRunner.resetToStartDialog();
        
		DialogRunner.dialogobject = dialogobj;

        DialogHistory.addConversationItem("dialogstart",DialogRunner.dialogobject.URI);

        //This had to change due to IOS causing a fus
        Utils.getXMLFromFile("/GameMedia/Conversation/"+DialogRunner.dialogobject.URI,Dialog.dialogXmlObjectRecieved);

	}
	this.dialogXmlObjectRecieved = function(obj)
	{
        console.log("doc====>" + obj);
		DialogRunner.initiateStartDialog(obj);
	}
	this.updatePanelSize = function()
	{
		
	}
	this.initSkeleton = function()
	{
		buildInitialDialogSkeleton();

        engine.call("CharacterStatBindings.GetPlayerInstanceIDAndName").then(function(obj){

            Global.playerAvatarInstanceID = obj.InstanceID;
            Global.playerAvatarName = obj.Name;

            console.log(obj.InstanceID + " :: " + obj.Name);
        })
		

		this.firstrun = false;
	}
	this.showPanel = function(bool)
	{
		if(bool)
		{

			//ALERT INITIAL WIDTHS
			$("#mainDialogPanel").css({
				display:"inline"
			});
		}
		else
		{
			$("#mainDialogPanel").css({
				display:"none"
			});
		}
	}
	this.togglePanel = function()
	{
		$("#mainDialogPanel").toggle();
	}
	this.updatepositions = function(){

        console.log($('#mainDialogPanel').innerHeight());
		if(Dialog.historyfocused == false && Dialog.firstrun == false)
		{
			$('#dialogHistoryPanel').css({
				height: $('#mainDialogPanel').innerHeight() - 150
			})
            
		}
		else if(Dialog.historyfocused == true && Dialog.firstrun == false)
		{
			
			$('#dialogHistoryPanel').css({
				height: $('#mainDialogPanel').innerHeight() - 150
			})
		}
		else
		{
			$('#dialogContentPanel').css({
				left: $('#dialogViewPort').width()
			})
		}
	}
	this.toggleHistoryFocus = function()
	{
		if(Dialog.historyfocused == false)
		{
			TweenMax.from($('#dialogHistoryAll'),.25,{height:0,onComplete:Dialog.toggleDialogHistory});
            $('#dialogHistoryAll').append($("#dialogHistoryFocusButton"));
            $("#dialogHistoryFocusButton").css("position","fixed");
			$("#dialogHistoryAll").show();
			$("#dialogHistoryActive").hide();
			$("#dialogHistoryFocusButton img").attr('src','images/menuicons/close_off.png')
		}
		else
		{
			TweenMax.to($('#dialogHistoryAll'),.25,{height:"25%",onComplete:Dialog.toggleDialogHistory});
            $("#dialogHistoryFocusButton").css("position","absolute");
			$("#dialogHistoryActive").show();
			$("#dialogHistoryFocusButton img").attr('src','images/menuicons/open_off.png')
		}
	}
	this.toggleDialogHistory = function()
	{
        if(Dialog.historyfocused == false){
            Dialog.historyfocused=true;
        }
        else{
            Dialog.historyfocused=false;
            $("#dialogHistoryAll").fadeOut(250,function(){
                $('#dialogContentPanel').append($("#dialogHistoryFocusButton"));
                $('#dialogHistoryAll').css({
                   height:"100%" 
                });   
            });
        }
	}
	this.writeSingleDialogToContent = function(nickname,str,textAnimate)
	{
		//REMOVE EXISTING CONTENT AND DIALOG
		clearInterval(Dialog.dialoginterval)
		Dialog.dialogtextcounter = 0;
		$("#dialogContent").empty();
        if(str==undefined&&dialogMinigame!=""){
            DialogRunner.gotoNextDialog();
            return;
        }
        else if(str==undefined)return;
        //FIRST SEPERATE THE STRING INTO AN ARRAY OF SPACES
        //SETUP INTERVAL TIME
        if(!textAnimate){
            if(nickname!="")$("#dialogContent").html(nickname+": "+str);
            else $("#dialogContent").html(str);
            return;
        }
        
        var intervaltime = 20;
        Dialog.dialoginterval = setInterval(function(){
            if(Dialog.dialogtextcounter<str.length){
                if(str.charAt(Dialog.dialogtextcounter)=="<"){
                    var loop=true;
                    while(loop){
                        if(str.charAt(Dialog.dialogtextcounter)!=">"){
                            if(Dialog.dialogtextcounter-1<str.length){
                                Dialog.dialogtextcounter++;
                            }
                            else loop=false;
                        }
                        else loop=false;
                    }
                }
                if(str.charAt(Dialog.dialogtextcounter)=="&"){
                    var loop=true;
                    while(loop){
                        if(str.charAt(Dialog.dialogtextcounter)!=" "){
                            if(Dialog.dialogtextcounter-1<str.length){
                                Dialog.dialogtextcounter++;
                            }
                            else loop=false;
                        }
                        else loop=false;
                    }
                }
                if(nickname!="")$("#dialogContent").html(nickname+": "+str.substr(0,Dialog.dialogtextcounter+1));
                else $("#dialogContent").html(str.substr(0,Dialog.dialogtextcounter+1));
                Dialog.dialogtextcounter++;
            }
            else {
                clearInterval(Dialog.dialoginterval);
            }
        },intervaltime);
	}
    this.convertHtml=function(str){//Add the html code convertion here.
        while(str.indexOf("<font-color=")>=0)str = str.replace("<font-color=","<font color=");
        return str;
    }
	this.generateDialogHistory = function()
	{
		var str = "";

		str += "<h3>Dialog History</h3>"

		//ADD ONE BLOCK
		for(var i=0; i<1;i++)
		{
			str += "<div class='interactionBlock'>";

				str += "<h2>Conversation with John at 12:22am</h2>";
				str += "<div class='interactionBlockLine'/>";

				str += "<div class='blob dialogBlobPlayer'>"
					str += "<h4>player</h4>"
					str += "<p>this is some text from the player<br/>with a line and <b>also</b> styled text</p>"
				str += '</div>'

				str += "<div class='blob dialogBlobOther'>"
					str += "<h4>non player character</h4>"
					str += "<p>this is some text from the player</p>"
				str += '</div>'

				str += "<div class='blob dialogBlobCustom'>"
					str += "<h4>customized character</h4>"
					str += "<p>this is some text created by the customized character</p>"
				str += '</div>'

				str += "<div class='blob dialogBlobChoice'>"
					str += "<h4>player choice</h4>"
					str += "<div class='dialogBlobChoiceBlock'><p>I went to the corner store to find some awesome fish</p></div>"
					str += "<div class='dialogBlobChoiceBlock'><p>I really tried to look around but could not find any</p></div>"
					str += "<div class='dialogBlobChoiceBlockSelected'><p>blah blah blha blha sadkjsakd ad asd sa dd f dsf sd f ad f asdf a flag lldfg adlf g sdfsf</p></div>"
					str += "<div class='dialogBlobChoiceBlock'><p>selection d</p></div>"
				str += '</div>'

				str += "<div class='blob dialogBlobPlayer'>"
					str += "<h4>player</h4>"
					str += "<p>" + Dialog.testtext + "</p>"
				str += '</div>';

			str += "</div>";
		}

		$("#dialogHistoryAll").empty().append($(str));

	}
	this.close = function(){
        
        //STORE COMPLETE
        $("#dialogViewPort").hide();
        $("#objectViewPort").hide();
        $("#dialog-bg-wrapper").css({
            backgroundColor:"rgba(0,0,0,.05)",
            backgroundImage:"none"
        });  
		//IF ANY SOUND
		SoundPlayer.stopDialogAudio();

		//HIDE PANEL
		Dialog.showPanel(false);

		//CALL END INTERACTION
		engine.call("EventCoherentUIBinder.EndInteraction");
        
        //CALL LAST FOCUS MODE
        engine.trigger("EventCoherentUIBinder.ChangeMode", Global.tmpFocusMode, "gameon");

		//CALL STOP CAPTURE FUNCTION
		try{
			engine.call("ScreenCaptureBinder.StopCapture");
		}catch(err)
		{
			//alert("ISSUE")
		}
        
        //STOP VIEW MODE
        TriggerState.ViewMode = false;
        dialogMinigame="";
        reward="";
        persistentreward="";
        multiplayerreward="";
	}
    this.tempClose = function(){
        //STORE COMPLETE
        $("#dialogViewPort").hide();
        $("#objectViewPort").hide();
        $("#dialog-bg-wrapper").css({
            backgroundColor:"rgba(0,0,0,.05)",
            backgroundImage:"none"
        }); 
		//IF ANY SOUND
		SoundPlayer.stopDialogAudio();

		//HIDE PANEL
		Dialog.showPanel(false);
    }
    this.backToDialog=function(){
        dialogMinigame="";
        Dialog.showPanel(true);
        DialogRunner.startDialogTraversal();
    }
}

function buildInitialDialogSkeleton()
{
	var str = "";
    str += "<div id='dialog-bg-wrapper'></div>"
    str += "<div id='fading-effect-wrapper'></div>"
	str += "<div id='mainDialogPanel'>"
		str += "<div id='dialogContentPanel'>"
			//HISTORY PANEL
			str += "<div id='dialogHistoryPanel'>"

				str += "<div id='dialogHistoryActive'></div>"

			str += "</div>"
			
			//ACTIVE PANEL
			str += "<div id='dialogActivePanel'>";
				
				str += "<div id='dialogContent'>dialog content</div>";
    
                str += "<div class='tapStatusMessage'>tap to continue</div>"

				str += "<div id='dialogExitButton'><img src='images/menuicons/exit_off.png'></div>"
				
			str += "</div>"
            str += "<div id='dialogHistoryFocusButton'><img src='images/menuicons/open_off.png'></div>"
        str += "</div>"
        str += "<div id='objectViewPort'></div>"
        str += "<div id='dialogViewPort'></div>"
	str += "</div>";
    str += "<div id='dialogHistoryAll'><h3>Dialogue History</h3></div>"

	var ele = $(str);

	$('body').append(ele)

	intiateMainDialogListeners();
	//TESTING DOTDOTDOT
	$("#dialogHistoryActive").dotdotdot({
		ellipsis	: '... ',
		wrap		: 'word'
	});
}
function intiateMainDialogListeners()
{
	$('#dialogHistoryFocusButton').unbind().click(function(){
		Dialog.toggleHistoryFocus();
	});
	$("#dialogExitButton").unbind().click(function(){

		event.stopPropagation();

		var str = "";
        
        //Dialog prematuraly ended
        DialogHistory.addConversationItem("dialogend","userstopped")
        DialogHistory.finishConversationItem();

		//CHECK IF THERE IS A REWARD
		str += "<div class='blob dialogBlobClosed'><p>You stopped the conversation.</p></div>";

		//APPEND
		$('.interactionBlock[data-interactionid="' + Dialog.dialogcounterid + '"]').append($(str));
		
        if(Global.playerAvatarInstanceID != null)
        {
            engine.call("EventCoherentUIBinder.ResetGestureNEmotion", Global.playerAvatarInstanceID);
        }

        if(DialogRunner.dialogobject.NpcInstanceID != null)
        {
            engine.call("EventCoherentUIBinder.ResetGestureNEmotion", DialogRunner.dialogobject.NpcInstanceID);
        }
		//CLOSE THE DIALOG
		Dialog.close();
	});
}