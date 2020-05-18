var LoggingData = {}

var LoggingManager = new function ()
{
    this.initLoggingManager = function(callback)
    {
        //strFuncs.log("Initialised Core Logging Manager")
        LoggingManager.callback = callback;
        //Initiate logging data array
        LoggingData.masterLog = {};
        LoggingData.masterLogActions = new Array();
        LoggingData.currentSessionID = LoggingUtils.createSessionID();
        
        //Always initiate the first timestamp
        LoggingData.masterLog.SessionID = LoggingData.currentSessionID;

        VuplexManager.Retrieve("LoggingManager.Retrieve");
    }
    
    this.callback=null;
    
    this.Retrieve = function(data){
        LoggingData.isSupported = true;
        LoggingData.selectionData = data;

        LoggingData.masterLog.UserID = LoggingData.selectionData.UserId;
        LoggingData.masterLog.ChapterID = LoggingData.selectionData.ChapterId;
        LoggingData.masterLog.GameID = LoggingData.selectionData.GameId;
        LoggingData.masterLog.StartTime = LoggingUtils.createTimestampNow();
        LoggingManager.callback();
    }
    this.EndWriteLog = function(obj){//This would be call by the engine through Uniwebview
        LoggingData.callback();
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
            VuplexManager.WriteToFile(filepath+filename,JSON.stringify(LoggingData.masterLog));
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
    this.addAction = function(type,val,callback)
    {
        if(LoggingData.isSupported)
        {
            var data = {type:type,time:LoggingUtils.createTimestampNow(),value:val};
            VuplexManager.LogCache(JSON.stringify(data),callback);
        }
        
    }
}

function LogCache(data){
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