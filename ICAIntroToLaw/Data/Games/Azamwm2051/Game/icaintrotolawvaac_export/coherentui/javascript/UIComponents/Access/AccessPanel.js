var Access = new function()
{
	this.initSkeleton = function()
	{

		buildInitialAccessSkeleton();

	}
	this.showPanel = function(bool)
	{
		if(bool)
		{
			$("#mainStatusPanel").show();
			TweenMax.to($("#mainStatusPanel"),0.25,{top:0})
			
		}
		else
		{
			TweenMax.to($("#mainStatusPanel"),0.25,{top:-parseInt($("#mainStatusPanel").width())})
		}
	}
}

function buildInitialAccessSkeleton()
{
	var str = "";

	str += "<div id='mainAccessPanel'>";
		str += "<div id='accessPanelDraw'>"
			str += "test"
		str += "</div>"
		str += "<div id='accessPanelContent'>"
			str += "test ahain"
		str += "</div>"
	str += "</div>";

	$('body').append($(str))

	$('#mainAccessPanel').css({
		right:-$('#mainAccessPanel').width()+50,
		top:$(window).innerHeight()/2-$('#mainAccessPanel').height()/2
	})
}