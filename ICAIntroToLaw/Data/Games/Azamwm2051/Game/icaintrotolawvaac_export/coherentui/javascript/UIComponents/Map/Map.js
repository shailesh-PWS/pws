var Map = new function()
{

	this.initSkeleton = function()
	{

		buildInitialMapSkeleton();
		animateRandomMapScales();

	}
	this.showPanel = function(bool)
	{
		if(bool)
		{
			$("#mainMapPanel").show();
		}
		else
		{
			$("#mainMapPanel").hide();
		}
		
	}
	this.togglePanel = function()
	{
		$("#mainMapPanel").toggle();
	}


}

function buildInitialMapSkeleton()
{
	var str = "";

	str += "<div id='mainMapPanel'>"
		str += "<div class='mapBackgroundImage'><img src='images/terrains/ancient_egypt.png'/></div>";
		str += "<div class='mapFunctionPanel'>"
			str += "<div class='mapFunctionIcon'><img src='images/gui/zoomicon_in.png'/></div>";
			str += "<div class='mapFunctionIcon'><img src='images/gui/zoomicon_out.png'/></div>";
		str += "</div>"
	str += "</div>";

	var ele = $(str);

	$('body').append(ele)

	


}
function animateRandomMapScales()
{
	TweenMax.to($(".mapBackgroundImage img"),5,{x:-Math.random()*500,y:-Math.random()*500,onComplete:animateRandomMapScales, ease:Cubic.easeInOut})
}