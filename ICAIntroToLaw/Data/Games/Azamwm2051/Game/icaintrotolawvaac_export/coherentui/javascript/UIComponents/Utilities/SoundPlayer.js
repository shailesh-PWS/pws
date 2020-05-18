var SoundPlayer = new function()
{
	this.PlaySoundFile = function(type,name)
	{
		
		//STOP EXISTING SOUNDS
		engine.call("EventCoherentUIBinder.StopDialog");

		//PLAY AUDIO
		switch(type)
		{
			case "dialog" :
				engine.call("EventCoherentUIBinder.PlayDialog",name);
			break;
		}
	}
    this.PlayAudio=function(path){
        console.log("PlayAudioFile:"+path);
        engine.call("EventCoherentUIBinder.PlayMinigameAudio",path);
    }
    this.StopAudio=function(){
        engine.call("EventCoherentUIBinder.StopMinigameAudio");
    }
    this.stopDialogAudio=function(){
        engine.call("EventCoherentUIBinder.StopDialog");
    }
	this.StopAllBaseSounds = function()
	{
		//STOP EXISTING SOUNDS
		engine.call("EventCoherentUIBinder.StopDialog");
		engine.call("EventCoherentUIBinder.StopBGM");
        engine.call("EventCoherentUIBinder.StopMinigameAudio");
	}
	this.PlayBGM = function(name)
	{
        console.log("FileName" + name);
		engine.call("EventCoherentUIBinder.StopBGM");
		engine.call("EventCoherentUIBinder.PlayBGM",name);		
	}
}