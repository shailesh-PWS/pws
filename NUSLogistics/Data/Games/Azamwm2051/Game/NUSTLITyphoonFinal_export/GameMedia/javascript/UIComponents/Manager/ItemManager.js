var ItemManager = new function(){
    Global.persItemCollected=[];
    
	this.AwardReward = function(reward,qty,callback){
        VuplexManager.AwardReward(parseInt(reward),qty,callback);
    }
    this.AwardPersistentReward=function(reward,qty,msg,callback){
        VuplexManager.AwardPersistentReward(reward,qty,msg,callback);
    }
    this.resetPersistentReward = function (reward,callback){
        ItemManager.cb = callback;
        VuplexManager.ResetPersistentReward(reward,"ItemManager.callback");
    }
    this.AwardMultiplayerReward=function(reward,qty,msg,callback){
        VuplexManager.AwardMultiplayerReward(reward,qty,msg,callback); 
    }
	this.populatePersistentInventory = function(obj){
        if(typeof(obj)=="string"){
            while(obj.indexOf("False")>=0)obj = obj.replace("False","\"false\"");
            while(obj.indexOf("True")>=0)obj = obj.replace("True","\"true\"");
        }
		Global.perItemsList = $.parseJSON(obj).FullInventoryJson;
        var persItem = new Object();
        persItem.reward = $.parseJSON(obj).DeltaJson.ItemId;
        persItem.qty = $.parseJSON(obj).DeltaJson.Qty;
        Global.persItemCollected.push(persItem);
	}
    this.getPersistentItems = function(callback){
        ItemManager.cb = callback;
        VuplexManager.GetPersistentInventory("ItemManager.getPersistentCallback");
    }
    this.getMinigameRewards = function(rewardObj,callback){
        if(rewardObj.type=="reward"){
            VuplexManager.AwardReward(parseInt(rewardObj.id),1,callback);
        }
        else if(rewardObj.type=="persistentreward"){
            VuplexManager.AwardPersistentReward(rewardObj.id,1,"",callback);
        }
        else if(rewardObj.type=="multiplayerreward")VuplexManager.AwardMultiplayerReward(rewardObj.id,1,"",callback); 
    }
    this.message="";
    
    this.getHtmlReward = function(reward,qty,callback){
        ItemManager.cb = callback;
        ItemManager.AwardReward(reward,qty,"ItemManager.callback");
    }
    this.getPersistentCallback = function(obj){
        Global.perItemsList = $.parseJSON(obj).Items;
        ItemManager.cb(Global.perItemsList);
    }
    this.callback=function(){
        ItemManager.cb();
    }
    this.cb=null;
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