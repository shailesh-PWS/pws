/**
 * ...
 * @author Milbert Cale@Playware Studios
 */
var totalGameScore=0;
var minigameManager = new function(){   
    this.populate=function(){
        winText = minigameXMLManager.getWinText();
        console.log("winText:"+winText);
        loseText = minigameXMLManager.getLoseText();
        score = minigameXMLManager.getScore();
        showFeedback = minigameXMLManager.getShowFeedBack();
        showAnswer = minigameXMLManager.getShowAnswer();
        showRetry = minigameXMLManager.getShowRetry();
        hideBtn = minigameXMLManager.getHideBtn();
        totalScorableItem = minigameXMLManager.getTotalMinigame();
        totalItem = minigameXMLManager.getTotal();
        bgColor = minigameXMLManager.getBGColor();
        background = minigameXMLManager.getBackground();
        if(background=="")background="none"
        else background = "url("+background+")";
        htmlTxt = '<div id="headerBarID" class="minigame-class">'
                            +'<img id="instructionIcon" src="images/minigames/instruction.png"/>'
                            +'<span id="headerTotalID">0 of 0</span>'
                            +'<span id="headerScoreID">Score: 0</span>'
                    +'</div>'
                    + '<div id="contentWrapper" class="minigame-class">'

                    + '</div>'
                    +'<div id="footerWrapper" class="minigame-class">'
                        +'<div id="showAnswerBtnID">SHOW ANSWER</div>'
                        +'<div id="retryBtnID">RETRY</div>'
                       + '<div id="submitBtnID">SUBMIT</div>'
                    +'</div>  '
                    + '<div id="feedbackParentID"></div>'
            + '<div id="slideShowWrapper"></div>'
            +'<img id="closeBtnImg" src="images/minigames/exit_common.png" alt=""/>';
        $("#minigameWrapper").html(htmlTxt);
        if(hideBtn)$("#closeBtnImg").hide();
        else $("#closeBtnImg").show();
        $("#closeBtnImg").css({
            right: (($("#mainContentWindow").height()*scaleY)*.05)*.1,
            width:"auto",
            height:(($("#mainContentWindow").height()*scaleY)*.05)*.8
        });
        $("#instructionIcon").css({
            left: (($("#mainContentWindow").height()*scaleY)*.05)*.1
        });
        
        $("#contentWrapper").css({
            backgroundColor: bgColor,
            backgroundImage:background
        });
        
        $("#headerScoreID").css({
            left: (($("#mainContentWindow").height()*scaleY)*.05)*.1 + (($("#mainContentWindow").height()*scaleY)*.05)*.8 + 10
        });
        
        $("#headerTotalID").css({
            right: (($("#mainContentWindow").height()*scaleY)*.05)*.1 + (($("#mainContentWindow").height()*scaleY)*.05)*.8 + 10
        });
        
        minigameControl.init();

        resetMinigameVariables();
    };
    this.startGame=function(_ctr,retried){
        mainToCtr=0;
        soundFile="";
        stopSoundMedia();
        correctAnswers=[];
        currentAnswers=[];

        //strFuncs.log("STARTgaME");
        $("#slideShowWrapper").empty();
        $("#slideShowWrapper").hide();
        $("#feedbackParentID").hide();
        $("#showAnswerBtnID").hide();
        $("#retryBtnID").hide();
        $("#instructionIcon").hide();
        $("#submitBtnID").css("visibility","visible");

        var winBool;
        if(_ctr>=minigameXMLManager.getTotal()){
            winBool=false;
            var msg="";
            var reward="";
            var persistentreward="";
             var multiplayerreward="";
            
            minigameControl.Object.totalScoredGame=totalGameScore;
            minigameControl.Object.score=curGameScore;
            console.log("curGameScore:"+curGameScore+"==minigameXMLManager.getTotalMinigame():"+totalGameScore+"==minigameXMLManager.getScore():"+minigameXMLManager.getScore())
            var percentScore;
            
            minigameControl.Object.passed=true;
            winBool=true;
            msg = minigameXMLManager.getWinText();
            reward = minigameXMLManager.getWinReward();
            persistentreward = minigameXMLManager.getWinPersistentReward();
            multiplayerreward = minigameXMLManager.getWinMultiplayerReward();
            
            if(totalGameScore != 0) {
                percentScore = (curGameScore/totalGameScore)*100;
                if(percentScore >= minigameXMLManager.getScore()){
                    triggerQueueManager.setResultMinigame("1");
                }
                else {
                    minigameControl.Object.passed=false;
                    triggerQueueManager.setResultMinigame("2");
                    msg = minigameXMLManager.getLoseText();
                    reward = minigameXMLManager.getLoseReward();
                    persistentreward = minigameXMLManager.getLosePersistentReward();
                    multiplayerreward = minigameXMLManager.getLoseMultiplayerReward();
                    winBool=false;
                }
            }else{
                //this is scenario in case the minigame set was all slideshow.
                triggerQueueManager.setResultMinigame("1");
            }
            minigameControl.Object.reward=reward;
            minigameControl.Object.persistentreward=persistentreward;
            minigameControl.Object.multiplayerreward=multiplayerreward;
            if(persistentreward!=""){
               getMinigamePersistentReward(persistentreward,1, msg);
            }
            else if(reward!=""){
                getMinigameReward(reward,1, msg);
            }
            else if(multiplayerreward!=""){
               getMinigameMultiplayerReward(multiplayerreward,1, msg);
            }
            if(msg!="" && msg!="undefined"){
                if(winBool)$("#feedbackParentID").css("background-image","url(images/minigames/mgs_pass.png)");
                else $("#feedbackParentID").css("background-image","url(images/minigames/mgs_fail.png)");
                if(totalGameScore !=0){
                    $("#feedbackParentID").html("<div id='feedbackPercent'>"+parseInt(percentScore)+"%</div><div id='feedbackText'>"+msg+"</div>");
                }else{
                    $("#feedbackParentID").html("<div id='feedbackText'>"+msg+"</div>");
                }
                tapDiv ="<div id='feedbackTapMsg'></div>";  
                $("#feedbackParentID").append(tapDiv);
                FontUtils.resize("#feedbackTapMsg");
                
                FontUtils.resize("#feedbackPercent");
                FontUtils.resize("#feedbackText");
                $("#feedbackParentID").show();
            }  
            if(reward==""&&(msg=="" || msg =="undefined")){
                $("#closeBtnImg").mousedown();
            }
            
            $("#feedbackContentID").css({
                top:($("#contentWrapper").height()-$("#feedbackContentID").height())/2,
                left:($("#contentWrapper").width()-$("#feedbackContentID").width())/2
            });
            
            if(showRetry&&!winBool){$("#submitBtnID").text("RETRY"); bindFeedbackScreen("Tap to Retry","#submitBtnID");}
            else {
                $("#submitBtnID").text("CLOSE");bindFeedbackScreen("Tap to Continue","#submitBtnID");
            }
            return;
        }
        
        xmlList = minigameXMLManager.getXMLBlock(_ctr);
        currentXMLList = xmlList;
        gameType = $(xmlList).find("Type").text();
        instantRetry = ($(xmlList).find("InstantRetry").text()=="true")?true:false;
        if(!retried){
            triesAttempted=1;
            tries = ($(xmlList).find("Tries").text()=="")?0:$(xmlList).find("Tries").text();
            if(gameType!="SLIDESHOW")totalOverrollScore++;
        }
        else{
            triesAttempted++;
        }
        $("#contentWrapper").empty();
        
        if(gameType!="SLIDESHOW"&&!retried)scoredMiniCtr++;
        $("#headerTotalID").html(scoredMiniCtr+" of "+minigameXMLManager.getTotalMinigame());
        minigameControl.GameObject={};
        if(minigameControl.Object.Games){
            minigameControl.Object.Games.push(minigameControl.GameObject);
        }
        minigameControl.GameObject.index=_ctr;
        minigameControl.GameObject.gameType=gameType;
        if(gameType!="SLIDESHOW"){
            minigameControl.GameObject.answerShown=false;
            minigameControl.GameObject.instantRetried=false;
        }
        mainTo = setTimeout(showTimer, 1000);
        minigameReward=[];
        $(".minigame-class").show();
        switch(gameType){
            case "SLIDESHOW":
                $(".minigame-class").hide();
                getCorrectReward();
                Utils.getStringFromFile("/GameMedia/contents/slideshow.html","strGameLoadedForSlide");
                //strGameLoadedForSlide("D:/work/3DHive.mobi-Javascript/Game/Bug/GameMedia/contents/slideshow.html");
                break;
            case "COMIC STRIP":
                //$(".minigame-class").hide();
                Utils.getStringFromFile("/GameMedia/contents/ComicStrip.html","strGameLoaded");
                break;
            case "MCQ":
                console.log("wrapper size:"+$("#contentWrapper").width()+","+$("#contentWrapper").height());
                //$("#contentWrapper").load("contents/mcq.html");
                Utils.getStringFromFile("/GameMedia/contents/mcq.html","strGameLoaded");
                break;
            case "HIDDEN OBJECTS":
                //$("#contentWrapper").load("contents/hiddenobject.html");
                Utils.getStringFromFile("/GameMedia/contents/hiddenobject.html","strGameLoaded");
                break;
            case "SORTING":
                //$("#contentWrapper").load("contents/sorting.html");
                Utils.getStringFromFile("/GameMedia/contents/sorting.html","strGameLoaded");
                break;
            case "FILL IN THE BLANK(S)":
                 //$("#contentWrapper").load("contents/fillintheblanks.html");
                 Utils.getStringFromFile("/GameMedia/contents/fillintheblanks.html","strGameLoaded");
                break;
            case "MISSING PIECES":
                //$("#contentWrapper").load("contents/missingpieces.html");
                 Utils.getStringFromFile("/GameMedia/contents/missingpieces.html","strGameLoaded");
                break;
            case "STICKERS":
                //$("#contentWrapper").load("contents/stickers.html");
                Utils.getStringFromFile("/GameMedia/contents/stickers.html","strGameLoaded");
                break;
            case "NAME IT":
                //$("#contentWrapper").load("contents/nameit.html");
                Utils.getStringFromFile("/GameMedia/contents/nameit.html","strGameLoaded");
                break;
            case "MATCHING TYPE":
                //$("#contentWrapper").load("contents/matchingtype.html");
                Utils.getStringFromFile("/GameMedia/contents/matchingtype.html","strGameLoaded");
                break;
            case "BLANK PARTS":
                //$("#contentWrapper").load("contents/blankparts.html");
                Utils.getStringFromFile("/GameMedia/contents/blankparts.html","strGameLoaded");
                break;
            case "SEQUENCE":
                //$("#contentWrapper").load("contents/sequence.html");
                Utils.getStringFromFile("/GameMedia/contents/sequence.html","strGameLoaded");
                break;
            case "GROUPING":
                Utils.getStringFromFile("/GameMedia/contents/grouping.html","strGameLoaded");
                break;
            case "PICTURE ANALYSIS":
                Utils.getStringFromFile("/GameMedia/contents/pictureanalysis.html","strGameLoaded");
                break;
            case "JIGSAW PUZZLE":
                Utils.getStringFromFile("/GameMedia/contents/jigsawPuzzle.html","strGameLoaded");
                break;    
            case "SPOT THE DIFFERENCE":
                Utils.getStringFromFile("/GameMedia/contents/spotTheDiff.html","strGameLoaded");
                break;
            case "MEMORY GAME":
                Utils.getStringFromFile("/GameMedia/contents/memorygame.html","strGameLoaded");
                break;
            case "MENU MINI GAME":
                Utils.getStringFromFile("/GameMedia/contents/menuminigame.html", "strGameLoaded");
                break;
            case "BRANCHING TREE GAME":
                Utils.getStringFromFile("/GameMedia/contents/branchingtree.html", "strGameLoaded");
                break;
            case "TUMBLER":
                Utils.getStringFromFile("/GameMedia/contents/tumbler.html", "strGameLoaded");
                break;
            case "EXPERIMENT":
                Utils.getStringFromFile("/GameMedia/contents/Experiment.html","strGameLoaded");
                break;
            case "GROUPING ANALYSIS":
                Utils.getStringFromFile("/GameMedia/contents/groupingAnalysis.html","strGameLoaded");
                break;
            case "RESULT PAGE":
                Utils.getStringFromFile("/GameMedia/contents/Results.html","strGameLoaded");
                break;
			case "HTML PAGE":
                $(".minigame-class").hide();
                htmlFolderName =$(xmlList).find("folderName").text();
                fileToload = "/GameMedia/Html/"+htmlFolderName+"/index.html";
                Utils.getStringFromFile(fileToload,"strGameLoadedForSlide");
                break;
        }
    };
    
    this.resetDisplay=function(){
        $("#slideShowWrapper").empty();
        $("#slideShowWrapper").hide();
        $("#feedbackParentID").hide();
        $("#showAnswerBtnID").hide();
        $("#retryBtnID").hide();
        $("#minigameWrapper").show();
    }
};

// function strGameLoadedForSlide(file){

//     var reader = new FileReader();
//     reader.onload = function(event) {
//         var contents = event.target.result;
//         console.log("File contents: " + contents);

//         console.log("strGameLoadedForSlide");
//         $("#slideShowWrapper").show();
//         $("#slideShowWrapper").attr("src",str);
//         $("#minigameWrapper").show();
//         $("#submitBtnID").show();
//     };

//     reader.onerror = function(event) {
//         console.error("File could not be read! Code " + event.target.error.code);
//     };

//     reader.readAsText(file, "UTF-8");
// }

function strGameLoadedForSlide(str){
    str = str.replace(/"/g, "");
    str = str.replace(/@/g, "\"");
    $("#slideShowWrapper").show();
    $("#slideShowWrapper").html(str);
    $("#minigameWrapper").show();
    $("#submitBtnID").show();
}

function strGameLoaded(str){
    str = str.replace(/"/g, "");
    str = str.replace(/@/g, "\"");
    console.log(str);
    $("#contentWrapper").html(str);
    $("#minigameWrapper").show();
    $("#submitBtnID").show();
}

function showTimer(){
    mainToCtr++;
    //$("#headerTimerIconID").html(mainToCtr);
    mainTo = setTimeout(showTimer, 1000);
}

//This is th minigame reward.
function getMinigameReward(id,num,message)
{
    ItemManager.message=message;
    ItemManager.AwardReward(id,num,"minigameRewarded");
}

function getMinigamePersistentReward(id,num, message)
{
    ItemManager.AwardPersistentReward(id,num, message,"minigameRewarded");
}

function getMinigameMultiplayertReward(id,num, message)
{
    ItemManager.AwardMultiplayerReward(id,num, message,"minigameRewarded");
}

function minigameRewarded(){
    if(ItemManager.message=="" || ItemManager.message.toString()=="undefined")$("#closeBtnImg").mousedown();   
}

function _getScore(){
    return curGameScore;
}

function _getTotal(){
    return totalGameScore;
}

function _getPercent(){
    return parseInt(curGameScore/totalGameScore)*100;
}