var LeaderBoard = new function()
{
	this.GetData = function(callback)
	{
		
		//STOP EXISTING SOUNDS
		engine.call("EventCoherentUIBinder.GetLeaderboardJson").then(function(data){
			
			Global.LeaderBoardJson = $.parseJSON(data) ;
            callback(Global.LeaderBoardJson);
			
		});

		
	}
    
    this.GetScoreSystem= function(callback)
    {
        engine.call("EventCoherentUIBinder.GetScoreSystem").then(function(str){
			
            callback(str);
			
		});
    }

}