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
	this.StopAllBaseSounds = function()
	{
		//STOP EXISTING SOUNDS
		engine.call("EventCoherentUIBinder.StopDialog");
	}
	this.PlayBackgroundMusic = function(name)
	{
		engine.call("EventCoherentUIBinder.StartBGM",name);
	}
	this.StopBackgroundMusic = function()
	{
		engine.call("EventCoherentUIBinder.StopBGM");
	}
	this.FadeBackgroundMusic = function(fadetime,volume)
	{
		
	}
}