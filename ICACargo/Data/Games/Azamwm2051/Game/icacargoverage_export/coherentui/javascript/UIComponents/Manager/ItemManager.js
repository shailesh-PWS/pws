var ItemManager = new function(){
    Global.persItemCollected=[];
	this.getReward = function(reward,qty, message){
        if(!message)message="";
		engine.call("EventCoherentUIBinder.AwardReward",parseInt(reward),qty, message);
	}
    this.getPersistentReward = function(reward,qty, message){
        if(!message)message="";
        TriggerManager.forceClose=true;
		engine.call("EventCoherentUIBinder.AwardPersistentReward",reward,qty, message);
        //var persItem = new Object();
       // persItem.reward = reward;
       // persItem.qty = qty;
       // Global.persItemCollected.push(persItem);
	}
    this.getMultiplayerReward = function(reward,qty, message){
        if(!message)message="";
		engine.call("EventCoherentUIBinder.AwardMultiplayerReward",reward,qty, message);
	}
    
    this.resetPersistentReward = function (reward){
        TriggerManager.forceClose=false;
		engine.call("EventCoherentUIBinder.ResetPersistentReward",reward);
        //EventCoherentUIBinder.ResetPersistentReward
    }
    this.populatePersistentInventory = function(obj){
        
        console.log("GET INVENTORY: " + JSON.stringify(obj));
        
       // Global.LatestInventoryItemJSON = $.parseJSON(obj.DeltaJson);
		Global.perItemsList = $.parseJSON(obj.FullInventoryJson);
        var persItem = new Object();
        persItem.reward = $.parseJSON(obj.DeltaJson).ItemId;
        persItem.qty = $.parseJSON(obj.DeltaJson).Qty;
        Global.persItemCollected.push(persItem);

	}
    this.getPersistentItems = function(cb){
        engine.call("EventCoherentUIBinder.GetPersistentInventory").then(function(data){
			Global.perItemsList = $.parseJSON(data).Items;
            cb(Global.perItemsList);
		});   
    }
    this.getMinigameRewards = function(){
        for(var i=0;i<minigameReward.length;i++){
            if(minigameReward[i].type=="reward")engine.call("EventCoherentUIBinder.AwardReward",parseInt(minigameReward[i].id),1, "message");
            else if(minigameReward[i].type=="persistentreward"){
                engine.call("EventCoherentUIBinder.AwardPersistentReward",minigameReward[i].id,1, "message");
                var persItem = new Object();
                persItem.reward = reward;
                persItem.qty = qty;
                Global.persItemCollected.push(persItem);
            }
            else if(minigameReward[i].type=="multiplayerreward")engine.call("EventCoherentUIBinder.AwardMultiplayerReward",minigameReward[i].id,1, "message");
        }
    }
    
    this.getDialogScore=function(score){
        
    }
    
    this.getScore = function(itemId){
        var score=0;
        for(var i=0;i<ItemManager.itemJSON.length;i++){
            if(ItemManager.itemJSON[i].id==itemId){
                if(ItemManager.itemJSON[i].isScorable.toString()=="true"){
                    score = ItemManager.itemJSON[i].value;
                }
            }
        }
        return score;
    }
    this.itemJSON = {};
    this.statusJSON = {};
}