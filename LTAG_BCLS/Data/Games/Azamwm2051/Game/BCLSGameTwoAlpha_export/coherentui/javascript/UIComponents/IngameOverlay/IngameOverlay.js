var IngameOverlay = new function()
{
	this.updatePanelSize = function()
	{

	}
	this.initSkeleton = function()
	{
		buildInitialIngameOverlaySkeleton();

		IngameOverlay.initInitialEngineListener();
	}
	this.showPanel = function(bool)
	{

		if(bool)
		{
			$("#ingameOverlayMain").show();
			//TweenMax.to($("#mainLearningPanel"),0.25,{left:0})
			
		}
		else
		{
			$("#ingameOverlayMain").hide();
			//TweenMax.to($("#mainLearningPanel"),0.25,{left:-parseInt($("#mainLearningPanel").width())})
		}
	}
	this.initInitialEngineListener = function()
	{
		engine.on("NPC_OnScreen", function(data){
			Utils.log("NPC is on the screen now");
			IngameOverlay.generateAndUpdateNPCStatusBars(data);
		})
	}
	this.generateAndUpdateNPCStatusBars = function(data)
	{
		

		$('.npcStatusBarContainer').remove();

		var winwidth = $('#ingameOverlayMain').width();
		var winheight = $('#ingameOverlayMain').height();



		if(data.NPCs.length != 0)
		{
			

			for(var i=0; i<data.NPCs.length;i++)
			{
				//console.log("CHAR: " + JSON.stringify(data.NPCs[0]))

				if(data.NPCs[i].Distance < 30 && data.NPCs[i].Stats[0]['Value'] > 0)
				{
					$('#ingameOverlayMain').append($("<div class='npcStatusBarContainer'><div class='npcStatusBarBar1'></div><div class='npcStatusBarBar2' bar-id='" + i + "'></div></div>").css({
						top:winheight - data.NPCs[i].Screen_Y,
						left:data.NPCs[i].Screen_X - 35	
					},100))

					$('.npcStatusBarBar2[bar-id=' + i + ']').css({
						width:parseInt(data.NPCs[i].Stats[0]['Value'])
					})
				}
			}
		}	
	}
}

function buildInitialIngameOverlaySkeleton()
{
	var str = "";

	str += "<div id='ingameOverlayMain'>"

		// str += "<div class='npcStatusBarContainer'>";
		// 	str += "<div class='npcStatusBarBar1'></div>"
		// 	str += "<div class='npcStatusBarBar2'></div>"
		// str += "</div>"

	str += "</div>";

	$('body').append($(str))
}