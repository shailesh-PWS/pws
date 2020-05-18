var Focus = new function()
{
	this.updatePanelSize = function()
	{

	}
	this.initSkeleton = function()
	{
		buildInitialFocusSkeleton();
	}
	this.showPanel = function(bool)
	{

		if(bool)
		{
			$("#focusModePanel").show();
			//TweenMax.to($("#mainLearningPanel"),0.25,{left:0})
			
		}
		else
		{
			$("#focusModePanel").hide();
			//TweenMax.to($("#mainLearningPanel"),0.25,{left:-parseInt($("#mainLearningPanel").width())})
		}
	}
}

function buildInitialFocusSkeleton()
{
	var str = "";

	str += "<div id='focusModePanel'>"
		str += "<div id='focusCrossHair'></div>";
	str += "</div>";

	$('body').append($(str))
}