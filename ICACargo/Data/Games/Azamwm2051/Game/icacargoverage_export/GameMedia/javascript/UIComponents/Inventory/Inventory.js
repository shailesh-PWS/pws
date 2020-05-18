var Inventory = new function()
{
	//Added by Milbert as of 12Jan2015
	this.saveScore = function(){

		if(!Global.InventoryItemJSON)Global.InventoryItemJSON=[];
		//alert(JSON.stringify(Global.InventoryItemJSON));
		var obj;
		if(Global.currentTempInventoryItems.length==0){//Do this method at the moment. Need to request listener for the current received item from YB if possible. currently using the inventory items listener not the current item picked up
			Global.currentRecievedItem=Inventory.getItemObject(Global.InventoryItemJSON[0].itemID);
		}
		else{
			for(var i=0;i<Global.InventoryItemJSON.length;i++){
				if(JSON.stringify(Global.currentTempInventoryItems).indexOf(JSON.stringify(Global.InventoryItemJSON[i]))<0){
					Global.currentRecievedItem=Inventory.getItemObject(Global.InventoryItemJSON[i].itemID);
					break;
				}
			}

		}

		Global.currentTempInventoryItems = Global.InventoryItemJSON;
		var parseScoreAr = Global.currentRecievedItem.desc.split(" ");
		var score = parseInt(parseScoreAr[parseScoreAr.length-1]);
		//alert(Global.currentTempInventoryItems.length+"=="+score+":"+obj.desc+":"+obj.name)
		//var totalScore=0;
		//for(var i=0;i<Global.InventoryItemJSON.length;i++){
		//	obj = Inventory.getItemObject(Global.InventoryItemJSON[i].itemID);
		//	obj.quantity = Global.InventoryItemJSON[i].quantity;
		//	var parseScoreAr = obj.desc.split(" ");
		//	var score = parseInt(parseScoreAr[parseScoreAr.length-1])*parseInt(obj.quantity);
		//	totalScore+=score;
		//}
		//Global.scoreTimestamp. tHIS IS THE BatchID for the score
		console.log("SEND HIGH SCORE")
		//ServiceManager.addHighscoreRecord(obj,score)

		//engine.call('UserCoherentUIBinder.Retrieve','GameParams').then(function(data){
			//alert(data)
			//var Data = data.split(",");
			//ServiceManager.addHighscoreRecord(obj,score)
			//alert(Data[0] + "highscore/push?gameId="+Data[1]+"&highScore="+totalScore+"&token="+Data[2])
			//$.get(Data[0] + "highscore/push?gameId="+Data[1]+"&token="+Data[2]+"&batchId="+Global.scoreTimestamp+"&itemName="+obj.name+"&score="+score+"&noOfItems=1&itemId="+obj.id).done(function(data){	
			
			//}).error(function(e){
				//NotificationManager.pushNotificationToPlayer("unable to push highscore to server!","error")
				//alert("There is a problem in retrieving data");
			//});
			//$.get(Data[0] + "highscore/push?gameId="+Data[1]+"&highScore="+totalScore+"&token="+Data[2]).done(function(data){	
			//}).error(function(e){
			//	alert("There is a problem in retrieving data");
			//});
		//});

	}

	//End

	this.updatePanelSize = function()
	{
		console.log("INVENTORY SIZE UPDATED")

		//SET CONTENT WIDTH
		$('#mainInventoryContentPanel').css({
			width:$('#mainInventoryPanel').width()-$('#mainInventoryPanel .horizontalTabPanelPanel').width(),
			height:$('#mainInventoryPanel').height()
		})

		//SIZE ELEMENTS
		$('#mainInventoryContentPanel #inventoryWrapper').css({
			height:$('#mainInventoryContentPanel').height()-$('span .inventoryPanelHeader').height()-60
		})

		//SIZE ELEMENTS
		$('#mainInventoryContentPanel #objectiveWrapper').css({
			height:$('#mainInventoryContentPanel').height()-$('span .inventoryPanelHeader').height()-60
		})
	}
    this.ar = [];
    this.callback=null;
	this.getInventoryJSON = function(ar,callback){
        Inventory.ar = ar;
        Inventory.callback = callback;
        Inventory.traverseThroughInventoryArray();
	}
    this.traverseThroughInventoryArray = function(){
        if(Inventory.ar.length>1){
			Inventory.logInventoryObj(Inventory.ar[0],"Inventory.traverseThroughInventoryArray");
		} else {
		 Inventory.logInventoryObj(Inventory.ar[0],Inventory.callback);
		}
    }
    this.logInventoryObj=function(obj,callback){
		if(!obj){
			return;
		}

        if(typeof(obj)=="string"){
            while(obj.indexOf("False")>=0)obj = obj.replace("False","\"false\"");
            while(obj.indexOf("True")>=0)obj = obj.replace("True","\"true\"");
            obj = $.parseJSON(obj);
		}
		
		if(Inventory.ar.length > 0){
			Inventory.ar.shift();
		}

		if(obj.DeltaJson){
			Global.LatestInventoryItemJSON = obj.DeltaJson;
		}

		Global.InventoryItemJSON = obj.FullInventoryJson;

		Log.addAction("inventoryrecieved",obj.DeltaJson,callback);
    }
	this.initSkeleton = function()
	{
		//engine.on('Ready',function()
		//{
			//FUNCTIONS AND VARIABLE ADDED BY MILBERT 13JAN2015====
			Global.scoreTimestamp = Math.floor(Date.now() / 1000);
			Global.currentTempInventoryItems=[];

			//======================================================
			buildInitialInventorySkeleton();

			$("#inventoryClosBtnID").unbind().click(function(){
				Global.showInvBool=false;
				Inventory.showPanel(false);
				MenuManager.updateMenuManagerButtonState("inventory",MenuManager.convertBoolToState(Global.showInvBool))
			});

			Inventory.updateTabListeners();

			Inventory.showContent("invcontent");

			if(Global.inventoryXML==undefined){//CALL THIS IF THE ITEM XML IS NOT YET BEEN CALLED
				
				Utils.loadXMLFromURLReturnXMLObject("/items.xml",Inventory.itemXmlLoaded);
			}

			$("#mainInventoryPanel").dotdotdot({
				ellipsis	: '... ',
				wrap		: 'word'
			});

			

	}
	this.itemXmlLoaded = function(xml)
	{
		console.log("ITEMXMLLOaded" + xml);
		Global.inventoryXML = xml
	}
	this.showPanel = function(bool)
	{
		if(bool)
		{

			$("#mainInventoryPanel").css({
				display:"inline"
			})
		}
		else
		{

			$("#mainInventoryPanel").css({
				display:"none"
			})
		}
	}
	this.togglePanel = function(sub)
	{
		if(sub)
		{
			switch(sub)
			{
				case "objective" :

					Global.showLearningBool = false;
					Learning.showPanel(Global.showLearningBool);
					MenuManager.updateMenuManagerButtonState("learning","off")

					Global.showInvBool=true;
					//Inventory.showPanel(Global.showInvBool);
					MenuManager.updateMenuManagerButtonState("inventory",MenuManager.convertBoolToState(Global.showInvBool))

					Inventory.showContent("objectivecontent");
				break;

				case "inventory" :

					Global.showLearningBool = false;
					Learning.showPanel(Global.showLearningBool);
					MenuManager.updateMenuManagerButtonState("learning","off")

					Global.showInvBool=true;
					//Inventory.showPanel(Global.showInvBool);
					MenuManager.updateMenuManagerButtonState("inventory",MenuManager.convertBoolToState(Global.showInvBool))

					Inventory.showContent("invcontent");
				break;
			}
		}

		Inventory.showPanel(true)
		
	}
	this.updateTabListeners = function()
	{
		$("#mainInventoryPanel .horizontalTabPanelPanel .horizontalTabSelected").unbind();
		$("#mainInventoryPanel .horizontalTabPanelPanel .horizontalTabNormal").unbind().mousedown(function(){

				Inventory.selectTab($(this));
		})
	}
	this.selectTab = function(TabObject)
	{

		//MAKE ALL TABS INACTIVE
		$("#mainInventoryPanel .horizontalTabSelected").removeClass('horizontalTabSelected').addClass('horizontalTabNormal');

		//MAKE SELECTED TAB ACTIVE
		TabObject.removeClass('horizontalTabNormal').addClass('horizontalTabSelected');

		//REFRESH SELECTED ICON COLOURS
		$("#mainInventoryPanel .horizontalTabSelected img").each(function(){

			var selection = $(this).attr('src').replace('_dark','_light')
			$(this).attr('src',selection)
		
		})

		//REFRESH NORMAL ICON COLOURS
		$("#mainInventoryPanel .horizontalTabNormal img").each(function(){

			var selection = $(this).attr('src').replace('_light','_dark')
			$(this).attr('src',selection)
		
		})

		//RE ADD LISTENERS
		Inventory.updateTabListeners();

		//SHOW CONTENT
		Inventory.showContent(TabObject.attr('btn-id'))
	}
	this.showContent = function(id)
	{
		$('#mainInventoryContentPanel').children().css('display','none')

		$('#mainInventoryContentPanel div[pan-id="' + id + '"]').css('display','');
	}
	this.populateTestInventoryObjects = function(qty)
	{
		$('#inventoryWrapper').empty();
		var str = "";

		for(var i=0; i<qty; i++)
		{
			//alert("ID: " + Global.InventoryItemJSON[i].itemID);
			var obj = Inventory.getItemObject(Global.InventoryItemJSON[i].ItemID);

			obj.quantity = Global.InventoryItemJSON[i].quantity;
			str += Inventory.generateInventoryItemString(obj);
		}

		$('#inventoryWrapper').append($(str));

		//RESIZE THE TEXT CONTENT STRINGS
		$('.invBlockTextContent').css({
			maxWidth:230
		})

		//SETUP LISTENERS
		Inventory.setupListenersForInventoryItems()

	}
	this.setupListenersForInventoryItems = function()
	{
		
		//ADD THE LISTENERS
		$('.invBlock').unbind().mousedown(function(){

			if($(this).hasClass('invBlockActive') == false)
			{
				//EMPTY ALL THE OTHER CONTENT PANELS
				$('.invBlock').removeClass('invBlockActive').find('.invBlockOptions').empty();
				$('.invBlockSecondaryOptions').remove();

				//MAKE CURRENT BLOCK ACTIVE
				$(this).addClass('invBlockActive')

				//ADD SECONDARY MENU OPTIONS
				Inventory.addSecondaryOptionsMenuToTHIS($(this))
			}

		})
	}
	this.addSecondaryOptionsMenuToTHIS = function(obj)
	{
		var str = "";

		str += "<div class='invBlockTabTabNormal' btn-id='trade-options'><img src='images/icons/tradeicon_dark.png'/></div>";
		str += "<div class='invBlockTabTabNormal' btn-id='equip-options'><img src='images/icons/equippedicon_dark.png'/></div>";
		str += "<div class='invBlockTabTabNormal' btn-id='drop-options'><img src='images/icons/dropicon_dark.png'/></div>";

		//ADD IT TO THE SELECTED COMPONENT
		obj.find('.invBlockOptions').append($(str));

		//ADD LISTENERS TO SECONDARY OPTIONS
		$('.invBlockOptions .invBlockTabTabNormal').unbind().mousedown(function(){

			//ALPHA ALL OTHER BUTTONS
			$($(this)).css('opacity',1);
			TweenMax.to($('.invBlockOptions .invBlockTabTabNormal').not($(this)),0.1,{opacity:0.25});

			Inventory.loadSecondaryOptionsContent($(this).attr('btn-id'), obj);
		})

	} 
	this.loadSecondaryOptionsContent = function(type,obj)
	{
		switch(type)
		{
			case "trade-options" :

				Inventory.buildTradeOptionsPanel(obj);

			break;

			case "equip-options" :

				Inventory.buildEquipOptionsPanel(obj);

			break;

			case "drop-options" :

				Inventory.buildDropOptionsPanel(obj);

			break;
		}
	}
	this.buildTradeOptionsPanel = function(obj)
	{
		var str = "";

		//REMOVE PRIOR OPTIONS
		obj.find('#invBlockSecondaryOptionsWrapper').remove();

		//GENERATE SKELETONS
		str += "<div id='invBlockSecondaryOptionsWrapper'>"
			str += "<div class='invBlockSecondaryOptions' data-id='price'></div>"
			str += "<div class='invBlockSecondaryOptions' data-id='qty'></div>"
			str += "<div class='invBlockSecondaryOptions' data-id='confirm'></div>"
		str += "</div>"

		//APPEND SKELETON TO DIV
		obj.append($(str));

		//FILL OUT INVENTORY CONTENT
		Inventory.generatePriceComponent();
		Inventory.generateQtyComponent("Enter Quantity to Sell");
		Inventory.generateConfirmComponent("Put Item on Sale");

		//ADD LISTENERS
		$('.invBlockCompTabNormal[btn-id=saleupunit]').unbind().mousedown(function(){

			var obj = $('input[name=newsaleprice]');
			var num = parseInt(obj.val());

			obj.val(num+1);

		})
		$('.invBlockCompTabNormal[btn-id=saledownunit]').unbind().mousedown(function(){

			var obj = $('input[name=newsaleprice]');
			var num = parseInt(obj.val());

			if(num > 1)
			{
				obj.val(num-1);
			}
			
		})
		$('.invBlockCompTabNormal[btn-id=qtyupunit]').unbind().mousedown(function(){

			var obj = $('input[name=newqtyvalue]');
			var num = parseInt(obj.val());

			obj.val(num+1);

		})
		$('.invBlockCompTabNormal[btn-id=qtydownunit]').unbind().mousedown(function(){

			var obj = $('input[name=newqtyvalue]');
			var num = parseInt(obj.val());

			if(num > 1)
			{
				obj.val(num-1);
			}
			
		})
		$('.invBlockCompTabNormal[btn-id=confirm]').unbind().mousedown(function(){

			//alert("ITEM PUT ON SALE LIST")

		})
		$('.invBlockCompTabNormal[btn-id=cancel]').unbind().mousedown(function(){

			Inventory.resetSecondaryOptions(obj);

		})
	}
	this.resetSecondaryOptions = function(obj)
	{
		//REMOVE ALL OPTIONS
		obj.find('#invBlockSecondaryOptionsWrapper').remove();

		//RESET BUTTONS
		$('.invBlockOptions .invBlockTabTabNormal').css('opacity','1');

	}
	this.generatePriceComponent = function()
	{
		var str = "";

		str += "<div class='compLabel'>Set Sale Price</div>";
		str += "<input class='compInput' type='text' name='newsaleprice' value='10'/>";
		str += "<div class='invBlockCompTabNormal' btn-id='saleupunit'><img src='images/icons/plusicon_light.png'/></div>"
		str += "<div class='invBlockCompTabNormal' btn-id='saledownunit'><img src='images/icons/minusicon_light.png'/></div>"

		$(".invBlockSecondaryOptions[data-id=price]").append($(str));
	}
	this.generateQtyComponent = function(heading)
	{
		var str = "";

		str += "<div class='compLabel'>" + heading + "</div>";
		str += "<input class='compInput' type='text' name='newqtyvalue' value='1'/>";
		str += "<div class='invBlockCompTabNormal' btn-id='qtyupunit'><img src='images/icons/plusicon_light.png'/></div>"
		str += "<div class='invBlockCompTabNormal' btn-id='qtydownunit'><img src='images/icons/minusicon_light.png'/></div>"

		$(".invBlockSecondaryOptions[data-id=qty]").append($(str));
	}
	this.generateConfirmComponent = function(heading)
	{
		var str = "";

		str += "<div class='compLabel'>" + heading + "</div>"
		str += "<div class='invBlockCompTabNormal' btn-id='confirm'><img src='images/icons/confirmitemicon_light.png'/></div>"
		str += "<div class='invBlockCompTabNormal' btn-id='cancel'><img src='images/icons/cancelitemicon_light.png'/></div>"

		$(".invBlockSecondaryOptions[data-id=confirm]").append($(str));
	}
	this.buildEquipOptionsPanel = function(obj)
	{
		var str = "";

		//REMOVE PRIOR OPTIONS
		obj.find('#invBlockSecondaryOptionsWrapper').remove();

		//GENERATE SKELETONS
		str += "<div id='invBlockSecondaryOptionsWrapper'>"
			str += "<div class='invBlockSecondaryOptions' data-id='confirm'></div>"
		str += "</div>"

		//APPEND SKELETON TO DIV
		obj.append($(str));
		
		Inventory.generateConfirmComponent("Equip Item");

		$('.invBlockCompTabNormal[btn-id=cancel]').unbind().mousedown(function(){

			Inventory.resetSecondaryOptions(obj);

		})
		$('.invBlockCompTabNormal[btn-id=confirm]').unbind().mousedown(function(){

			//alert("CONFIRM EQUIP ITEM")

		})
	}
	this.buildDropOptionsPanel = function(obj)
	{

		/******************************
		NEED TO ADD SMART FILTER TO SEE
		WHAT TYPE OF DROP FILTER THERE
		IS::
		Drop, Destroy and Disable
		******************************/
		var str = "";

		//REMOVE PRIOR OPTIONS
		obj.find('#invBlockSecondaryOptionsWrapper').remove();

		//GENERATE SKELETONS
		str += "<div id='invBlockSecondaryOptionsWrapper'>"
			str += "<div class='invBlockSecondaryOptions' data-id='qty'></div>"
			str += "<div class='invBlockSecondaryOptions' data-id='confirm'></div>"
		str += "</div>"

		//APPEND SKELETON TO DIV
		obj.append($(str));

		Inventory.generateQtyComponent("Enter Quantity to Drop");
		Inventory.generateConfirmComponent("Drop Item");

		$('.invBlockCompTabNormal[btn-id=qtyupunit]').unbind().mousedown(function(){

			var obj = $('input[name=newqtyvalue]');
			var num = parseInt(obj.val());

			obj.val(num+1);

		})
		$('.invBlockCompTabNormal[btn-id=qtydownunit]').unbind().mousedown(function(){

			var obj = $('input[name=newqtyvalue]');
			var num = parseInt(obj.val());

			if(num > 1)
			{
				obj.val(num-1);
			}
			
		})
		$('.invBlockCompTabNormal[btn-id=cancel]').unbind().mousedown(function(){

			Inventory.resetSecondaryOptions(obj);

		})
		$('.invBlockCompTabNormal[btn-id=confirm]').unbind().mousedown(function(){

			//alert("CONFIRM INVENTORY DROP")

		})
	}
	this.generateInventoryItemString = function(obj)
	{
		//alert(JSON.stringify(obj))

		var str = "";
		if(obj==null || obj==undefined) return;
		else
		{
			str += "<div class='invBlock'>"

				str += "<div class='invBlockThumbnail'>";
					str += "<img src='images/icons/pictureicon_dark.png'/>"
				str += "</div>";

				str += "<div class='invBlockTextContent'>";

					str += "<div class='invBlockTextName'>";
						str += obj.name;
					str += "</div>";

					str += "<div class='invBlockTextDesc'>";
						str += obj.desc;
					str += "</div>";

				str += "</div>";

				str += "<div class='invBlockQuickLabelContent'>";

					str += "<div class='invBlockQuickLabelQTY'>";
						str += obj.quantity;
					str += "</div>";

				str += "</div>";

				str += "<div class='invBlockOptions'>";

				str += "</div>"

			str += "</div>"
		}

		return str;
	}
	this.getItemObject = function(id){
		var obj={};

		//alert("GLOBAL INV: " + Global.inventoryXML)

		for(var n=0;n<$(Global.inventoryXML).find("item").length;n++)
		{

			if($($(Global.inventoryXML).find("item")[n]).attr("id").toString()==id.toString())
			{
				obj.id = id;
				obj.name = $($(Global.inventoryXML).find("item")[n]).find("name").text();
				obj.theme = $($(Global.inventoryXML).find("item")[n]).find("theme").text();
				obj.image = $($(Global.inventoryXML).find("item")[n]).find("image").text();
				obj.desc = $($(Global.inventoryXML).find("item")[n]).find("desc").text();
				obj.npcValue = $($(Global.inventoryXML).find("item")[n]).find("npcValue").text();
				obj.statMod = $($(Global.inventoryXML).find("item")[n]).find("statMod").text();
			}
		}

		//alert("FINALISED OBJECT: " + JSON.stringify(obj))

		return obj;
	}
	


}

function buildInitialInventorySkeleton()
{
	var str = "";

	str += "<div id='mainInventoryPanel'>"
		
		str += "<div class='horizontalTabPanelPanel'>"
			str += "<div class='horizontalTabPersistant' btn-id='closelearning' id='inventoryClosBtnID'><img src='images/icons/cancelicon_dark_small.png'/></div>";
			str += "<div class='horizontalTabNormal' btn-id='objectivecontent'><img src='images/icons/objective_dark.png'/></div>";
			str += "<div class='horizontalTabSelected' btn-id='invcontent'><img src='images/icons/inventoryicon_light.png'/></div>";
			str += "<div class='horizontalTabNormal' btn-id='equipcontent'><img src='images/icons/equippedicon_dark.png'/></div>";
			str += "<div class='horizontalTabNormal' btn-id='tradecontent'><img src='images/icons/tradeicon_dark.png'/></div>";
		str += "</div>"

		str += "<div id='mainInventoryContentPanel'>"
			
		str += "</div>"

	str += "</div>";

	$('body').append($(str))

	//SET CONTENT WIDTH
	$('#mainInventoryContentPanel').css({
		width:$('#mainInventoryPanel').width()-$('#mainInventoryPanel .horizontalTabPanelPanel').width(),
		height:$('#mainInventoryPanel').height()
	})

	//BUILD CONTENT PANELS
	buildInventoryPanel();
	buildEquipPanel();
	buildTradePanel();
	buildObjectivePanel();
}
function buildInventoryPanel()
{
	var str = "";

	str += "<div class='contentwrapper' pan-id='invcontent'>"

	str += "<h1 class='inventoryPanelHeader'>Inventory</h1>";

		str += "<div id='inventoryWrapper'>"

		str += "</div>";

	str += "</div>";

	$('#mainInventoryContentPanel').append($(str).css('display','none'));

	//SIZE ELEMENTS
	$('#mainInventoryContentPanel #inventoryWrapper').css({
		height:$('#mainInventoryContentPanel').height()-$('span .inventoryPanelHeader').height()-60
	})
}
function buildEquipPanel()
{
	var str = "";

	str += "<div class='contentwrapper' pan-id='equipcontent'>";

	str += "<h1 class='inventoryPanelHeader'>Equipped</h1>";

	str += "</div>";

	$('#mainInventoryContentPanel').append($(str).css('display','none'));
}
function buildTradePanel()
{
	var str = "";

	str += "<div class='contentwrapper' pan-id='tradecontent'>";

	str += "<h1 class='inventoryPanelHeader'>Trading</h1>";

	str += "</div>"

	$('#mainInventoryContentPanel').append($(str).css('display','none'));
}
function buildObjectivePanel()
{
	var str = "";

	str += "<div class='contentwrapper' pan-id='objectivecontent'>";

	str += "<h1 class='inventoryPanelHeader'>Objectives</h1>";

		str += "<div id='objectiveWrapper'>"

		str += "</div>";

	str += "</div>";

	$('#mainInventoryContentPanel').append($(str).css('display','none'));

	//SIZE ELEMENTS
	$('#mainInventoryContentPanel #objectiveWrapper').css({
		height:$('#mainInventoryContentPanel').height()-$('span .inventoryPanelHeader').height()-60
	})
}