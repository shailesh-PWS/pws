$(document).ready(function(){

	
        console.log("document ready is set")
	//SEND AND INITIALISE PANELS TO WINDOW MANAGER
	engine.on('Ready',function(){
        
        console.log("engine ready")
        //CHECK TO SEE WHETHER MOBILE DEVICE IS MOBILE
        engine.call('UserCoherentUIBinder.IsMobilePlatform').then(function(data){
			Global.isMobilePlatform = data;
		});
        
        Utils.getXMLFromFile("/items.xml",function(xml){
            try{
                ItemManager.itemJSON = $.xml2json(xml).ObjectiveItem.item;
                Utils.getXMLFromFile("/statusuiobject.xml",function(xml){
                    try{
                        ItemManager.statusJSON = $.xml2json(xml).StatusUI;
                        for(var i=0;i<ItemManager.itemJSON.length;i++){
                            ItemManager.itemJSON[i].isScorable = isScorable(ItemManager.itemJSON[i]);
                        }
                    }
                    catch(e)
                    {
                        
                    }
                })
            }
            catch(e)
            {
                
            }
        })
        
        function isScorable(itemObj){
            var bool=(itemObj.isScorable!=undefined)?itemObj.isScorable:false;
            for(var j=0;j<ItemManager.statusJSON.length;j++){
                if(ItemManager.statusJSON[j].ID==itemObj.statusID){
                    if(ItemManager.statusJSON[j].affectScore!=undefined){
                        bool = ItemManager.statusJSON[j].affectScore;
                        break;
                    }
                }
            }
            if(bool.toString()=="true")bool=true;
            else bool = false;
            return bool;
        }
        
        
        
        //INITIALISE LOG, AUTOMATICALLY ADDS START SESSION TIME STAMP
        LoggingManager.initLoggingManager();

		//INITIALIZE DIALOG
		WindowManager.initPanelToManager("inventory",Inventory,true);
		WindowManager.initPanelToManager("learning",Learning,true);
		WindowManager.initPanelToManager("focus",Focus,true);

		//SETUP OTHER NON PANEL RELATED SYSTEMS
		MenuManager.init();
		
		//SETUP PANEL
		WindowManager.initPanelToManager("dialog",Dialog,true);

		//SETUP INITIAL RUNTIME COMPONENTS
		TriggerManager.init();
        NotificationManager.init();
        ObjectiveManager.init();
        WorldSettings.init();
        
        
        //PREACTIVE FOCUS MODE
        Global.focusModeActivated = true
        engine.trigger("EventCoherentUIBinder.ChangeMode", Global.focusModeActivated, "gameon");
        
        //DISABLE PAUSE MODE
        engine.call("EventCoherentUIBinder.Pause", false);
        
        
        //DISABELD FOR THE TIME BEING
        /*
        engine.on("AuthStatus",function(data){
            
            if(Global.tmpauth != data) console.log("AuthStatus Update:" + data);
            
            Global.tmpauth = data;
            
            if(Global.tmpauth == 2)
            {
                engine.call("OneNote_Bindings.InitMessageStore").then(function(data){
                    
                    
                    
                });
            }
            
            if(Global.tmpauth == 3)
            {
                Notes.updateNotes();
            }

        })
        */
        
        
        //SETUP ENGINE LISTENERS
		engine.on("OnEngineMessage",function(data){
            
            console.log("Engine Message: " + data.MessageContent)
		});
        
	})
})