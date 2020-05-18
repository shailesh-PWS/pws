var Status = new function()
{

	this.initSkeleton = function()
	{

		buildInitialStatusSkeleton();

		Status.populateTestStatusBars();

		Status.populateTestInfoObjects();

		Status.setGameTitle("SAP 101 Demo");//Hardcoded the game name
		//engine.on('testUpdateFunction',this.showPanel);

		//engine.on('Ready', function () {

			var ary = new Array(2,3,4)

			BasicStats.init();

			//DATA BINDING EXAMPLE
			setTimeout(function(){
				
			},2000);
			//engine.call("CharacterStatBindings.RegisterListeners","HealthChanged","Health")
			//engine.call("CharacterStatBindings.DeregisterListeners","HealthChanged","Health")
			
			//window.myobj.GetStringStat("Health")

		//});

		
		
		//engine.on("HealthChanged",function(newVal)
		//{

		//})

		//TriggerManager.mediaListener("minigame1.xml");

	}
	this.setGameTitle = function(title){
		$("#mainStatusPanelHeader h1").text(title);
	}
	this.virtualKeyboardLaunch = function(bool)
	{
		alert(bool)
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
	this.populateTestStatusBars = function()
	{
		var str = "";

		str += "<div class='statusBarContainer'>";
			str += "<div class='statusBarLabel'>Health</div>";
			str += "<div class='statusBarValue' id='healthBarID'>100</div>";
			str += "<div class='statusBar'>";
				str += "<div class='statusBarGuide' id='healthBarGuideID'></div>";
				str += "<div class='statusBarBar' id='currentHealthBarID'></div>";
			str += "</div>"
		str += "</div>"

		str += "<div class='statusBarContainer'>"
			str += "<div class='statusBarLabel'>Stamina</div>"
			str += "<div class='statusBarValue' id='staminaBarID'>100</div>"
			str += "<div class='statusBar'>";
				str += "<div class='statusBarGuide' id='staminaBarGuideID'></div>"
				str += "<div class='statusBarBar' id='currentStaminaBarID'></div>"
			str += "</div>"
		str += "</div>"

		str += "<div class='statusBarContainer'>"
			str += "<div class='statusBarLabel'>Hunger</div>"
			str += "<div class='statusBarValue' id='hungerBarID'>100</div>"
			str += "<div class='statusBar'>";
				str += "<div class='statusBarGuide' id='hungerBarGuideID'></div>"
				str += "<div class='statusBarBar' id='currentHungerBarID'></div>"
			str += "</div>"
		str += "</div>"

		$("#mainStatusPanelStatusBars").append($(str))
	}
	this.populateTestInfoObjects = function()
	{
		var str = "";

		str += "<div class='mainStatusInfoContainer'>"
			str += "<div class='mainStatusInfoIcon'><img src='images/icons/moneyicon_light.png'/></div>"
			str += "<div class='mainStatusInfoLabel' id='coinBarID'>$500</div>"
		str += "</div>"

		str += "<div class='mainStatusInfoContainer'>"
			str += "<div class='mainStatusInfoIcon'><img src='images/icons/scoreicon_light.png'/></div>"
			str += "<div class='mainStatusInfoLabel' id='scoreBarID'>1521 points</div>"
		str += "</div>"

		$("#mainStatusPanelInfo").append($(str))
	}
}

var BasicStats = new function(){
	this.init = function(){
		//alert("ENGINE READy")	
		Global.maxHealth =100;
		Global.currentHealth = 100;
		engine.call("CharacterStatBindings.GetStringStat","MaxHealth").then(function(obj){
			Global.maxHealth = obj;
			$("#currentHealthBarID").css({
				width:$("#healthBarGuideID").width()*(Global.currentHealth/Global.maxHealth)
			});
		},function(type,msg){
			//alert(type + " : " + msg)
		});
		engine.call("CharacterStatBindings.GetStringStat","Health").then(function(obj){
			Global.currentHealth = obj;
			$("#healthBarID").text(Global.currentHealth);

			$("#currentHealthBarID").css({
				width:$("#healthBarGuideID").width()*(Global.currentHealth/Global.maxHealth)
			});
		},function(type,msg){
			//alert(type + " : " + msg)
		});
		

		
		Global.maxStamina =100;
		Global.currentStamina = 100;
		engine.call("CharacterStatBindings.GetStringStat","MaxStamina").then(function(obj){
			Global.maxStamina = obj;
			$("#currentStaminaBarID").css({
				width:$("#staminaBarGuideID").width()*(Global.currentStamina/Global.maxStamina)
			});
		},function(type,msg){
			//alert(type + " : " + msg)
		});

		engine.call("CharacterStatBindings.GetStringStat","Stamina").then(function(obj){
			Global.currentStamina = obj;
			$("#staminaBarID").text(Global.currentStamina);

			$("#currentStaminaBarID").css({
				width:$("#staminaBarGuideID").width()*(Global.currentStamina/Global.maxStamina)
			});
		},function(type,msg){
			//alert(type + " : " + msg)
		});

		Global.maxHunger =100;
		Global.currentHunger = 100;
		engine.call("CharacterStatBindings.GetStringStat","MaxHunger").then(function(obj){
			Global.maxHunger = obj

			$("#currentHungerBarID").css({
				width:$("#hungerBarGuideID").width()*(Global.currentHunger/Global.maxHunger)
			});
		},function(type,msg){
			//alert(type + " : " + msg)
		});

		engine.call("CharacterStatBindings.GetStringStat","Hunger").then(function(obj){
			Global.currentHunger = obj;
			$("#hungerBarID").text(Global.currentHunger);

			$("#currentHungerBarID").css({
				width:$("#hungerBarGuideID").width()*(Global.currentHunger/Global.maxHunger)
			});
		},function(type,msg){
			//alert(type + " : " + msg)
		});

		engine.call("CharacterStatBindings.GetStringStat","Coins").then(function(obj){
			Global.coins = obj;
			$("#coinBarID").text("$"+Global.coins);
		},function(type,msg){
			//alert(type + " : " + msg)
		});

		engine.call("CharacterStatBindings.GetStringStat","Score").then(function(obj){
			Global.score = obj;
			$("#scoreBarID").text(Global.score);
		},function(type,msg){
			//alert(type + " : " + msg)
		});
	}
}


function testCool(x,y)
{
	//$('.statusBarValue').text(x)
	//$('.statusBarLabel').text(y)
}

function buildInitialStatusSkeleton()
{
	var str = "";

	str += "<div id='mainStatusPanel'>";
		str += "<div id='mainStatusBackgroundContainer'></div>"
		str += "<div id='mainStatusPanelHeader'><h1>SAP 101 Demo</h1></div>"
		str += "<div id='mainStatusPanelStatusBars'></div>"
		str += "<div id='mainStatusPanelInfo'></div>"
	str += "</div>";

	$('body').append($(str))

	//$("body").append("<div style='width:100%;height:64px;position:absolute; top:0px;left:0px; background-color:red'>I am 64px height</div>")
	$('#mainStatusPanel').css({
		left:$(window).innerWidth()/2-$("#mainStatusPanel").width()/2
	})
}