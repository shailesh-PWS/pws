/**
 * ...
 * @author Milbert Cale@Playware Studios
 */

//This processes the minigame menu xml file
var triggerQueueManager = new function(){
    this.resetQueue=function(){
        triggerQueueManager.triggerQueueArray=[];
        triggerQueueManager.objectTriggerArray=[];
        triggerQueueManager.currentMenuXML="";
        triggerQueueManager.currentIndex=0;
        triggerQueueManager.previousMenuXML="";
        triggerQueueManager.previousTriggerCount=0;
    }
    this.init=function(){
        triggerQueueManager.triggerQueueArray=[];
    };
    this.triggerQueueArray=[];
    this.objectTriggerArray=[];
    this.currentMenuXML="";
    this.currentIndex=0;
    this.previousMenuXML="";
    this.previousTriggerCount=0;
    this.addToQueue = function(xmlName){
        console.log("xmlName:"+xmlName);
        triggerQueueManager.triggerQueueArray.push(xmlName);
        triggerQueueManager.currentMenuXML = xmlName;
        triggerQueueManager.previousMenuXML="";
        triggerQueueManager.currentIndex=0;
        var result = $.grep(triggerQueueManager.objectTriggerArray, function(e){ return e.id == xmlName; });
        if(result.length==0)triggerQueueManager.objectTriggerArray.push({id:xmlName,ar:[]});
    };
    this.getStepUpTheQueueData=function(){
        if(triggerQueueManager.triggerQueueArray.length>0){
            
            triggerQueueManager.previousMenuXML = triggerQueueManager.triggerQueueArray[triggerQueueManager.triggerQueueArray.length-1];
            triggerQueueManager.previousTriggerCount = minigameXMLManager.getMenuTriggerArray().length;
            triggerQueueManager.triggerQueueArray.pop();
        }
        else{
            triggerQueueManager.previousMenuXML="";
            triggerQueueManager.previousTriggerCount=0;
            
        }
        console.log("====triggerQueueManager.triggerQueueArray.length:"+triggerQueueManager.triggerQueueArray.length);
        if(triggerQueueManager.triggerQueueArray.length>0){
            triggerQueueManager.currentMenuXML = triggerQueueManager.triggerQueueArray[triggerQueueManager.triggerQueueArray.length-1];
            return triggerQueueManager.triggerQueueArray[triggerQueueManager.triggerQueueArray.length-1];
        }
        else{
            triggerQueueManager.currentMenuXML="";
            triggerQueueManager.objectTriggerArray=[];
            return "";
        }
    };
    this.addObjectTriggerItem=function(id){
        for(var i=0;i<triggerQueueManager.objectTriggerArray.length;i++){
            if(triggerQueueManager.objectTriggerArray[i].id==minigameXmlName){
                var obj = triggerQueueManager.objectTriggerArray[i]; 
                var result = $.grep(obj.ar, function(e){ return e.id == id; });
                if(result.length==0){
                    var ob = {};
                    ob.id = id;
                    ob.clicked=false;
                    ob.status="0";
                    obj.ar.push(ob);
                }
            }
        }
    };
    this.setClickedMinigame=function(id){
        triggerQueueManager.currentIndex=id;
        for(var i=0;i<triggerQueueManager.objectTriggerArray.length;i++){
            if(triggerQueueManager.objectTriggerArray[i].id==minigameXmlName){
                var obj = triggerQueueManager.objectTriggerArray[i]; 
                var result = $.grep(obj.ar, function(e){ return e.id == id; });
                if(result.length>0){
                    var ob = result[0];
                    ob.clicked=true;
                }
            }
        }
    };
    this.setResultMinigame=function(status){
        for(var i=0;i<triggerQueueManager.objectTriggerArray.length;i++){
            if(triggerQueueManager.objectTriggerArray[i].id==triggerQueueManager.currentMenuXML){
                var obj = triggerQueueManager.objectTriggerArray[i];
                var result = $.grep(obj.ar, function(e){ return e.id == triggerQueueManager.currentIndex; });
                if(result.length>0){
                    var ob = result[0];
                    ob.status=status;
                }
            }
        }
    };
    
    this.getObjectTriggerItem=function(id){
        for(var i=0;i<triggerQueueManager.objectTriggerArray.length;i++){
            if(triggerQueueManager.objectTriggerArray[i].id==minigameXmlName){
                var obj = triggerQueueManager.objectTriggerArray[i];
                var result = $.grep(obj.ar, function(e){ return e.id == id; });
                if(result.length>0){
                    return result[0];
                }
                else return {};
            }
        }
    }
    
    this.getCurrentMenuXMLFile=function(){
        console.log("triggerQueueManager.triggerQueueArray.length:"+triggerQueueManager.triggerQueueArray.length);
        if(triggerQueueManager.triggerQueueArray.length>0){
            return triggerQueueManager.triggerQueueArray[triggerQueueManager.triggerQueueArray.length-1];
        }
        else{
            return "";
        }
    }
    this.processQueueExecution=function(){
        var topQueueMinigame = triggerQueueManager.triggerQueueArray[triggerQueueManager.triggerQueueArray.length-1];        
    };
};