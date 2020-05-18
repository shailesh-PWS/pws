var LeaderBoard = new function()
{
    this.callback=null;
	this.GetData = function(callback)
	{
        LeaderBoard.callback = callback;
        //Need to replace the below function by vuplex
		VuplexManager.GetLeaderboardJson("LeaderBoard.dataCallback");
		
	};
    this.dataCallback = function(data){
        if(data == null || data == ""){
            data = "[]";
        }
        
        Global.LeaderBoardJson = $.parseJSON(data) ;
        LeaderBoard.callback(Global.LeaderBoardJson);
    }
    
    this.GetScoreSystem= function(callback)
    {
        //Need to replace the below function by vuplex
        VuplexManager.GetScoreSystem(callback);
    };

}