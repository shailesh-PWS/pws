var ObjectiveManager = new function()
{
    this.objectiveIsSupported;
    this.currentStatusArray = [];
    
	this.init = function()
	{
        console.log("OBJECTIVE INITIALISING")
        
        //RESET COUNT
        currentStatusArray = []
        
		//FIRST LOAD THE GAMES OBJECTIVE XML
		Utils.loadXMLFromURLReturnXMLObject("/objectives.xml",ObjectiveManager.objectiveXmlLoaded)
	}
    
	this.objectiveXmlLoaded = function(xml)
	{
		if(xml != null || xml != undefined || xml != "")
		{
			Global.objectivejson = $.xml2json(xml);
            
            console.log("OBJECTIVE LOOKS GOOD: " + Global.objectivejson.objective)
            
            if(Global.objectivejson.objective != undefined)
            {
                console.log("Objective Supported")
                ObjectiveManager.objectiveIsSupported = true;
            }
            else
            {
                console.log("Objective Not Supported")
                ObjectiveManager.objectiveIsSupported = false;
            }

			ObjectiveManager.prepareObjectiveUI();
		}
	}
    
	this.prepareObjectiveUI = function()
	{
		var str = "";
        
        console.log("is supported: " + ObjectiveManager.objectiveIsSupported)

		if(ObjectiveManager.objectiveIsSupported != true)
        {
            str += "<p>No Objectives</p>"
        }
        else
        {
            Global.objectivejson.objective = Utils.convertObjectToArray(Global.objectivejson.objective);
            
            for(var i=0; i<Global.objectivejson.objective.length; i++)
            {
                str += "<div class='objectiveBlock' obj-id='" + Global.objectivejson.objective[i].id + "'>";

                    str += "<div obj-id='" + Global.objectivejson.objective[i].id + "' class='grid2 objectiveIcon objIconPanel'></div>"
                    str += "<div class='grid10'>" + Global.objectivejson.objective[i].title + "</div>"
                    str += "<div class='grid12 qty_val'><b obj-id='" + Global.objectivejson.objective[i].id + "'>Collected 0 of " + Global.objectivejson.objective[i].total + "</b></div>"

                str += "</div>"
            }        
        }
        
		$('#objectiveWrapper').empty().append($(str));
	}

	this.updateObjectivesList = function(data)
	{
        if(ObjectiveManager.objectiveIsSupported)
        {
            var gate = false;

            //FIRST WE RUN THROUGH INVENTORY LIST

            //LETS TEMP STORE THE ITEM OBJECT
            var itemobj = Inventory.getItemObject(data.ItemID);
            
            Global.objectivejson.objective = Utils.convertObjectToArray(Global.objectivejson.objective);
            
            //NEXT WE NEED TO FIND THE MATCH
            for(var j=0; j<Global.objectivejson.objective.length; j++)
            {
                Global.objectivejson.objective[j].data.id = Utils.convertObjectToArray(Global.objectivejson.objective[j].data.id);
                
                //LETS CHECK TO SEE WHETHER THE OBJECTIVE ID EXISTS
                for(var k=0; k<Global.objectivejson.objective[j].data.id.length; k++)
                {
                    if(itemobj.id == Global.objectivejson.objective[j].data.id[k])
                    {
                        console.log("ADDING TO OBJECTIVE SINGLE OBJECTIVE: " + Global.objectivejson.objective[j].id[k] + ", " + data.quantity);

                        //WE HAVE FOUND A MATCHING ID TO THE OBJECTIVE ID
                        ObjectiveManager.addToObjectiveCountArray(ObjectiveManager.currentStatusArray,Global.objectivejson.objective[j].id, itemobj.id, data.quantity);
                        
                        gate = true;
                    }
                }
            }
        }

        //CHECK IF NOTIFICATION IS NEEDED
        if(gate) NotificationManager.pushNotificationToPlayer("You picked up <b>" + itemobj.name + " </b>which is part of an objective.");

        //UPDATE OBJECTIVE PANEL BASED ON ID
        ObjectiveManager.updateObjectiveCountsBasedOffData(ObjectiveManager.currentStatusArray);

        //CHECK TO SEE IF ALL OBJECTIVES HAVE BEEN MET
        ObjectiveManager.checkToSeeIfAllObjectivesHaveBeenMet();
    }

	this.checkToSeeIfAllObjectivesHaveBeenMet = function()
	{
		var complete = true;
        
        Global.objectivejson.objective = Utils.convertObjectToArray(Global.objectivejson.objective);
        for(var i=0; i<Global.objectivejson.objective.length; i++)
        {
            if(Global.objectivejson.objective[i].status == "incomplete")
            {
                complete = false;
            }
        }
        
		if(complete)
		{
			Log.addAction("allobjectivescomplete",true)
            
            //ASSIGN TEMP EXIT MODE
            Global.tmpExitMode = true;   
            
            //PAUSE THE GAME
            engine.call("EventCoherentUIBinder.Pause", true)

            //SHOW MOUSE
            setTimeout(function(){
                engine.trigger("EventCoherentUIBinder.ChangeMode", false, "mainmenu");
            },500);
            
            //SHOW DIALOG
            noty({
                    text: 'Well Done, you completed all the objectives for this scenario!',
                    buttons: [
                        {addClass: 'btn btn-primary', text: 'OK', onClick: function($noty) {

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

                                        Log.addAction("gameexit",{exitstate:"objectivecomplete"});
                                        LoggingManager.completeAndStoreLog(MenuManager.exitapplication);

                                        this.buttons = [];

                                        Global.tmpExitMode = false;
                                    }

                                });
                            }
                        }
                    ],
                    modal:true,
                    layout:'center'
                });
            engine.trigger("EventCoherentUIBinder.ChangeMode", false, "mainmenu");
		}
	}
    
    this.updateObjectiveStatusBasedOnData = function(data)
    {
    }
        
	this.updateObjectiveCountsBasedOffData = function(data)
	{

		console.log("OBJECTIVE ARY IN: " + JSON.stringify(data))
		for(var i=0; i<data.length; i++)
		{
			
			if(ObjectiveManager.checkIfObjectiveIsMet(data[i]))
			{
				console.log("COMPLETE: " + JSON.stringify(data[i]))
                
				$('b[obj-id=' + data[i].id + ']').text('Completed ' + ObjectiveManager.getObjectiveTotalOffID(data[i].id) + ' of ' + ObjectiveManager.getObjectiveTotalOffID(data[i].id));
				$('.objIconPanel[obj-id=' + data[i].id + ']').removeClass('objectiveIcon').addClass('objectiveIconComplete');
                
                //LoggingManager.addAction("objectivecomplete",)
			}
			else
			{
				console.log("NOT COMPLETE: " + JSON.stringify(data[i]))
				$('b[obj-id=' + data[i].id + ']').text('Collected ' + data[i].val + ' of ' + ObjectiveManager.getObjectiveTotalOffID(data[i].id));
			}
			
		}
	}
    
	this.getObjectiveTotalOffID = function(id)
	{
        Global.objectivejson.objective = Utils.convertObjectToArray(Global.objectivejson.objective);
        
        for(var i=0; i<Global.objectivejson.objective.length; i++)
        {
            if(Global.objectivejson.objective[i].id == id)
            {
                return Global.objectivejson.objective[i].total
            }
        }
	}
    
	this.checkIfObjectiveIsMet = function(data)
	{
        // iterate through each objective
        Global.objectivejson.objective = Utils.convertObjectToArray(Global.objectivejson.objective);

        for(var i=0; i<Global.objectivejson.objective.length; i++)
        {
            // compare the objective id
            if(data.id == Global.objectivejson.objective[i].id)
            {
                Global.objectivejson.objective[i].data.id = Utils.convertObjectToArray(Global.objectivejson.objective[i].data.id);
                
                // iterate through each item data in the current objective
                for(var j=0; j < Global.objectivejson.objective[i].data.id.length; j++)
                {
                    console.log("CURRENT: " + Global.objectivejson.objective[i].id + " : " + Global.objectivejson.objective[i].total)
                    return ObjectiveManager.updateObjectiveStatus(Global.objectivejson.objective[i], data);
                }
            }
        }

		return false
	}
    
    this.updateObjectiveStatus = function(currentObjective, tempObjectiveData)
    {
        if(tempObjectiveData.val < currentObjective.total) 
        {
            currentObjective.status = "incomplete"
            return false
        }
        else
        {
            if(currentObjective.status != "complete") NotificationManager.pushNotificationToPlayer("You completed objective <b>" + currentObjective.name + " </b>","success");
            currentObjective.status = "complete"
            return true
        }
    }
    
	this.addToObjectiveCountArray = function(ary, id, itemId, amount)
	{
		var gate = false;

		console.log(id + ", " + amount)

		if(ary.length == 0)
		{
			console.log("ARRAY ZERO")
			ary.push({id:id, itemIds:[itemId], val:amount});
		}
		else
		{
			for(var i=0; i<ary.length; i++)
			{
				if(ary[i].id == id)
                {
                    if(ary[i].itemIds.length == 0)
                    {
                        ary[i].itemIds.push(itemId);
                    }
                    else
                    {
                        for(var j=0; j < ary[i].itemIds; j++)
                        {
                            if(ary[i].itemIds[j] == itemId)
                            {	
                                console.log("MATCHED ARY ID")
                                ary[i].val += amount;
                            }
                            else
                            {
                                ary.push({id:id, itemIds:[itemId], val:amount});
                            }
                        }
                    }
                }
			}
		}
	}
}
