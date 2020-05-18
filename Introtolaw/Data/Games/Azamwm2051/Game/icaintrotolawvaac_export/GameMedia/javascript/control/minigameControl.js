/**
 * ...
 * @author Milbert Cale@Playware Studios
 */

var tries=0;
var currentInstructions="";
var PlayedMiniGameList=[];
var showCorrectAnswer;
var instructionsCloseCallback;
var correctFeedBackNotEmpty;
var prevTotScore=0;
var prevScored=0;
var minigameControl = new function(){
    this.showInstruction = function(str){
        var imgPath = minigameXMLManager.getInstructionImage();
        if((str==undefined||str=="")&&(imgPath==undefined||imgPath==""))return;
        if(minigameXMLManager.getShowOnload()){
            currentInstructions = str;
            $("#instructionWrapper").remove();
            if(strFuncs.debug)$("#contentWrapper").hide();
            $("#minigameWrapper").append("<div id='instructionWrapper'></div>");
            if(imgPath!=""&&imgPath!=undefined){
                $("#instructionWrapper").css({
                   backgroundImage:"url("+imgPath+")" 
                });
                if(str!="")$("#instructionWrapper").append("<div id='instructionTextWithImg'>"+str+"</div>");
            }
            else{
                $("#instructionWrapper").css({
                   backgroundImage:"url(images/minigames/mgs_instruction.png)" 
                });
                $("#instructionWrapper").append("<div id='instructionText'>"+str+"</div>");
                
                tapDiv ="<div id='instructionTap'>Tap to Continue</div>";  
                $("#instructionWrapper").append(tapDiv);
            }
            FontUtils.resize("#instructionText");

            $("#headerScoreID").css({
                left:35
            });

            $("#instructionWrapper").css({
               width: $("#minigameWrapper").width(),
               height:$("#contentWrapper").height()+$("#footerWrapper").height()
            });
            
            
            $('#instructionWrapper').unbind().click(function(e){
                if(strFuncs.debug)$("#contentWrapper").fadeIn(250);
                $(this).fadeOut(250,function(){
                    $(this).remove();
                });
                if(instructionsCloseCallback!= undefined)instructionsCloseCallback();
            });
        }
        $("#instructionIcon").show();
    };
    this.Array=[];
    this.Object={};
    this.GameObject={};
    this.MenuObject={};
    this.init=function(){
        resetVars();
        $("#closeBtnImg").unbind().mousedown(function(){
            console.log("CloseBtn");

            // HACK for slideshow onClose event
            if(document.getElementById('slideShowWrapper').textContent != undefined && document.getElementById('slideShowWrapper').textContent != null)
            {
                onClose();
            }

            closeWindow();
        });
        $("#submitBtnID").unbind().mousedown(function(){
            verifyAnswer();
        });

        $("#showAnswerBtnID").unbind().mousedown(function(){
            $("#showAnswerBtnID").hide();
            showTheCorrectAnswer();
        });
  
        $("#retryBtnID").unbind().mousedown(function(){
            retryInstantly();
        });

        $("#instructionIcon").unbind().mousedown(function(){
           instructionIconClick();
        });

        tries++;
        minigameControl.Array=[];
        minigameControl.Object={};
        minigameControl.Object.minigameClass="minigame";
        minigameControl.Object.name = minigameXmlName;
        minigameControl.Object.title = minigameXMLManager.getName();
        minigameControl.Object.description = minigameXMLManager.getDescription();
        minigameControl.Object.retry=tries;
        minigameControl.Object.Games=[];
        minigameControl.Array.push(minigameControl.Object);
        PlayedMiniGameList.push(minigameControl.Object);
    }
    
    this.stopSoundMedia=function(){
        stopSoundMedia("minigameControl.submit");
    }
    this.submit=function(){
        if(scoreExemptGames.indexOf(gameType)<0){
            minigameControl.GameObject.timeTaken=mainToCtr;
            if(document.getElementById('contentWrapper').contentWindow != undefined && document.getElementById('contentWrapper').contentWindow != null)
            {
                if(document.getElementById('contentWrapper').contentWindow.getNoOfClicks != undefined){
                    minigameControl.GameObject.totalNoOfClicks= document.getElementById('contentWrapper').contentWindow.getNoOfClicks();
                }
                if(document.getElementById('contentWrapper').contentWindow.getTotal != undefined){
                    minigameControl.GameObject.totalScore= document.getElementById('contentWrapper').contentWindow.getTotal();
                    minigameControl.GameObject.Score= document.getElementById('contentWrapper').contentWindow.getScore();
                    curGameScore+=minigameControl.GameObject.Score;
                    totalGameScore+=minigameControl.GameObject.totalScore;
                    prevTotScore = minigameControl.GameObject.totalScore;
					prevScored=minigameControl.GameObject.Score;
                }
            }
        }
        correctFeedBackNotEmpty=true;
        if(correctAnswers.toString()==currentAnswers.toString()){
            overrollScore++;
            correctBool=true;
        }
        
        if(correctBool){            
            if(minigameXMLManager.getCorrectFeedback()=="")correctFeedBackNotEmpty=false;//This is to not show feedback when the correct feedback is empty
            
            minigameControl.checkCorrectReward("minigameControl.continueSubmit");
        }
        else {
            minigameControl.checkWrongReward("minigameControl.continueSubmit");
        }
        
    }
    this.checkCorrectReward=function(cb,fromSlideShow){
        if(fromSlideShow==undefined)fromSlideShow=false;
        var correctReward = minigameXMLManager.getCorrectReward();
        var correctPersistentReward = minigameXMLManager.getCorrectPersistentReward();
        var correctMultiplayertReward = minigameXMLManager.getCorrectMultiplayerReward();
        if(correctReward!=""){
            ItemManager.AwardReward(correctReward,1,cb); 
        }
        else if(correctPersistentReward!=""){
            ItemManager.AwardPersistentReward(correctPersistentReward,1,cb); 
        }
        else if(correctMultiplayertReward!=""){
            ItemManager.AwardMultiplayerReward(correctMultiplayertReward,1,cb); 
        }
        else {
            if(fromSlideShow)minigameManager.showSlideShow();
            else minigameControl.continueSubmit();
        }
    }
    this.checkWrongReward=function(cb){
        var wrongReward = minigameXMLManager.getWrongReward();
        var wrongPersistentReward = minigameXMLManager.getWrongPersistentReward();
        var wrongMultiplayertReward = minigameXMLManager.getWrongMultiplayerReward();
        if(wrongReward!=""){
            ItemManager.AwardReward(wrongReward,1,cb); 
        }
        else if(wrongPersistentReward!=""){
            ItemManager.AwardPersistentReward(wrongPersistentReward,1,cb); 
        }
        else if(wrongMultiplayertReward!=""){
            ItemManager.AwardMultiplayerReward(wrongMultiplayertReward,1,cb); 
        }
        else minigameControl.continueSubmit();
    }
    
    this.continueSubmit=function(){
        if(minigameControl.GameObject)minigameControl.GameObject.correctAnswer = correctBool;
        $("#headerScoreID").text("Score: "+curGameScore);
        if(showFeedback){
            if(correctFeedBackNotEmpty){
                $("#submitBtnID").text("NEXT");
                showCheckMark(correctBool);

                if(minigameXMLManager.getShowAnswer()){
                    if(!correctBool){
                        if(tries==0||triesAttempted>=tries){
                            bindFeedbackScreen("Tap to View Answer","#showAnswerBtnID");
                        }
                        else{
                            $("#showAnswerBtnID").hide();
                        }
                    }
                }
                else{
                    $("#showAnswerBtnID").hide();
                }
                if(instantRetry){
                    if(!correctBool){
                        console.log(tries+":"+triesAttempted);
                        if(tries==0||triesAttempted<tries){
                            bindFeedbackScreen("Tap to Retry","#retryBtnID");
                            $("#submitBtnID").hide();
                        }
                        else {
                            $("#submitBtnID").show();
                        }
                    }
                }
            }
            else{
                ctr++;
                minigameManager.startGame(ctr);
            }
        }
        else{
            ctr++;
            minigameManager.startGame(ctr);
        }      
    }
};

function instructionIconClick(){
    $("#instructionIcon").unbind();
    if($("#instructionWrapper").length==0){
        if(strFuncs.debug)$("#contentWrapper").fadeOut();
        minigameControl.showInstruction(currentInstructions);
    }
    else{
        $("#instructionWrapper").remove();
        if(strFuncs.debug)$("#contentWrapper").fadeIn();
    } 
    setTimeout(function(){
        $("#instructionIcon").unbind().click(instructionIconClick);
    },250);
}


function retryInstantly(){
     minigameControl.GameObject.instantRetried=true;
     totalGameScore = totalGameScore-prevTotScore;
	 curGameScore = curGameScore-prevScored;
     
     $("#retryBtnID").off("mousedown");
     $("#feedbackParentID").hide();
     $("#submitBtnID").text("SUBMIT");
     minigameManager.startGame(ctr,true);
     
     setTimeout(function(){			
        $("#retryBtnID").unbind().on("mousedown",function(){
            retryInstantly();
        });
    },500);
    
}
function showTheCorrectAnswer(){
    minigameControl.GameObject.answerShown=true;
    $("#showAnswerBtnID").off("mousedown");
    $("#showAnswerBtnID").hide();
    if(strFuncs.debug)$("#contentWrapper").show();
    $("#feedbackParentID").hide();
    try{
        showCorrectAnswer();
    }
    catch(e){}
    setTimeout(function(){			
        $("#showAnswerBtnID").unbind().on("mousedown",function(){
            showTheCorrectAnswer();
        });
    },500);
}

function resetVars(){
    ctr=0;
    curGameScore=0;
    totalGameScore=0;
    prevTotScore=0;
    timeCounter=0;
    currentSlideNum=0;
    scoredMiniCtr=0;
}

var scoreExemptGames=["SLIDESHOW","COMIC STRIP","RESULT PAGE","HTML PAGE" ]
function verifyAnswer(){
    $("#submitBtnID").off("mousedown");
    correctBool=false;
    clearTimeout(mainTo);
    clearTimeout(HOto);
    
    $('#instructionWrapper').remove();
    
    //minigameControl.GameObject
    if($("#submitBtnID").text()=="RETRY"){
        tries++;
        minigameControl.Object={};
        minigameControl.Object.minigameClass="minigame";
        minigameControl.Object.name = minigameXmlName;
        minigameControl.Object.retry=tries;
        minigameControl.Object.Games=[];
        minigameControl.Array.push(minigameControl.Object);
        PlayedMiniGameList.push(minigameControl.Object);
        
        $("#headerScoreID").text("Score: 0");
        
        $("#submitBtnID").text("SUBMIT");
        resetVars();
        minigameManager.startGame(ctr);
        //to = window.setTimeout(startTiming,1000);
    }
    else if($("#submitBtnID").text()=="NEXT" || $("#submitBtnID").text()=="FINISH"){
        $("#submitBtnID").text("SUBMIT");
        ctr++;
        minigameManager.startGame(ctr);
    }
    else if($("#submitBtnID").text()=="CONTINUE"){
        $("#submitBtnID").text("SUBMIT");
        resetVars();
        return;
    }
    else if($("#submitBtnID").text()=="CLOSE"){
        $("#closeBtnImg").mousedown();
    } 
    else{//THis is Submit
        checkMinigameReward();
    }
    
    window.setTimeout(function(){			
        $("#submitBtnID").unbind().on("mousedown",function(){
            verifyAnswer();
        });
    },500);
}

function checkMinigameReward(){
    if(minigameReward.length>0){
        ItemManager.getMinigameRewards(minigameReward[0],"checkMinigameReward");
        minigameReward.shift();
    }
    else minigameControl.stopSoundMedia();
}

function bindFeedbackScreen(msg,buttonToBind)
{
     $("#feedbackParentID").unbind();
     $("#feedbackTapMsg").text(msg);
     $("#feedbackParentID").unbind().on("mousedown",function()
     {$(buttonToBind).mousedown();});
    
}

function showCheckMark(bool){
    $("#feedbackParentID").css({
       height:$("#contentWrapper").height()+$("#footerWrapper").height()
    });
    
    var feedbackText = "";
    if(bool){
        feedbackText = minigameXMLManager.getCorrectFeedback();
        $("#feedbackParentID").css("background-image","url(images/minigames/mgs_correct.png)");
    }
    else {
        feedbackText = minigameXMLManager.getWrongFeedback();
        $("#feedbackParentID").css("background-image","url(images/minigames/mgs_wrong.png)");
    }

    if(feedbackText=="") {
        //verifyAnswer();
        //alert("no feedback:"+bool)
        ctr++;
        minigameManager.startGame(ctr);
        $("#submitBtnID").text("SUBMIT");
    }
    else {
        $("#feedbackParentID").html("<div id='feedbackText'>"+feedbackText+"</div>");
        
       // scoreDiv="<div>You got: "+prevScored+ " out of " +prevTotScore+"</div>";
       // $("#feedbackText").append(scoreDiv);
        
        FontUtils.resize("#feedbackText");
        
        tapDiv ="<div id='feedbackTapMsg'></div>";  
        $("#feedbackParentID").append(tapDiv);
        FontUtils.resize("#feedbackTapMsg");
        bindFeedbackScreen("Tap to Continue","#submitBtnID");
        
        $("#headerScoreID").html("Score : "+curGameScore);
        if(strFuncs.debug)$("#contentWrapper").hide();
        $("#feedbackParentID").fadeIn();
    }
}

function getCorrectReward(){
    var correctReward = minigameXMLManager.getCorrectReward();
    var correctPersistentReward = minigameXMLManager.getCorrectPersistentReward();
    var correctMultiplayertReward = minigameXMLManager.getCorrectMultiplayerReward();
    if(correctReward!=""){
        ItemManager.AwardReward(correctReward,1,"message"); 
    }
    else if(correctPersistentReward!=""){
        ItemManager.AwardPersistentReward(correctPersistentReward,1,"message"); 
    }
    else if(correctMultiplayertReward!=""){
        ItemManager.AwardMultiplayerReward(correctMultiplayertReward,1,"message"); 
    }
}