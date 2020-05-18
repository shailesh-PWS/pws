//Added by Milbert
var overrollScore=0;//The total correct score when the game is started till it ends
var totalOverrollScore=0;//THe total score when the game is started till it ends
var qid;
var xml;
var winText;
var loseText;
var score;
var showFeedback;
var showAnswer;
var showRetry;
var ctr=0;
var xmlList;
var gameType;
var totalItem;
var hideBtn;
var minigameXML;
var currentXMLList;
var totalScorableItem;
var correctAnswers;
var currentAnswers;
var minigameReward;
var rndNum;
var correctBool;
var curGameScore=0;
var timeCounter=0;
var to;
var bgColor;
var mainTo;
var mainToCtr=0;
var slideOnly=true;
var HOto;
var scoredMiniCtr=0;
var thisFrame;
var instantRetry;
var tries=0;
var triesAttempted=1;
var windowSize;
var windowPercentWSize;
var windowPercentHSize;
var windowPosition;
var windowXpos;
var windowYpos;
var transAnimate=0;
var transDuration;
var exit=false;
var soundFile;
var soundDelay;
var fromDialog;
var minigameClass;
//End of added
var minigameXmlName;
var backToMenuBool=false;
var background="";
var Content = new function()
{
    this.setTranparentFrame = function(bool)
    {
        console.log("Transparent " + bool)
        if(bool)
        {
            
            $('#mainContentWindow').css('backgroundColor','transparent')
        }
        else
        {
            $('#mainContentWindow').css('backgroundColor','#22313F')
        }
    }
	this.initSkeleton = function(chromeless)
	{
        globalMinigameMenuVarReset();
		ContentData.chromeless = chromeless

		buildInitialContentSkeleton();

		$("#contentCloseButton").unbind().on("click",function(){
			ContentEvents.CloseWindow();
		});

		this.sizeInternalContentWindow();
	}
	this.sizeInternalContentWindow = function()
	{
		if(ContentData.chromeless)
		{
			$('#chromelessContentWindow').css({
				width:'100%',
				height:$("#mainContentWindow").height()
			})
		}
		else
		{
			$('#chromeContentWindow').css({
				width:$("#mainContentWindow").width(),
				height:$("#mainContentWindow").height(),
				top:0,
				left:0
			})

			$('#contentCloseButton').css({
				width:ContentData.padding,
				height:ContentData.padding,
				right:5,
				top:5
			})
		}
	}
    this.BGColor=function(col){
        $("#mainContentWindow").css({
            backgroundColor:col
        });
    }

    this.Minigame=function(qid,back){
        if(back)backToMenuBool=back;
        else backToMenuBool=false;
        minigameXmlName = qid;
        resetMinigameVariables();
        var htmlTxt = '<div id="minigameWrapper"></div>';
        $("#mainContentWindow").html(htmlTxt);
        Utils.getXMLFromFile("/GameMedia/Minigames/"+qid,init);
    }

    this.Intro = function(){
        var htmlTxt = '<div id="introMainWrapper"><div id="introIframe"></div><img id="closeFrame" src="images/icons/ContentCloseButton.png"/></div>';
        $("#mainContentWindow").html(htmlTxt);

        $("#closeFrame").css({
             width:$("#closeFrame").height()
        });
        $("#closeFrame").unbind().mousedown(function(){
            ContentEvents.CloseWindow();
        });

        Utils.getStringFromFile("/GameMedia/Minigames/Intro/index.html",Content.strGameLoaded);
    }
    this.strGameLoaded=function(str){
        $("#introIframe").html(str);
    }
}

function closeIntro(){
    ContentEvents.CloseWindow();
}

function globalMinigameMenuVarReset(){
    triggerQueueManager.resetQueue();
}

function resetMinigameVariables(){
    ctr=0;
    curGameScore=0;
    timeCounter=0;
    mainToCtr=0;
    scoredMiniCtr=0;
    tries=0;
}

var ContentData = new function()
{
	this.padding = 30;
	this.chromeless = false;
}
var ContentEvents = new function()
{
	this.CloseWindow = function()
	{   
        setTimeout(function(){
            if(exit){
                $("#mainContentWindow").remove();
                engine.call("EventCoherentUIBinder.BackToMainMenu");
            }
            else{
                SoundPlayer.StopAudio();
                $("#mainContentWindow").remove();
                //STOP VIEW MODE
                TriggerState.ViewMode = false;

                console.log("ContentWindow OFF");
                if(fromDialog){
                    Dialog.backToDialog();
                }
                else{
                    engine.trigger("EventCoherentUIBinder.ChangeMode", Global.tmpFocusMode, "gameon");
                    engine.call("EventCoherentUIBinder.EndInteraction");
                }    
            }
        },250);
	}
}
function buildInitialContentSkeleton()
{
	var str = "";

	console.log("BUILDING CONTENT")

	str += "<div id='mainContentWindow'>";
		if(ContentData.chromeless)
		{
			str += "<iframe id='chromelessContentWindow' frameborder='0' scrolling='no' class='contentWrapperClass'></iframe>";
			
		}
		else
		{
			str += "<iframe id='chromeContentWindow' frameborder='0' scrolling='yes' class='contentWrapperClass'></iframe>";
			str += "<div id='contentCloseButton'><img src='images/icons/ContentCloseButton.png'/></div>"
		}
		
	str += "</div>";
    
        $("#mainContentWindow").remove();

	$('body').append($(str));
}


//functions added by MIlbert
function init(_xml){
    xml = _xml;
    if($(xml).find("randomise").text()=="true"){
        var mgame = $(xml).find("MGame");
        var noQuest = $(xml).find("noQuest").text();
        if(noQuest=="")noQuest = mgame.length;
        else noQuest = parseInt(noQuest);
        mgame = strFuncs.arrayRandomize(mgame);
        $(xml).find("MGame").remove();
        for(var i=0;i<noQuest;i++){
            $(xml).find("xml").append($(mgame[i]));
        }
    }
    minigameXMLManager.setMinigameXML(xml);
    minigameClass = minigameXMLManager.getMinigameClass();
    if(minigameClass=="")minigameClass="minigame";
    exit=false;
    console.log("minigameClass:"+minigameClass);
    if(minigameClass=="minigame"){
        $("#minigameWrapper").css("background-color","transparent");
        windowSize = minigameXMLManager.getWindowSize();
        windowPercentWSize = parseFloat(minigameXMLManager.getWindowPercentWSize());
        windowPercentHSize = parseFloat(minigameXMLManager.getWindowPercentHSize());
        windowPosition = minigameXMLManager.getWindowPosition();
        windowXpos = parseFloat(minigameXMLManager.getWindowXpos());
        windowYpos = parseFloat(minigameXMLManager.getWindowYpos());
        transAnimate = minigameXMLManager.getTransition();
        transDuration = minigameXMLManager.getTransDuration();
        exit = minigameXMLManager.getExit();
        if(windowSize==0){
            scaleX=1;
            scaleY=1;
        }
        else{
            scaleX = windowPercentWSize/100;
            scaleY = windowPercentHSize/100;
        }
        
        minigameManager.populate();
        //console.log("beforeInitWIndow")
        initWindow();
        //console.log("beforeFluidDEsign")
        fluidnessInit();
        //console.log("beforeStartGame")

        minigameManager.startGame(ctr);
    }
    else{
        if(!backToMenuBool){
            triggerQueueManager.addToQueue(minigameXmlName);
        }
        $("#minigameWrapper").css("background-color","black");
        minigameMenuManager.populate();
    }
}

var scaleX;
var scaleY;
function initWindow(){
    $("#minigameWrapper").css({
        width:$("#mainContentWindow").width()*scaleX,
        height:$("#mainContentWindow").height()*scaleY
    });

    //console.log("windowPosition:"+windowPosition);
    switch(parseInt(windowPosition)){
        case 0://center
            $("#minigameWrapper").css({
                top:($("#mainContentWindow").height()-$("#minigameWrapper").height())/2,
                left:($("#mainContentWindow").width()-$("#minigameWrapper").width())/2
            });
            break;
        case 1://top left
            $("#minigameWrapper").css({
                top:windowYpos,
                left:windowXpos
            });
            break;
        case 2://top right
            $("#minigameWrapper").css({
                top:windowYpos,
                right:windowXpos
            });
            break;
        case 3://bottom left
            $("#minigameWrapper").css({
                bottom:windowYpos,
                left:windowXpos
            });
            break;
        case 4://bottom right
            $("#minigameWrapper").css({
                bottom:windowYpos,
                right:windowXpos
            });
            break;
        case 5://centerX top
            $("#minigameWrapper").css({
                top:$("#mainContentWindow").height()*(windowYpos/100),
                left:($("#mainContentWindow").width()-$("#minigameWrapper").width())/2
            });
            break;
        case 6://centerY left
            $("#minigameWrapper").css({
                top:($("#mainContentWindow").height()-$("#minigameWrapper").height())/2,
                left:$("#mainContentWindow").width()*(windowXpos/100)
            });
            break;
        case 7://centerX bottom
            $("#minigameWrapper").css({
                bottom:$("#mainContentWindow").height()*(windowYpos/100),
                left:($("#mainContentWindow").width()-$("#minigameWrapper").width())/2
            });
            break;
        case 8://centerY right
            $("#minigameWrapper").css({
                top:($("#mainContentWindow").height()-$("#minigameWrapper").height())/2,
                right:$("#mainContentWindow").width()*(windowXpos/100)
            });
            break;
    }

    //console.log("transAnimate:"+transAnimate);
    switch(parseInt(transAnimate)){
        case 0:
            $("#minigameWrapper").show();
            break;
        case 1:
            $("#minigameWrapper").show();
            TweenMax.from($("#minigameWrapper"),transDuration,{transform:"scale(0)"});
            break;
        case 2:
            $("#minigameWrapper").show();
            TweenMax.from($("#minigameWrapper"),transDuration,{left:-$("#minigameWrapper").width()});
            break;
        case 3:
            $("#minigameWrapper").show();
            TweenMax.from($("#minigameWrapper"),transDuration,{left:$("#mainContentWindow").width()});
            break;
        case 4:
            $("#minigameWrapper").show();
            TweenMax.from($("#minigameWrapper"),transDuration,{top:-$("#minigameWrapper").height()});
            break;
        case 5:
            $("#minigameWrapper").show();
            TweenMax.from($("#minigameWrapper"),transDuration,{top:$("#mainContentWindow").height()});
            break;
        case 6:
            $("#minigameWrapper").show();
            TweenMax.from($("#minigameWrapper"),transDuration,{opacity:0});
            break;
    }
}

function filteXMLChar(str){
    var _patterns = " 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=_+{}:<>?[]|;',./\\\"\n\t\r";
    for(var i=0;i<str.length;i++){
        if(_patterns.indexOf(str.charAt(i))<0){
                str = str.replace(str.charAt(i),"");
        }
    }
    return str;
}
function StringtoXML(text) {
    var doc;
    if (window.ActiveXObject) {
        doc = new ActiveXObject('Microsoft.XMLDOM');
            doc.async = 'false';
            doc.loadXML(text);
    } else {
            var parser = new DOMParser();
            doc = parser.parseFromString(text, 'text/xml');
    }
    return doc;
}
var res="";
var info="";
function setResult(arg) {
        //console.log(arg)
        res = (arg);
}
function getResult() {
        return res;
}
function setInfo(arg){
        info = arg;
}
function getInfo(){
        return info;
}
function getMusic(){
        return "";
}
function getSound(){
        return "";
}

window.onresize = function(){
    resize();
    fluidnessInit();
};

function resize(){
    
}
function fluidnessInit(){
    if($("#contentWrapper").height()<480){
        $("#feedbackContentID").css({
            maxHeight:$("#contentWrapper").height()
        });
    }
    if(stage.getWidth()<640){
        $("#feedbackContentID").css({
            maxWidth:stage.getWidth()
        });
    }

    $("#feedbackContentID").css({
        top:($("#contentWrapper").height()-$("#feedbackContentID").height())/2,
        left:($("#contentWrapper").width()-$("#feedbackContentID").width())/2
    });
}

function closeWindow(){
    switch(parseInt(transAnimate)){
        case 0:
            closeNow();
            break;
        case 1:
            TweenMax.to($("#minigameWrapper"),transDuration,{transform:"scale(0)", onComplete:closeNow});
            break;
        case 2:
            $("#minigameWrapper").show();
            TweenMax.to($("#minigameWrapper"),transDuration,{left:-$("#minigameWrapper").width(),onComplete:closeNow});
            break;
        case 3:
            $("#minigameWrapper").show();
            TweenMax.to($("#minigameWrapper"),transDuration,{left:$("#mainContentWindow").width(),onComplete:closeNow});
            break;
        case 4:
            $("#minigameWrapper").show();
            TweenMax.to($("#minigameWrapper"),transDuration,{top:-$("#minigameWrapper").height(),onComplete:closeNow});
            break;
        case 5:
            $("#minigameWrapper").show();
            TweenMax.to($("#minigameWrapper"),transDuration,{top:$("#mainContentWindow").height(),onComplete:closeNow});
            break;
        case 6:
            $("#minigameWrapper").show();
            TweenMax.to($("#minigameWrapper"),transDuration,{opacity:0,onComplete:closeNow});
            break;
        default:
            closeNow();
            break;
    }
}

var _file;
var _delay;
function playSoundMedia(file,delay){
    //console.log(file+":"+delay)
    _file=file;
    if(file=="")return;
    _delay=delay;
    if(parseFloat(delay)==0){
        playSoundNow();
    }
    else{
        setTimeout(function(){
            playSoundNow();
        },delay);
    }
}

function stopSoundMedia(){
    SoundPlayer.StopAudio();
}

function playSoundNow(){
    SoundPlayer.PlayAudio(_file);
}

function closeNow(){
    var _qid = triggerQueueManager.getCurrentMenuXMLFile();
    console.log("_qid:"+_qid)
    if(_qid==""){
        ContentEvents.CloseWindow();
    }
    else{
        Content.Minigame(_qid,true);
    }
    console.log("Close Window NOw");
    
    stopSoundMedia();
    console.log("minigame log:"+JSON.stringify(minigameControl.Array));
    if(minigameControl.Array.length > 0){
    Log.addAction("minigame" + _qid,minigameControl.Array);
    minigameControl.Array = [];
    }
}