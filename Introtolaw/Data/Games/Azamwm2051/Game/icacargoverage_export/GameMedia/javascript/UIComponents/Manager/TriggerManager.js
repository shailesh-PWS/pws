var TriggerState = new function(){
 
    this.ViewMode = false;
    
    this.setViewMode = function(bool){
        
        TriggerState.ViewMode = bool;
        
    }
    
}
var triggerObject={};
var TriggerManager = new function(){
    this.OpenMediaRequest=function(fn){//Listener for Uniwebview to open media trigger
        triggerObject = fn;
        //$("#mainContentWindow").remove();
        TriggerManager.ar = [];
        TriggerManager.isTrigger = true;
        LoadingBar.hide();
        if(triggerObject.MediaType=="intro")TriggerManager.initTriggerType(triggerObject);
        else VuplexManager.ChangeMode("false",triggerObject.MediaType,"TriggerManager.ChangeMode");
    }
    
    this.ChangeMode=function(data){
        TriggerManager.initTriggerType(triggerObject);
    }
    this.PopulateInventory=function(obj){//Listener for Uniwebview to populate inventory
        if(TriggerManager.isTrigger)TriggerManager.ar.push(obj);
        else setTimeout(function(){
            Inventory.getInventoryJSON(obj)
        },250);
    }
    this.PopulatePersistentInventory=function(obj){
            if(obj.ContinueMessageJson == "" || obj.ContinueMessageJson == "undefined")$("#closeBtnImg").mousedown();
			ItemManager.populatePersistentInventory(obj);
    }
    this.EndWriteLog=function(obj){

    }
    this.OnStopBGM=function(obj){
        
    }
    this.OnStopDialog=function(obj){
        
    }
    this.OnStopMinigameAudio=function(obj){
        
    }

    this.OnStopInstantMusic=function(obj){
        
    }
    this.OnStopSFX=function(obj){
        
    }
    
    this.obj = null;
    this.isTrigger=false;
	this.initTriggerType = function(obj)
	{
        if(TriggerState.ViewMode == false)
        {
            
            //Close all windows
            WindowManager.closeAllPanels();

            //Set current trigger
            WindowManagerGlobals.currentTrigger = obj;

            //console.log("TRIGGER OBJECT: " + JSON.stringify(obj))

            
            console.log("OBJ MEDIATYPE" + obj.MediaType);
            switch(obj.MediaType)
            {
                case "minigame" :
                        Global.tmpFocusMode = Global.focusModeActivated;
                        Content.initSkeleton(true);
                        Content.setTranparentFrame(true);
                        Content.Minigame(obj.URI);
                        TriggerState.ViewMode = true;
                break;

                case "dialog" :
                        //strFuncs.log("Dialog ON")
                        Dialog.showPanel(true);
                        Dialog.startDialogFromXML(obj)
                        TriggerState.ViewMode = true;
                break;

                case "url" :
                        console.log("URL ON")
                        Log.addAction("url",{uri:obj.URI})
                        Global.tmpFocusMode = Global.focusModeActivated;
                        Content.initSkeleton(false);
                        Content.setWindowTitle("")
                        Content.setTranparentFrame(false)
                        $(".contentWrapperClass").attr("src", obj.URI);
                        TriggerState.ViewMode = true;
                break;

                case "image" :
                        console.log("Image ON")
                        Log.addAction("image",{uri:obj.URI});
                        Global.tmpFocusMode = Global.focusModeActivated;
                        Content.initSkeleton(true);
                        Content.setTranparentFrame(false)
                        Content.BGColor("#273848");
                        $(".contentWrapperClass").attr("src", "contents/image.html?img="+obj.URI);
                        TriggerState.ViewMode = true;
                break;
                    
                case "intro":
                    Global.tmpFocusMode = Global.focusModeActivated;
                        
                    Content.initSkeleton(true);
                    Content.setTranparentFrame(true);
                    if(obj.URI!=""){
                        Content.Minigame(obj.URI);
                    }
                    else{
                        
                        Content.Intro();
                    }

                    TriggerState.ViewMode = true;
                    break;
            }
            
        }
	}
    this.initMinigameFromDialog=function(url){
        fromDialog=true;
        Global.tmpFocusMode = Global.focusModeActivated;
        Content.initSkeleton(true);
        Content.setTranparentFrame(true)
        Content.Minigame(url,false,true);
        TriggerState.ViewMode = true;
    }
}
