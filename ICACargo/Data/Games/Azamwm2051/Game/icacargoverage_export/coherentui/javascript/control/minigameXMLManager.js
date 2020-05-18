/**
 * ...
 * @author Milbert Cale@Playware Studios
 */

var minigameXMLManager = new function(){
    this.setMinigameXML = function(xml){
        minigameXML = xml;
        //alert(minigameXML)
    }
    this.getBGColor=function(){
        return ($(minigameXML).find("bgColor").text()!="")?$(minigameXML).find("bgColor").text():"rgba(255,255,255,1)";
    }
    this.getXMLBlock=function(ctr){
        return $(minigameXML).find("MGame")[ctr];
    };
    this.getWinText = function(){
        return $(minigameXML).find("WinText").text();
    };
    this.getLoseText = function(){
        return $(minigameXML).find("LoseText").text();
    };
    this.getCorrectReward = function(){
        return $($(minigameXML).find("MGame")[ctr]).find("correctReward").text();
    }
    this.getCorrectPersistentReward = function(){
        return $($(minigameXML).find("MGame")[ctr]).find("correctPersistentReward").text();
    }
    this.getCorrectMultiplayerReward = function(){
        return $($(minigameXML).find("MGame")[ctr]).find("correctMultiplayerReward").text();
    }
    this.getWrongReward = function(){
        return $($(minigameXML).find("MGame")[ctr]).find("wrongReward").text();
    }
    this.getWrongPersistentReward = function(){
        return $($(minigameXML).find("MGame")[ctr]).find("wrongPersistentReward").text();
    }
    this.getWrongMultiplayerReward = function(){
        return $($(minigameXML).find("MGame")[ctr]).find("wrongMultiplayerReward").text();
    }
    this.getWinReward = function(){
        return $($(minigameXML).find("Reward")).find("greater").text();
    };
    this.getLoseReward = function(){
        return $($(minigameXML).find("Reward")).find("lesser").text();
    };
    this.getWinPersistentReward = function(){
        return $($(minigameXML).find("Reward")).find("greaterpersistent").text();
    };
    this.getLosePersistentReward = function(){
        return $($(minigameXML).find("Reward")).find("lesserpersistent").text();
    };
    this.getWinMultiplayerReward = function(){
        return $($(minigameXML).find("Reward")).find("greatermultiplayer").text();
    };
    this.getLoseMultiplayerReward = function(){
        return $($(minigameXML).find("Reward")).find("lessermultiplayer").text();
    };
    this.getScore = function(){
        if($($(minigameXML).find("Reward")).find("sc").text()=="none" || $($(minigameXML).find("Reward")).find("sc").text()=="")return 100;
        else return $($(minigameXML).find("Reward")).find("sc").text();
    };
    this.getShowFeedBack = function(){
        var fb = $(minigameXML).find("ShowFeedBack").text();
        return (fb=="true")?true:false;
    };
    this.getCorrectFeedback = function(){
        return $($(minigameXML).find("MGame")[ctr]).find("CorrectFeedback").text();
    };
    this.getShowOnload = function(){
        var bool = false;
        bool = ($($(minigameXML).find("MGame")[ctr]).find("showOnload").text()=="false")?false:true;
        return bool;
    };
    
    this.getInstructionImage = function(){
        return $($(minigameXML).find("MGame")[ctr]).find("pathInstructionImg").text();
    };
    this.getInstructions = function(){
        return $($(minigameXML).find("MGame")[ctr]).find("Question").text();
    };
    
    this.getWrongFeedback = function(){
        return $($(minigameXML).find("MGame")[ctr]).find("WrongFeedback").text();
    };
    this.getShowRetry = function(){
        var rt = $(minigameXML).find("ShowRetry").text();
        return (rt=="true")?true:false;
    };
    this.getShowAnswer = function(){
        var ans = $(minigameXML).find("ShowAnswer").text();
        return (ans=="true")?true:false;
    };
    this.getExit = function(){
        var ans = $(minigameXML).find("Exit").text();
        return (ans=="true")?true:false;
    };
    this.getTotalMinigame=function(){
        var _ctr=0;
        for(var i=0;i<$(minigameXML).find("MGame").length;i++){
            if($($(minigameXML).find("MGame")[i]).find("Type").text()!="SLIDESHOW"){
                _ctr++;
            }
        }
        return _ctr;
    };
    this.getTotalSlideShow=function(){
        var _ctr=0;
        for(var i=0;i<$(minigameXML).find("MGame").length;i++){
            if($($(minigameXML).find("MGame")[i]).find("Type").text()=="SLIDESHOW"){
                _ctr++;
            }
        }
        return _ctr;
    };
    this.getTotal=function(){
        return $(minigameXML).find("MGame").length;
    };
    
    this.getWindowSize=function(){
        return $(minigameXML).find("windowSize").text();
    };
    
    this.getWindowPercentWSize=function(){
        return $(minigameXML).find("windowPercentWSize").text();
    };
    this.getWindowPercentHSize=function(){
        return $(minigameXML).find("windowPercentHSize").text();
    };
    
    this.getWindowPosition=function(){
        return $(minigameXML).find("windowPosition").text();
    };
    
    this.getWindowXpos=function(){
        return $(minigameXML).find("windowXpos").text();
    };
    
    this.getWindowYpos=function(){
        return $(minigameXML).find("windowYpos").text();
    };
    
    this.getTransition=function(){
        return $(minigameXML).find("transition").text();
    };
    
    this.getTransDuration=function(){
        return $(minigameXML).find("transDuration").text();
    };
    this.getHideBtn = function(){
        return ($(minigameXML).find("hideCloseBtn").text()=="true")?true:false;
    }
    this.getBackground=function(){
        return $(minigameXML).find("background").text();
    }
    this.getName=function(){
        return $(minigameXML).find("name").text();
    }
    this.getDescription=function(){
        return $(minigameXML).find("description").text();
    }
    this.getMinigameClass=function(){
        return $(minigameXML).find("class").text();
    };
    this.getMenuBG=function(){
        return $(minigameXML).find("path").text();
    }
    this.getMenuImageSize=function(){
        return ($(minigameXML).find("resize").text()=="fill")?"cover":"contain";
    }
    this.getMenuWidth=function(){
        return $($(minigameXML).find("width")[0]).text();
    }
    this.getMenuHeight=function(){
        return $($(minigameXML).find("height")[0]).text();
    }
    this.getMenuImageArray=function(){
        var ar=[];
        var obj;
        if($(minigameXML).find("image").text()!=""){
            for(var i=0;i<$(minigameXML).find("image").length;i++){
                obj={};
                obj.path=$($(minigameXML).find("image")[i]).find("path").text();
                obj.bg=($($(minigameXML).find("image")[i]).find("bg").text()=="true")?true:false;
                obj.width=$($(minigameXML).find("image")[i]).find("width").text();
                obj.height=$($(minigameXML).find("image")[i]).find("height").text();
                obj.xPos=$($(minigameXML).find("image")[i]).find("xPos").text();
                obj.yPos=$($(minigameXML).find("image")[i]).find("yPos").text();
                ar.push(obj);
            }
        }
        return ar;
    };
    
    this.getcloseOption=function(){
        return $(minigameXML).find("closeOption").text();
    }
    
    this.getdisableOption=function(){
        return $(minigameXML).find("disableOption").text();
    }
    
    this.getMenuTriggerArray=function(){
        var ar=[];
        var obj;
        if($(minigameXML).find("trigger").text()!=""){
            for(var i=0;i<$(minigameXML).find("trigger").length;i++){
                obj={};
                obj.width=$($(minigameXML).find("trigger")[i]).find("width").text();
                obj.height=$($(minigameXML).find("trigger")[i]).find("height").text();
                obj.xPos=$($(minigameXML).find("trigger")[i]).find("xPos").text();
                obj.yPos=$($(minigameXML).find("trigger")[i]).find("yPos").text();
                obj.linkageID=$($(minigameXML).find("trigger")[i]).find("linkageID").text();
                ar.push(obj);
            }
        }
        return ar;
    };
    
    this.testingXML = function(func){

        var xmlTest="<xml>"
            +"<class>minigame</class>"
            +"<MGame score='20'>"
             +" <Type>GROUPING</Type>"
             +" <Question><![CDATA[Group the items.]]></Question>"
             +" <Group>"
             +"   <Name>Animals</Name>"
             +"   <Item><![CDATA[Dog Dog Dog Dog Dog Dog Dog]]></Item>"
             +"   <Path0><![CDATA[Minigames/images/2412494110000.png]]></Path0>"
             +"   <Item><![CDATA[Dog]]></Item>"
             +"   <Path1><![CDATA[Minigames/images/2412494110000.png]]></Path1>"
             +"   <Item><![CDATA[Dog]]></Item>"
             +"   <Path2><![CDATA[Minigames/images/2412494110000.png]]></Path2>"
             +"   <Item><![CDATA[Dog]]></Item>"
             +"   <Path3><![CDATA[Minigames/images/2412494110000.png]]></Path3>"
             +" </Group>"
             +" <Group>"
             +"   <Name>Human</Name>"
             +"   <Item><![CDATA[Man]]></Item>"
             +"   <Path0><![CDATA[Minigames/images/2412494110010.png]]></Path0>"
             +" </Group>"
           +" </MGame>"
          +"  <ShowFeedBack>false</ShowFeedBack>"
           +" <ShowAnswer>false</ShowAnswer>"
           +" <ShowRetry>true</ShowRetry>"
           +" <Reward>"
           +"   <greater/>"
           +"   <lesser/>"
           +"   <sc>99</sc>"
           +" </Reward>"
           +" <WinText/>"
           +" <LoseText/>"
           +" <windowSize>0</windowSize>"
           +" <transition>0</transition>"
          +"</xml>";
  
        func(minigameXMLManager.convertXMLStringToXMLObject(xmlTest));
    };
    
    this.convertXMLStringToXMLObject = function(str)
    {
        var doc
        if(window.ActiveXObject)
        {
            doc = new ActiveXObject("Microsoft.XMLDOM")
            doc.async = "false";
            doc.loadXML(str);
        }
        else
        {
            var parser = new DOMParser();
            doc = parser.parseFromString(str, 'text/xml');
        }
        return doc;
    }
};