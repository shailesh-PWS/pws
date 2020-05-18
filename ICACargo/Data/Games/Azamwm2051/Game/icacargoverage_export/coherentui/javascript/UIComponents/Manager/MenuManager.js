var MenuManager = new function(){
	this.init = function(){
		//engine.on('Ready',function()
		//{
			//var html="";

			//html+="<div id='menuWrapper'>"
			//		+"<div id='mainMenu'><img src='images/menuicons/menu_off.png'/></div>"
			//		+"<div id='inventoryMenu'><img src='images/menuicons/inv_off.png'/></div>"
			//		+"<div id='learningMenu'><img src='images/menuicons/chat_off.png'/></div>";
            //        
            //        if(Global.isMobilePlatform)
            //       {
            //            html += "<div id='focusMenu'><img src='images/menuicons/focus_off.png'/></div>"
            //        }

			//	html += "</div>";

			//$("body").append(html);

			//MenuManager.setUpListeners();
		//});
	}
	this.setUpListeners = function()
	{
		
		$("#inventoryMenu").click(function(){

			Global.showLearningBool = false;
			Learning.showPanel(Global.showLearningBool);
			MenuManager.updateMenuManagerButtonState("learning","off")

			Global.showInvBool=!Global.showInvBool;
			Inventory.showPanel(Global.showInvBool);
			MenuManager.updateMenuManagerButtonState("inventory",MenuManager.convertBoolToState(Global.showInvBool))
		});

		$("#learningMenu").click(function(){

			Global.showInvBool = false;
			Inventory.showPanel(Global.showInvBool);
			MenuManager.updateMenuManagerButtonState("inventory","off")

			Global.showLearningBool=!Global.showLearningBool;
			Learning.showPanel(Global.showLearningBool);
			MenuManager.updateMenuManagerButtonState("learning",MenuManager.convertBoolToState(Global.showLearningBool))

		});

		$('#mainMenu').click(function(){

			//RETURN BACK TO THE MAIN MENU
			MenuManager.updateMenuManagerButtonState("menu","on");

			//OPEN UP A MODEL NOTIFICATION
            if(Global.tmpExitMode != true)
            {
                //ASSIGN TEMP EXIT MODE
                Global.tmpExitMode = true;

                //TEMPORARY STORE FOCUS MODE
                Global.tmpFocusMode = Global.focusModeActivated;

                //PAUSE THE GAME
                engine.call("EventCoherentUIBinder.Pause", true)

                //SHOW MOUSE
                engine.trigger("EventCoherentUIBinder.ChangeMode", false, "mainmenu");

                //RETURN BACK TO THE MAIN MENU
                MenuManager.updateMenuManagerButtonState("menu","on");

                noty({
                    text: 'Hey, are you sure you are ready to quit?',
                    buttons: [
                        {addClass: 'btn btn-primary', text: 'Yes Please', onClick: function($noty) {

                                engine.call("UserCoherentUIBinder.HasArgument","-preview").then(function(data){
                                                    
                                    console.log("PREVIEW SUPPORTED: " + data)
                                    if(data)
                                    {
                                        //Exit App
                                        engine.call("UserCoherentUIBinder.QuitApp");

                                    }
                                    else
                                    {
                                        //RETURN BACK TO THE MAIN MENU
                                        MenuManager.updateMenuManagerButtonState("menu","off");

                                        Log.addAction("gameexit",{exitstate:"userdefinedexit"});
                                        LoggingManager.completeAndStoreLog(MenuManager.exitapplication);

                                        this.buttons = [];
                                        //this.update();

                                        Global.tmpExitMode = false;
                                    }

                                });
                            }
                        },
                        {addClass: 'btn btn-danger', text: 'No Thanks', onClick: function($noty) {
                                
                                //RETURN BACK TO THE MAIN MENU
                                MenuManager.updateMenuManagerButtonState("menu","off");
                            
                                engine.call("EventCoherentUIBinder.Pause", false)
                                engine.trigger("EventCoherentUIBinder.ChangeMode", Global.tmpFocusMode, "gameon");
                                $noty.close();

                                Global.tmpExitMode = false;
                            }
                        }
                    ],
                    modal:true,
                    layout:'center'
                });

            }
        
		})

		$('#focusMenu').click(function(){
			engine.trigger("EventCoherentUIBinder.ChangeMode", !Global.focusModeActivated);
		})
		
		engine.on("EventCoherentUIBinder.ControlModeChanged", MenuManager.OnFocusModeChanged);
	}
	
	this.OnFocusModeChanged = function(obj)
	{
		Global.focusModeActivated=obj;
		Focus.showPanel(Global.focusModeActivated)
		MenuManager.updateMenuManagerButtonState("focus",MenuManager.convertBoolToState(Global.focusModeActivated))
	}
    this.exitapplication = function()
    {
        console.log("APPLICATION CLOSE CALLBACK")
        engine.call('EventCoherentUIBinder.BackToMainMenu')
    }
	this.convertBoolToState = function(bool)
	{
		if(bool) return "on"
		else return "off" 
	}
	this.updateMenuManagerButtonState = function(id,state)
	{
		switch(id)
		{
			case "inventory" :

				$("#inventoryMenu img").attr('src','images/menuicons/inv_' + state + '.png')

			break;

			case "learning" :

				$("#learningMenu img").attr('src','images/menuicons/chat_' + state + '.png')

			break;

			case "menu" :

				$("#mainMenu img").attr('src','images/menuicons/menu_' + state + '.png')

			break;

			case "focus" :

				$("#focusMenu img").attr('src','images/menuicons/focus_' + state + '.png')

			break;
		}
	}
}