var Dev = new function()
{

	this.initSkeleton = function()
	{

		buildInitialDevSkeleton();

		Dev.setupListeners()

	}
	this.setupListeners = function()
	{

		$('#mainDevPanel').hover(function(){
			TweenMax.to($('#mainDevPanel'),.250,{opacity:1})
		},function(){
			TweenMax.to($('#mainDevPanel'),.250,{opacity:.10})
		});
	}
	this.showPanel = function(bool)
	{
		if(bool)
		{
			$("#mainDevPanel").show();
		}
		else
		{
			$("#mainDevPanel").hide();
		}
		
	}
	this.togglePanel = function()
	{
		$("#mainDevPanel").toggle();
	}
	this.addToggleButton = function(panelid, label,func)
	{
		var str = "";

		str += "<div pid='" + panelid + "' class='toggleSwitchOFF'>"
			str += label;
		str += "</div>"

		$("#mainDevPanel").append($(str));

		$("#mainDevPanel div[pid='" + panelid + "']").mousedown(function(){

			switch($(this).attr('class'))
			{
				case "toggleSwitchON" :

					$(this).removeClass('toggleSwitchON').addClass('toggleSwitchOFF')
					
					func(false)


				break;

				case "toggleSwitchOFF" :

					$(this).removeClass('toggleSwitchOFF').addClass('toggleSwitchON')

					func(true)

				break;
			}

		})
	}


}

function buildInitialDevSkeleton()
{
	var str = "";

	str += "<div id='mainDevPanel'>"
	str += "</div>";

	$('body').append($(str))
}
function togglePanelVisibility(id,viewPanel)
{

}