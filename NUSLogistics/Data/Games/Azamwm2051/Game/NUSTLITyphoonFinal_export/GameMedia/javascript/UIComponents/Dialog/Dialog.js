var gestureTO=0;
var emotionTO=0;
var gestureObj={};
var emotionObj={};
var dialogCount;
var who;
var targetChar;
var notTargetChar;
var stopGesture;
var reward="";
var persistentreward="";
var multiplayerreward="";
var multiDialogIdx;
var alreadyHaveHint;
var dialogBGImage;
var dialogBGScale;
var cameraEffect=0;
var cameraFadeDuration;
var cameraFadeColor;
var hidePanel=false;
var dialogMinigame="";
var DialogHistory = new function()
{
    this.conversationhistory = [];
    
    this.addConversationItem = function(type,val)
    {
        DialogHistory.conversationhistory.push({type:type,val:val});
    }
    this.finishConversationItem = function(callback)
    {
        Log.addAction("conversation",this.conversationhistory,callback);
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
            //ADD SELECTED CHOICE
            $("#dialogHistoryActive").text($('.dialogbranchselected').text());
            
            //NEXT STORE THE LAST VALUE TO THE HISTORY PANEL
            DialogRunner.updateAndInsertCurrentHistoryItem(type)
        }
        else
        {
            
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
               // str += "<div class='blob dialogBlobReward'><p>You were given a reward.</p></div>";
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
        }

		//START DIALOG TRAVERSAL MANAGER
		DialogRunner.currentdialogxmlobject = $(DialogRunner.dialogxmlobject).children()[0];
        
        //JSON REFACTOR
        DialogRunner.currentdialogobject = DialogRunner.dialogjson.dialog;

		DialogRunner.startDialogTraversal();
	}
	this.startDialogTraversal = function()
	{
        //GIVE THE REWARD
        DialogRunner.stopAudio();
	}
    this.stopAudio=function(){
        VuplexManager.StopDialog("DialogRunner.playGesture");
    }
    this.playGesture = function(){
		if(gestureObj.gesture!=undefined){
            VuplexManager.PlayGesture(gestureObj.gesture,gestureObj.targetChar,gestureObj.gestureLoop,"DialogRunner.playEmotion");
        }
        else DialogRunner.playEmotion();
    }
	this.playEmotion=function(){
        if(emotionObj.emotion!=undefined){
            VuplexManager.PlayEmotions(gestureObj.emotion,gestureObj.targetChar,"DialogRunner.afterPlayEmotions");
        }
        else DialogRunner.afterPlayEmotions(); 
    }
    this.afterPlayEmotions=function(){
        if(dialogMinigame!=""){
            Dialog.tempClose();
        }
        else{
            DialogRunner.parseDialogObject();
        }
    }
    this.parseDialogObject = function(){
        Global.tmp = $(DialogRunner.currentdialogxmlobject).children();

		dialogCount = Global.tmp.length;
		if(Global.tmp[0].tagName=="text"){
			DialogRunner.childindex = 1;
			dialogCount--;
		}
		else{
			DialogRunner.childindex=0;
		}
        
        
        if(dialogCount==0){
			var str = "";
			//CHECK IF THERE IS A REWARD
			str += "<div class='blob dialogBlobFinished'><p>You finished the conversation.</p></div>";
			//APPEND
			$('.interactionBlock[data-interactionid="' + Dialog.dialogcounterid + '"]').append($(str));
            
            //DIALOG FINISHED
            DialogHistory.addConversationItem("dialogend","usercompleted")
            DialogHistory.finishConversationItem("DialogRunner.stopNPCAnimation");
            //CLOSE DIALOG
            return;
		}  
        
        clearTimeout(gestureTO);
        clearTimeout(emotionTO);
        who = $(Global.tmp[DialogRunner.childindex]).attr("who");
        var gesture = DialogManager.getGesture($(Global.tmp[DialogRunner.childindex]).attr("gesture"));
        var gestureLoop = ($(Global.tmp[DialogRunner.childindex]).attr("gestureLoop")=="true")?true:false;
        var gestureTiming = $(Global.tmp[DialogRunner.childindex]).attr("gestureTiming");
        var gestureTime = $(Global.tmp[DialogRunner.childindex]).attr("gestureTime");
        stopGesture = ($(Global.tmp[DialogRunner.childindex]).attr("stopGesture")=="true")?true:false;
        
        if(who=="1")
        {
            if(Global.playerAvatarInstanceID != null)targetChar = Global.playerAvatarInstanceID;
        }
        else if(who=="2" || who=="0")
        {
            if(DialogRunner.dialogobject.NpcInstanceID != null)targetChar = DialogRunner.dialogobject.NpcInstanceID;
        }
        
        gestureObj = {};
        
        if(gesture!="" && gesture!=null){
            if(gestureTiming==0) VuplexManager.PlayGesture(gesture, targetChar, gestureLoop,"DialogRunner.playEmotions");
            else if(gestureTiming==1){
                gestureObj.gesture = gesture;
                gestureObj.targetChar = targetChar;
                gestureObj.gestureLoop = gestureLoop;
                DialogRunner.playEmotions();
            }
            else gestureTO = setTimeout(function(){
                VuplexManager.PlayGesture(gesture, targetChar, gestureLoop,"DialogRunner.playEmotions");
            },gestureTime*1000);
        }
        else DialogRunner.playEmotions();
        
        
    }

    
    this.stopNPCAnimation=function(){
        if(stopGesture==true&&stopGesture!=""){
            if(DialogRunner.dialogobject.NpcInstanceID != null)VuplexManager.ResetGestureNEmotion(DialogRunner.dialogobject.NpcInstanceID,"DialogRunner.stopPlayerAnimation");
            else DialogRunner.stopPlayerAnimation();
        }
        else DialogRunner.stopPlayerAnimation();
    }
    this.stopPlayerAnimation=function(){
        if(stopGesture==true&&stopGesture!=""){
            if(Global.playerAvatarInstanceID != null)VuplexManager.ResetGestureNEmotion(Global.playerAvatarInstanceID,"Dialog.close");
            else Dialog.close();
        }
        else Dialog.close();
        reward="";
        persistentreward="";
        multiplayerreward="";
    }
    this.playEmotions =function(){
        emotionObj={};
        var emotion = DialogManager.getEmotion($(Global.tmp[DialogRunner.childindex]).attr("emotion"));
        var emotionTiming = $(Global.tmp[DialogRunner.childindex]).attr("emotionTiming");
        var emotionTime = $(Global.tmp[DialogRunner.childindex]).attr("emotionTime");
        var stopEmotion = ($(Global.tmp[DialogRunner.childindex]).attr("stopEmotion")=="true")?true:false;//not in used atm. just using stopGesture to reset gesture and emotion
        if(emotion!="" && emotion!=null){
            if(emotionTiming==0)VuplexManager.PlayEmotions(emotion, targetChar,"DialogRunner.playCameraEffects");
            else if(emotionTiming==1){
                emotionObj.emotion = emotion;
                emotionObj.targetChar = targetChar;
                DialogRunner.playCameraEffects();
            }
            else emotionTO = setTimeout(function(){
                VuplexManager.PlayEmotions(emotion, targetChar,"DialogRunner.playCameraEffects");
            },emotionTime*1000); 
        }
        else DialogRunner.playCameraEffects();
    }
    this.playCameraEffects=function(){
        cameraEffect = parseInt($(Global.tmp[DialogRunner.childindex]).attr("cameraeffect"));
        var cameraShakeDuration;
        var cameraShakeMagnitude;
        var cameraBindingFunction;
        if(cameraEffect==1||cameraEffect==3){
            cameraFadeDuration = parseFloat($(Global.tmp[DialogRunner.childindex]).attr("cameraFadeDuration"));
            cameraFadeColor = $(Global.tmp[DialogRunner.childindex]).attr("cameraFadeColor");
        }
        else if(cameraEffect==2){
            cameraBindingFunction="CameraVuplexWebViewBinder.FadeOut";
            cameraFadeDuration = parseFloat($(Global.tmp[DialogRunner.childindex]).attr("cameraFadeDuration"));
        }
        else if(cameraEffect==6 || cameraEffect==7){
            if(cameraEffect==6)cameraBindingFunction="CameraVuplexWebViewBinder.ShakeCamera";
            else cameraBindingFunction="CameraVuplexWebViewBinder.ShakeRotateCamera";
            cameraShakeDuration = parseFloat($(Global.tmp[DialogRunner.childindex]).attr("cameraShakeDuration"));
            cameraShakeMagnitude = parseFloat($(Global.tmp[DialogRunner.childindex]).attr("cameraShakeMagnitude"));
        }
        if(cameraEffect!=""&&cameraEffect!=0&&cameraEffect!=1&&cameraEffect!=3){
            if(cameraEffect==2){
                $("#fading-effect-wrapper").fadeOut(cameraFadeDuration*1000,function(){
                    DialogRunner.playCameraSettings();
                });
            }
            else if(cameraEffect==6||cameraEffect==7){
                VuplexManager.SetCameraEffects(cameraBindingFunction,[cameraShakeDuration,cameraShakeMagnitude],"DialogRunner.playCameraSettings");
            }
            else DialogRunner.playCameraSettings();
        }
        else DialogRunner.playCameraSettings();
    }
    this.playCameraSettings=function(){
        targetChar = null;
        notTargetChar=null;
        if(who=="1")
        {
            if(Global.playerAvatarInstanceID != null)targetChar = Global.playerAvatarInstanceID;
            if(DialogRunner.dialogobject.NpcInstanceID != null)notTargetChar = DialogRunner.dialogobject.NpcInstanceID;
        }
        else if(who=="2"||who=="0")
        {
            if(DialogRunner.dialogobject.NpcInstanceID != null)targetChar = DialogRunner.dialogobject.NpcInstanceID;
            if(Global.playerAvatarInstanceID != null)notTargetChar = Global.playerAvatarInstanceID;
        }
        var shotType = $(Global.tmp[DialogRunner.childindex]).attr("shotType");
        if(shotType=="twoshot")shotType="TwoShot";
        else if(shotType=="shoulder")shotType="OTSShot";
        else if(shotType=="target")shotType="TargetShot";
        var cameraPosition = $(Global.tmp[DialogRunner.childindex]).attr("cameraPosition");
        if(cameraPosition=="front")cameraPosition="Front";
        else if(cameraPosition=="back")cameraPosition="Back";
        else if(cameraPosition=="left")cameraPosition="Left";
        else if(cameraPosition=="right")cameraPosition="Right";
        var cameraRange = $(Global.tmp[DialogRunner.childindex]).attr("cameraRange");
        if(cameraRange=="default")cameraRange="Default";
        else if(cameraRange=="close")cameraRange="CloseRange";
        else if(cameraRange=="mid")cameraRange="MidRange";
        else if(cameraRange=="long")cameraRange="LongRange";
        var cameraPanState = $(Global.tmp[DialogRunner.childindex]).attr("cameraPanState");
        if(cameraPanState=="snap")cameraPanState="Snap";
        else if(cameraPanState=="interpolate")cameraPanState="Interpolate";
        var cameraHeight = $(Global.tmp[DialogRunner.childindex]).attr("cameraHeight");
        if(cameraHeight=="low")cameraHeight="Low";
        else if(cameraHeight=="eye")cameraHeight="Eye";
        else if(cameraHeight=="high")cameraHeight="High";
        else if(cameraHeight=="birdeye")cameraHeight="BirdsEye";
        var cameraOffsetX = ($(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetX")!="")?$(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetX"):0;
        var cameraOffsetY = ($(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetY")!="")?$(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetY"):0;
        var cameraOffsetZ = ($(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetZ")!="")?$(Global.tmp[DialogRunner.childindex]).attr("cameraOffsetZ"):0;
        var cameraDuration = $(Global.tmp[DialogRunner.childindex]).attr("cameraDuration");
		//RESET EXISTING PORTRAITE
		//engine.call("ScreenCaptureBinder.StopCapture");//Will replace by uniwebview

        if(shotType!=null && shotType!="")VuplexManager.SwitchToMachinima(shotType,cameraPanState,targetChar,notTargetChar,cameraPosition,cameraRange,cameraHeight,cameraDuration,cameraOffsetX,cameraOffsetY,cameraOffsetZ,"DialogRunner.parseDialogandShow");
        else DialogRunner.parseDialogandShow();
    }
    this.parseDialogandShow=function(){
        var portrait = $(Global.tmp[DialogRunner.childindex]).attr("portrait");
		var imagepath = $(Global.tmp[DialogRunner.childindex]).attr("imagepath");
		var myid = $(Global.tmp[DialogRunner.childindex]).attr("myid");
		var id = $(Global.tmp[DialogRunner.childindex]).attr("id");
		reward = $(Global.tmp[DialogRunner.childindex]).attr("reward");
        persistentreward =  $(Global.tmp[DialogRunner.childindex]).attr("persistentreward");
        multiplayerreward =  $(Global.tmp[DialogRunner.childindex]).attr("multiplayerreward");
		var link = $(Global.tmp[DialogRunner.childindex]).attr("link");
		var nick = $(Global.tmp[DialogRunner.childindex]).attr("nick");
        hidePanel = ($(Global.tmp[DialogRunner.childindex]).attr("hidePanel")=="true")?true:false; 
		
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
                $("#objectViewPort").css({
                    backgroundImage:"url(" + encodeURI("Conversation/" + imagepath) + ")"
                });
                $("#objectViewPort").show();
                $("#objectViewPort").data("img","Conversation/" + imagepath);
                TweenMax.from($('#objectViewPort'),.250,{left:"-100%",opacity:0, onComplete:this.setObjectViewDialogContentPosition});
                $("#objectViewPort").off('click').on("click",function(){
                    var img = $(this).data("img");
                    DialogManager.previewImg(img);
                });
            }
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
                backgroundColor:"rgba(0,0,0,.05)",
            }); 
        }
		//CHECK WHETHER CHOICE OR SINGLE
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
            
            var textAnimate=$(Global.tmp[DialogRunner.childindex]).attr("textAnimate");
            textAnimate = (textAnimate==undefined)?true:(textAnimate=="true")?true:false;
            
            var score =$(Global.tmp[DialogRunner.childindex]).attr("score");
            if(score!=undefined)ItemManager.getDialogScore(Number(score));
            
            dialogMinigame = $(Global.tmp[DialogRunner.childindex]).attr("minigame");
            if(dialogMinigame==undefined)dialogMinigame="";
            
            $("#dialogContentPanel").css({
                backgroundColor:panelColor            
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
				if(nick != "" && nick !=" ")
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
				if(nick != ""  && nick!=" ")
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
                if(nick != ""  && nick!=" ")
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

            DialogRunner.playAudio();
		}
		else if(dialogCount>1)
		{
            var str = "";
            
            $('.tapStatusMessage').text('double tap a selection to continue');
            
			//Remove the click listener to allow for multiple selection
            $("#dialogActivePanel, #dialog-bg-wrapper").unbind();
            
            //Clear the content
            $('#dialogContent').empty();
            
            //Generate Multiple Choices          
            $('#mainDialogPanel').hide();
        
            var html = "<div id='multiSelectionPanel'>";
            multiDialogIdx=0;
            alreadyHaveHint=false;
            for(var i = 0; i < DialogRunner.currentdialogobject.length; i++)
                html+=Dialog.generateMultipleChoiceDialog(DialogRunner.currentdialogobject[i], i);
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
    }
    this.playAudio=function(){
        //PLAY THE SOUND
        var audiofile = $(Global.tmp[DialogRunner.childindex]).attr("audiofile");
		var audiotime = $(Global.tmp[DialogRunner.childindex]).attr("audiotime");
        if(audiofile != "")VuplexManager.PlayDialog(audiofile,"DialogRunner.addClick");
        else DialogRunner.addClick();
    }
    this.addClick=function(){
        $("#dialogActivePanel,#dialog-bg-wrapper").unbind().click(function(){
            $("#dialogActivePanel,#dialog-bg-wrapper").unbind();
            DialogRunner.continueDialog();
        });
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

        console.log("====>" + $("#dialogViewPort").width());
        $("#dialogContent").show();
        $("#dialogContent").css({
            left:$("#dialogViewPort").width()
        });
        $("#dialogHistoryActive").css({
            left:$("#dialogViewPort").width()   
        });
    }
    
 
    this.continueDialog=function(){
        if(cameraEffect==1){
            $("#fading-effect-wrapper").css({
                backgroundColor:"rgba("+cameraFadeColor+")"
            });
            $("#fading-effect-wrapper").fadeIn(1000*cameraFadeDuration,function(){
                $("#mainDialogPanel").hide();
                $("#fading-effect-wrapper,#dialogActivePanel").unbind().click(function(){
                    $("#fading-effect-wrapper,#dialogActivePanel").unbind();
                    DialogRunner.giveReward();
                });
            });
        }
        else if(cameraEffect==3){
            $("#fading-effect-wrapper").css({
                backgroundColor:"rgba("+cameraFadeColor+")"
            });
            $("#fading-effect-wrapper").fadeIn(1000*cameraFadeDuration/2,function(){
                $("#mainDialogPanel").hide();
                DialogRunner.giveReward();
                $("#fading-effect-wrapper").fadeOut(1000*cameraFadeDuration/2,function(){
                    $("#fading-effect-wrapper").css({
                        backgroundColor:"transparent"  
                    })
                })
            })
        }
        else {
            $("#mainDialogPanel").hide();
            DialogRunner.giveReward();
        }
    }
    this.giveReward=function(){
        cameraEffect=0;
        if(reward!=""){
            DialogHistory.addConversationItem("reward",reward)
            ItemManager.AwardReward(reward,1,"DialogRunner.rewardGiven");
        }
        else if(persistentreward!=""){
            DialogHistory.addConversationItem("persistentreward",persistentreward)
            ItemManager.AwardPersistentReward(persistentreward,1,"","DialogRunner.rewardGiven");
        }
        else if(multiplayerreward!=""){
            DialogHistory.addConversationItem("multiplayerreward",multiplayerreward)
            ItemManager.AwardMultiplayerReward(multiplayerreward,1,"","DialogRunner.rewardGiven");
        }
        else DialogRunner.rewardGiven();
    }
    this.rewardGiven=function(){
        //SET LAST SELECTION OR TEXT TO LAST AND HISTORY PANEL
        //NEED TO TAKE INTO CONSIDERATION CHOICE AND SINGLE ENTITIES
        DialogRunner.updateHistoryVisual("single");
        //SETUP THE NEW CHILD ELEMTNS
        if(Global.tmp.length>1)DialogRunner.currentdialogxmlobject = Global.tmp[1];
        else DialogRunner.currentdialogxmlobject = Global.tmp[0];
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
    this.generateMultipleChoiceDialog = function(data, currentDialogIndex)
    {
        var rewardstr = data.reward;
        var persistentrewardstr = data.persistentreward;
        var multiplayerrewardstr = data.multiplayerreward;
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
                html+="<div class='multiDialogContentClass hintClass' "+style+" minigame='"+minigame+"' score='"+score+"' multiplayerreward='"+multiplayerrewardstr+"' persistentreward='"+persistentrewardstr+"' reward='"+rewardstr+"' id='multiDialogContentHint' current-dialogindex='" + currentDialogIndex + "' data-dialogindex=0' dialogid='"+dialogid+"'><div>"+data.text[0]+"</div></div>";
                alreadyHaveHint=true;
            }
            else {
                html+="<div class='multiDialogContentClass' "+style+" minigame='"+minigame+"' score='"+score+"' multiplayerreward='"+multiplayerrewardstr+"' persistentreward='"+persistentrewardstr+"' reward='"+rewardstr+"' id='multiDialogContent"+multiDialogIdx+"' current-dialogindex='" + currentDialogIndex + "' data-dialogindex=0' dialogid='"+dialogid+"'><div>"+data.text[0]+"</div></div>";
                multiDialogIdx++;
            }
        }
        return html;
    }
    this.selectMultipleChoice = function()
    {
        //Reset All Multiple Choice
        $('.dialogbranch').unbind().click(Dialog.selectMultipleChoice);
        $('.dialogbranchtext').removeClass('dialogbranchselected')
        
        //Unbind Listener for Selected Option and Add New Selection Listener
        $(this).unbind().click(Dialog.confirmMultipleChoice).find('.dialogbranchtext').addClass('dialogbranchselected')
    }
    this.confirmMultipleChoice = function(e)
    {
        //Confirm and Process
        e.stopPropagation();
        var currentSelectedRow = parseInt($(this).attr("current-dialogindex"));
        DialogRunner.multipleChoiceIndex = currentSelectedRow;
        var selectedDialog = parseInt($(this).attr("data-dialogindex"));
        var currentSelectedDialog = DialogRunner.currentdialogobject[currentSelectedRow];
        var currentSelectedText = currentSelectedDialog.text[selectedDialog];
        
        //NEED TO TAKE INTO CONSIDERATION CHOICE AND SINGLE ENTITIES
        DialogRunner.updateHistoryVisual("multiple");
        DialogRunner.currentdialogobject = currentSelectedDialog.dialog;
        //SETUP THE NEW CHILD ELEMTNS
        if(Global.tmp.length>1)DialogRunner.currentdialogxmlobject = Global.tmp[currentSelectedRow + 1];
        else DialogRunner.currentdialogxmlobject = Global.tmp[0];

        $('#mainDialogPanel').show();
        $("#multiSelectionPanel").remove();
        $(".hintClass").remove();
        $("#hintImg").remove();
        
        var id = $(this).attr("dialogid");
        DialogHistory.addConversationItem("conversation",{type:"multiple",id:id,name:DialogRunner.dialogobject.URI})
        
        var score = $(this).attr("score");
        if(score.toString()!="0")ItemManager.getDialogScore(Number(score));
        
        var minigame = $(this).attr("minigame");
        if(minigame!="")dialogMinigame = minigame;
        
        var reward1 = $(this).attr("reward");
        var persistentreward1 = $(this).attr("persistentreward");
        var multiplayerreward1 = $(this).attr("multiplayerreward");
        if(reward1!=""){
            DialogHistory.addConversationItem("reward",reward1)
            ItemManager.AwardReward(reward1,1,"DialogRunner.startDialogTraversal");
        }
        else if(persistentreward1!=""){
            DialogHistory.addConversationItem("persistentreward",persistentreward1)
            ItemManager.AwardPersistentReward(persistentreward1,1,"","DialogRunner.startDialogTraversal");
        }
        else if(multiplayerreward1!=""){
            DialogHistory.addConversationItem("multiplayerreward",multiplayerreward1)
            ItemManager.AwardMultiplayerReward(multiplayerreward1,1,"","DialogRunner.startDialogTraversal");
        }
        else DialogRunner.startDialogTraversal();
    }
	this.startDialogFromXML = function(dialogobj)
    {
        //RESET DIALOG
		DialogRunner.resetToStartDialog();
		DialogRunner.dialogobject = dialogobj;
        DialogHistory.addConversationItem("dialogstart",DialogRunner.dialogobject.URI);
        //This had to change due to IOS causing a fus
        Utils.getXMLFromFile("GameMedia/Conversation/"+DialogRunner.dialogobject.URI,Dialog.dialogXmlObjectRecieved);
	}
	this.dialogXmlObjectRecieved = function(obj)
	{
		DialogRunner.initiateStartDialog(obj);
	}
	this.updatePanelSize = function()
	{
	}
	this.initSkeleton = function(callback)
	{
        Dialog.callback = callback;
		buildInitialDialogSkeleton();
		VuplexManager.GetPlayerInstanceIDAndName("Dialog.GetPlayerInstanceIDAndName");
		this.firstrun = false;
	}
    this.callback=null;
    this.GetPlayerInstanceIDAndName=function(obj){
        Global.playerAvatarInstanceID = obj.InstanceID;
        Global.playerAvatarName = obj.Name;
        Dialog.callback();
    }
	this.showPanel = function(bool)
	{
		if(bool)
		{
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
            $("#dialogActivePanel,#dialog-bg-wrapper").unbind();
            DialogRunner.continueDialog();
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

				str += "<div class='blob dialogBlobReward'>"
					str += "<p>you were given a reward</p>"
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
        $("#dialogViewPort").hide();
        $("#objectViewPort").hide();
        $("#dialog-bg-wrapper").css({
            backgroundColor:"rgba(0,0,0,.05)",
            backgroundImage:"none"
        });
        VuplexManager.StopDialog("Dialog.EndInteraction");
	}
    
    this.EndInteraction=function(data){
        //HIDE PANEL
        dialogMinigame="";
        TriggerState.ViewMode = false;
		Dialog.showPanel(false);
        if(TriggerManager.ar.length>0){
            Inventory.getInventoryJSON(TriggerManager.ar,"VuplexManager.EndInteraction");
        }
        else VuplexManager.EndInteraction();
        TriggerManager.ar = [];
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
		VuplexManager.StopDialog("Dialog.playMinigame");
    }
    this.playMinigame=function(){
        TriggerManager.initMinigameFromDialog(dialogMinigame);
        //HIDE PANEL
		Dialog.showPanel(false);
    }
    this.backToDialog=function(){
        dialogMinigame="";
        Dialog.showPanel(true);
        DialogRunner.parseDialogObject();
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
        stopGesture=true;
        DialogHistory.addConversationItem("dialogend","userstopped")
        DialogHistory.finishConversationItem("DialogRunner.stopNPCAnimation");

		//CHECK IF THERE IS A REWARD
		str += "<div class='blob dialogBlobClosed'><p>You stopped the conversation.</p></div>";

		//APPEND
		$('.interactionBlock[data-interactionid="' + Dialog.dialogcounterid + '"]').append($(str));
	});
}