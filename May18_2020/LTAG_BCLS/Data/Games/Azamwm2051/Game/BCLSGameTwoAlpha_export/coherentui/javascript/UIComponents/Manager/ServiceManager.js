/*
	SERVICE MANAGER FOR WEB CALLS
	1: Initialise the Game Sessiion - BatchId
	2: Send my highscores using BatchId
	3: On Complete or Exit send Exit Status "OBJECTIVE_COMPLETED, USER_QUIT and USER_DIED"
*/

var ServiceManager = new function()
{
	this.gameid;
	this.sessionid;

	this.startdate;
	this.enddate;

	this.gameparams;

	this.initGameSession = function()
	{
		//SET START DATE
		ServiceManager.startdate = new Date();
		ServiceManager.startdate.setHours(ServiceManager.startdate.getHours() - ServiceManager.startdate.getTimezoneOffset() / 60);

		//GET GAME PARAMS
		engine.call('UserCoherentUIBinder.Retrieve','GameParams').then(function(data){
			
			//SET GAME PARAMS
			ServiceManager.gameparams = data.split(",");

			//SET THE INITIAL GAME STATUS AND STORE SESSION ID
			//$.get(ServiceManager.gameparams[0] + "api/HighScore/GetBatchNo?token=" + ServiceManager.gameparams[2] + "&gameId=" + ServiceManager.gameparams[1] + "&startTime=" + ServiceManager.startdate)
			
			//SETUP OBJECT
			var tmp = {};

			tmp.BookingId = ServiceManager.gameparams[1];
			tmp.StartTime = ServiceManager.startdate;

			$.ajax({
				type:"POST",
				url:ServiceManager.gameparams[0] + "api/HighScore/GetBatchNo?token=" + ServiceManager.gameparams[2],
				data:JSON.stringify(tmp),
				contentType:'application/json; charset=utf-8',
				dataType:"json"
			})
				.done(function(data){
					console.log("done")
					ServiceManager.sessionid = data;
				})
				.error(function(e){
					console.log(e);
					NotificationManager.pushNotificationToPlayer("Unable to start session. Highscore will NOT be submited","error")
				});
		});
	}
	this.addHighscoreRecord = function(itemobj,score,loot)
	{

		if(ServiceManager.gameparams && ServiceManager.sessionid)
		{
			
			var timestamp = new Date();
			timestamp.setHours(timestamp.getHours() - timestamp.getTimezoneOffset() / 60);



			var tmp = {}
			tmp.batchId = ServiceManager.sessionid;
			tmp.itemId = itemobj.id;
			tmp.itemName = itemobj.name;
			tmp.score = score;
			tmp.noOfItems = 1;
			tmp.npcName = loot[2];
			tmp.maxHealth = parseInt(loot[3]);
			tmp.createdDate = timestamp;

			console.log("3: " + itemobj+","+score+","+loot)

			$.ajax({
				type:"POST",
				url:ServiceManager.gameparams[0] + "highscore/push?token=" + ServiceManager.gameparams[2],
				data:JSON.stringify(tmp),
				contentType:'application/json; charset=utf-8',
				dataType:'json'

			}).done(function(){
				
			}).error(function(){
				
				NotificationManager.pushNotificationToPlayer("unable to push highscore to server!","error")
			})	

			/*$.get(ServiceManager.gameparams[0] + "highscore/push?token="+ServiceManager.gameparams[2]+"&batchId="+ServiceManager.sessionid+"&itemId="+itemobj.id+"&itemName="+itemobj.name+"&score="+score+"&noOfItems=1&npcName="+loot[2]+"&maxHealth=" + loot[3]+"&createDate=" + timestamp).done(function(data){	
			
			}).error(function(e){
				console.log(e);
				NotificationManager.pushNotificationToPlayer("unable to push highscore to server!","error")
				//alert("There is a problem in retrieving data");
			});*/
		}
	}
	this.endGameSession = function(type,callback)
	{
		if(ServiceManager.gameparams && ServiceManager.sessionid)
		{
			ServiceManager.enddate = new Date();
			ServiceManager.enddate.setHours(ServiceManager.enddate.getHours() - ServiceManager.enddate.getTimezoneOffset() / 60);

			var tmp = {};

			tmp.BatchId = ServiceManager.sessionid;
			tmp.EndTime = ServiceManager.enddate;
			tmp.ExitStatusId = type;

			$.ajax({
				type:"POST",
				url:ServiceManager.gameparams[0] + "highscore/exitstatus?token=" + ServiceManager.gameparams[2],
				data:JSON.stringify(tmp),
				contentType:'application/json; charset=utf-8',
				dataType:"json"
			})
				.done(function(data){

					if(callback) callback();
					
				})
				.error(function(e){
					console.log(e);
					NotificationManager.pushNotificationToPlayer("Unable to end session. Highscore will not be complete!","error")

					setTimeout(function(){
						if(callback) callback();
					},500);
					
				});
		}
		
	}
}