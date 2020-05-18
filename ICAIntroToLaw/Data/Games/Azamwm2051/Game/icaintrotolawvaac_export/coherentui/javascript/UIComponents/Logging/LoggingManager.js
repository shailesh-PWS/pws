/*
LOGGING EXAMPLE

[{
    SessionID: int
    UserID: int
    GameID: int
    
    logs
    [
        {type,time,val},
        {type,time,val},
        {type,time,val},
        {type,time,val},
        {type,time,val},
        {type,time,val}
    ]

}]

COHERENT UI EVENTS
engine.on - WriteToFile - Function
engine.trigger - EndWriteLog - Event

*/

var LoggingData = {}

var LoggingManager = new function ()
{
    
    this.initLoggingManager = function()
    {
        console.log("Initialised Core Logging Manager")
        
        //Initiate logging data array
        LoggingData.masterLog = {};
        LoggingData.masterLogActions = new Array();
        LoggingData.currentSessionID = LoggingUtils.createSessionID();
        
        //Always initiate the first timestamp
        LoggingData.masterLog.SessionID = LoggingData.currentSessionID;
        
        
        //Console important attributes
        engine.call('UserCoherentUIBinder.Retrieve','SelectionData').then(function(data){
            
            
             //Check to see whether anything is undefined
//            if(LoggingData.masterLog.UserID == undefined || LoggingData.masterLog.ChapterID == undefined || //LoggingData.masterLog.GameID == undefined)
//            {
//                console.log("Logging not supported")
//                LoggingData.isSupported = false;
//            }
//            else
//            {
                console.log("Logging supported")
                LoggingData.isSupported = true;
                
                LoggingData.selectionData = JSON.parse(data);
            
                LoggingData.masterLog.UserID = LoggingData.selectionData.uid;
                LoggingData.masterLog.ChapterID = LoggingData.selectionData.cid;
                LoggingData.masterLog.GameID = LoggingData.selectionData.gid;
                LoggingData.masterLog.StartTime = LoggingUtils.createTimestampNow();
 //           }
            
        })
        
        //Setup listener for write sucess
        engine.on("EndWriteLog",function(obj){
		  
            //COMPLETED STORING THE ID
            console.log("THE FILE HAS BEEN WRITTEN: " + obj);
            
            //SEND IT TO THE QUE
            engine.call('LogIOCoherentUIBinder.AddToUploadQueue',obj);
            
            //RUN THE CALLBACK
            if(LoggingData.callback) LoggingData.callback();
            
		});
    }
    
    this.completeAndStoreLog = function(callback)
    {
        //Assign the callback
        LoggingData.callback = callback;
        
        if(LoggingData.isSupported)
        {
            

            //Assign actions log to masta data object
           LoggingData.masterLog.actions = LoggingData.masterLogActions;

            //Add the end time
            LoggingData.masterLog.EndTime = LoggingUtils.createTimestampNow();

            //Create the variables
            var filepath = LoggingData.masterLog.UserID + "/" + LoggingData.masterLog.GameID + "/";
            var filename = LoggingData.masterLog.UserID + "_" + LoggingData.masterLog.GameID + "_" + LoggingData.currentSessionID + ".json";

            //Start the write process
             engine.call('LogIOCoherentUIBinder.WriteToFile',filepath+filename,JSON.stringify(LoggingData.masterLog)).then(function(data){

                 console.log("WE HAVE WRITTEN LOG: " + data)

             })

            //Create location to store log
            //LOCATION: LOGS -> USERID -> CHAPTERID -> SESSIONID.JSON
         
        }
        else
        {
            //RUN THE CALLBACK
            if(LoggingData.callback) LoggingData.callback();    
        }
    }
    
}
var Log = new function ()
{
    this.addAction = function(type,val)
    {
       /* if(LoggingData.isSupported)
        {
            console.log("Adding Action: " + type + ", " + JSON.stringify(val));
            LoggingData.masterLogActions.push({type:type,time:LoggingUtils.createTimestampNow(),val:val});
        }*/
        var data = {type:type,time:LoggingUtils.createTimestampNow(),val:val};
        engine.call('LogIOCoherentUIBinder.LogCache',JSON.stringify(data));
        
        
    }
}

var LoggingUtils = new function()
{
    this.createTimestampNow = function()
    {
        //Create timestamp and allow for timezone offset for client computer
        var date = new Date();
        date.setHours(date.getHours()-date.getTimezoneOffset() / 60)
        
        return date;
    }
    this.createSessionID = function()
    {
        //Create date object
        var cdate = new Date();
        
        //Generate uniqe id
        var sid = cdate.getFullYear().toString()+cdate.getMonth().toString()+cdate.getDate().toString()+cdate.getHours().toString()+cdate.getMinutes().toString()+cdate.getSeconds().toString()+cdate.getSeconds().toString();
        
        //Return uid
        return sid
    }
}