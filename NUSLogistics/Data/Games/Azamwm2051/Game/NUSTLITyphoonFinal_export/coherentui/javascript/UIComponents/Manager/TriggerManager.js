var TriggerState = new function(){
 
    this.ViewMode = false;
    
    this.setViewMode = function(bool){
        
        TriggerState.ViewMode = bool;
        
    }
    
}
var TriggerManager = new function(){
    this.forceClose=false;
	this.init = function(){
		engine.on("OpenMediaRequest", function(fn)
		{
			console.log("TRIGGER: " + JSON.stringify(fn))
			TriggerManager.initTriggerType(fn);
		});

		//Need to create a class to build the listeners for others but triggers. Temporarily it would be here.
		engine.on("PopulateInventory",function(obj){
            console.log("Test"+JSON.stringify(obj));
            if(obj.ContinueMessageJson == "" || obj.ContinueMessageJson == "undefined")$("#closeBtnImg").mousedown();
			Inventory.getInventoryJSON(obj);
		});
        
		engine.on("PopulatePersistentInventory",function(obj){
            //console.log("Test"+JSON.stringify(obj));
            if(TriggerManager.forceClose&&(obj.ContinueMessageJson == "" || obj.ContinueMessageJson == "undefined"))$("#closeBtnImg").mousedown();
			ItemManager.populatePersistentInventory(obj);
		});

        
		//Setup the root URI directory
		engine.call("EventCoherentUIBinder.GetGameDirectory").then(function(data){
			
			Global.gamedirectory = data + "/";
            
            console.log("GAME DIRECTORY: " + Global.gamedirectory);
			
		})

	}
	this.initTriggerType = function(obj)
	{
        if(TriggerState.ViewMode == false)
        {
            //Close all windows
            WindowManager.closeAllPanels();

            //Set active window and content
            if(WindowManagerGlobals.currentTrigger === obj)
            {
                console.log("Same Trigger Item Coming Through")   
            }

            //Set current trigger
            WindowManagerGlobals.currentTrigger = obj;

            //console.log("TRIGGER OBJECT: " + JSON.stringify(obj))

            switch(obj.MediaType)
            {
                case "minigame" :

                        console.log("Minigame ON")

                        Global.tmpFocusMode = Global.focusModeActivated;
                        engine.trigger("EventCoherentUIBinder.ChangeMode", false, obj.MediaType);

                        Content.initSkeleton(true);
                        Content.setTranparentFrame(true)

                        Content.Minigame(obj.URI);

                        TriggerState.ViewMode = true;
                    
                break;

                case "dialog" :

                        console.log("Dialog ON")
                        
                        engine.trigger("EventCoherentUIBinder.ChangeMode", false, obj.MediaType);

                        Dialog.showPanel(true);
                        Dialog.startDialogFromXML(obj)

                        TriggerState.ViewMode = true;
                    

                break;

                case "url" :


                        console.log("URL ON")

                        Log.addAction("url",{uri:obj.URI})

                        Global.tmpFocusMode = Global.focusModeActivated;
                        engine.trigger("EventCoherentUIBinder.ChangeMode", false, obj.MediaType);

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
                        engine.trigger("EventCoherentUIBinder.ChangeMode", false, obj.MediaType);

                        Content.initSkeleton(false);
                        Content.setTranparentFrame(false)
                        Content.BGColor("#273848");
                        $(".contentWrapperClass").attr("src", "contents/image.html?img="+obj.URI);
                        //$(".contentWrapperClass").attr("src", "Information/" + obj.URI);

                        TriggerState.ViewMode = true;
                break;
                case "intro":
                    console.log("Intro is available");
                    Global.tmpFocusMode = Global.focusModeActivated;
                        
                    Content.initSkeleton(true);
                    Content.setTranparentFrame(true);
                    console.log("obj.URI:"+obj.URI);
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
        fromDialog = true;
        Global.tmpFocusMode = Global.focusModeActivated;
        Content.initSkeleton(true);
        Content.setTranparentFrame(true)
        Content.Minigame(url,false,true);
        TriggerState.ViewMode = true;
    }
}