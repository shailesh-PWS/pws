
var Movement = new function()
{

	this.initSkeleton = function()
	{
		buildInitialMovementSkeleton();

		//MovementControl.registerInitialListeners();
	}
}
var avatarMoveBool=false;
var to;
var MovementControl = new function()
{
	this.touchONpositionright_x = 0;
	this.touchONpositionright_y = 0;
	this.touchTOpositionright_x = 0;
	this.touchTOpositionright_y = 0;

	this.touchONpositionleft_x = 0;
	this.touchONpositionleft_y = 0;
	this.touchTOpositionleft_x = 0;
	this.touchTOpositionleft_y = 0;

	this.touchPercentageCalculationRight_lr = 0;
	this.touchPercentageCalculationRight_ud = 0;

	this.touchPercentageCalculationLeft_lr = 0;
	this.touchPercentageCalculationLeft_ud = 0;

	this.movementPercentageRight = 0.3;
	this.movementPercentageLeft = 0.3;
	this.movementPixelRangeRight = 0;
	this.movementPixelRangeLeft = 0;

	this.registerInitialListeners = function()
	{
		//TEST CONTROL
		//$('#ControlComponentLeft').on('click',MovementControl.TestForward);

		//Added by Milbert for testing== 
		$('#ControlComponentRight,#ControlComponentLeft').css({
			"color":"red"
		});//End of Added by Milbert


		//$('#ControlComponentRight').on('touchstart',MovementControl.RightControlSTARTZoneHandler);
		//$('#ControlComponentRight').on('touchmove',MovementControl.RightControlMOVEZoneHandler);
		//$('#ControlComponentRight').on('touchend',MovementControl.RightControlENDZoneHandler);

		//$('#ControlComponentLeft').on('touchstart',MovementControl.LeftControlSTARTZoneHandler);
		//$('#ControlComponentLeft').on('touchmove',MovementControl.LeftControlMOVEZoneHandler);
		//$('#ControlComponentLeft').on('touchend',MovementControl.LeftControlENDZoneHandler);

		
		/*
		//CAMERA FREE ROTATION--Implemented by Milbert
		var ControlComponentRight = new Hammer($('#ControlComponentRight')[0]);
		ControlComponentRight.on("panstart", function(event){
			$("#ControlComponentRight").text("Right Touch Starts");
			MovementControl.touchONpositionright_x = Math.round(event.center.x);
			MovementControl.touchONpositionright_y = Math.round(event.center.y);

			MovementControl.calculateAndUpdatePositionClient();

			
		});
		ControlComponentRight.on("panmove",function(event){
			$("#ControlComponentRight").text("Right("+Math.round(event.center.x)+","+Math.round(event.center.y)+")");
			MovementControl.touchTOpositionright_x = Math.round(event.center.x);
			MovementControl.touchTOpositionright_y = Math.round(event.center.y);
			MovementControl.calculateAndUpdatePositionClient();	
		});
		ControlComponentRight.on("panend",function(){
			$("#ControlComponentRight").text("Right Touch Stops");
			MovementControl.resetRIGHTZoneHandeler();
		});

		//CAMERA FREE ROTATION--Implemented by Milbert
		var ControlComponentLeft = new Hammer($('#ControlComponentLeft')[0]);
		ControlComponentLeft.on("panstart", function(event){
			$("#ControlComponentLeft").text("Left Touch Starts");
			avatarMoveBool=true;
			engine.call("CameraControlBinder.ResetCamera");
			MovementControl.touchONpositionleft_x = Math.round(event.center.x);
			MovementControl.touchONpositionleft_y = Math.round(event.center.y);
			MovementControl.calculateAndUpdatePositionClient();
			
		});
		ControlComponentLeft.on("panmove",function(event){
			$("#ControlComponentLeft").text("Left("+Math.round(event.center.x)+","+Math.round(event.center.y)+")");
			MovementControl.touchTOpositionleft_x = Math.round(event.center.x);
			MovementControl.touchTOpositionleft_y = Math.round(event.center.y);
			MovementControl.calculateAndUpdatePositionClient();
			
		});
		ControlComponentLeft.on("panend",function(){
			$("#ControlComponentLeft").text("Left Touch Stops");
			avatarMoveBool=false;
			MovementControl.resetLEFTZoneHandeler();
		});
		*/
		var ControlComponentLeft = new Hammer($('#ControlComponentLeft')[0]);
		ControlComponentLeft.on("panup", function(event){

			$("#ControlComponentLeft").text("Moving forward");
			avatarMoveBool=true;
			engine.call("CameraControlBinder.ResetCamera");
			engine.call("CharacterControlBinder.SetCharacterHorizontal",0);
			engine.call("CharacterControlBinder.SetCharacterVertical",1);	
		});
		ControlComponentLeft.on("pandown", function(event){
			$("#ControlComponentLeft").text("Moving backward");
			avatarMoveBool=true;
			engine.call("CameraControlBinder.ResetCamera");
			engine.call("CharacterControlBinder.SetCharacterHorizontal",0);
			engine.call("CharacterControlBinder.SetCharacterVertical",-1);	
		});
		ControlComponentLeft.on("panright", function(event){
			$("#ControlComponentLeft").text("Moving Right");
			avatarMoveBool=true;
			engine.call("CameraControlBinder.ResetCamera");
			engine.call("CharacterControlBinder.SetCharacterHorizontal",1);
			engine.call("CharacterControlBinder.SetCharacterVertical",0);	
		});
		ControlComponentLeft.on("panleft", function(event){
			$("#ControlComponentLeft").text("Moving backward");
			avatarMoveBool=true;
			engine.call("CameraControlBinder.ResetCamera");
			engine.call("CharacterControlBinder.SetCharacterHorizontal",-1);
			engine.call("CharacterControlBinder.SetCharacterVertical",0);	
		});
		ControlComponentLeft.on("panend tap", function(event){
			$("#ControlComponentLeft").text("Stop");
			avatarMoveBool=false;
			engine.call("CharacterControlBinder.SetCharacterHorizontal",0);
			engine.call("CharacterControlBinder.SetCharacterVertical",0);	
		});
		$("#ControlComponentLeft").on("tap",function(){
			$("#ControlComponentLeft").text("Stop");
			avatarMoveBool=false;
			engine.call("CharacterControlBinder.SetCharacterHorizontal",0);
			engine.call("CharacterControlBinder.SetCharacterVertical",0);	
		});
		var ControlComponentRight = new Hammer($('#ControlComponentRight')[0]);
		ControlComponentRight.on("panup", function(event){
			if(avatarMoveBool)return;
			$("#ControlComponentRight").text("Camera rotate up");
			engine.call("CameraControlBinder.SetHorizontalInput",0);
			engine.call("CameraControlBinder.SetVerticalInput",1);	
		});
		ControlComponentRight.on("pandown", function(event){
			if(avatarMoveBool)return;
			$("#ControlComponentRight").text("Camera rotate down");
			engine.call("CameraControlBinder.SetHorizontalInput",0);
			engine.call("CameraControlBinder.SetVerticalInput",-1);	
		});
		ControlComponentRight.on("panright", function(event){
			$("#ControlComponentRight").text("Camera rotate right");
			engine.call("CameraControlBinder.SetHorizontalInput",1);
			engine.call("CameraControlBinder.SetVerticalInput",0);	
		});
		ControlComponentRight.on("panleft", function(event){
			$("#ControlComponentRight").text("Camera rotate left");
			engine.call("CameraControlBinder.SetHorizontalInput",-1);
			engine.call("CameraControlBinder.SetVerticalInput",0);	
		});
		ControlComponentRight.on("panend tap", function(event){
			$("#ControlComponentRight").text("Camera stop");
			engine.call("CameraControlBinder.SetHorizontalInput",0);
			engine.call("CameraControlBinder.SetVerticalInput",0);	
		});
		$("#ControlComponentRight").on("tap",function(){
			$("#ControlComponentRight").text("Stop");
			engine.call("CameraControlBinder.SetHorizontalInput",0);
			engine.call("CameraControlBinder.SetVerticalInput",0);		
		});
		/*
		//Using pad to move
		$("#tID").on("touchstart",function(event){
			$(this).css({
				backgroundColor:"gray"
			});
			avatarMoveBool=true;
			clearTimeout(to);
			to = setInterval(1,function(){
				engine.call("CameraControlBinder.ResetCamera");
				MovementControl.touchONpositionleft_x = 0;
				MovementControl.touchONpositionleft_y = 1;
				MovementControl.calculateAndUpdatePositionClient();
			});
		});

		$("#tID").on("touchend",function(event){
			avatarMoveBool=false;
			$(this).css({
				backgroundColor:"transparent"
			});
			clearTimeout(to);
		});*/
	}
	this.TestForward = function()
	{
		//alert("FORWARD")
		//$("#ControlComponentLeft").text("LEFT ZONE CLICKED")
		//engine.call("CharacterControlBinder.SetCharacterVertical",1)
	}
	this.LeftControlZoneHandler = function(event)
	{

	}
	this.LeftControlSTARTZoneHandler = function(event)
	{
		/*
		event.stopPropagation();

		var touchobj = event.originalEvent.targetTouches[0]
		MovementControl.touchONpositionleft_x = Math.round(touchobj.clientX);
		MovementControl.touchONpositionleft_y = Math.round(touchobj.clientY);

		MovementControl.calculateAndUpdatePositionClient();
		$("#ControlComponentLeft").text(touchobj.clientX);
		console.log("LEFT: ZONE TOUCH DOWN START")*/
		avatarMoveBool=true;
		MovementControl.touchONpositionleft_x = Math.round(event.center.x);
		MovementControl.touchONpositionleft_y = Math.round(event.center.y);
		MovementControl.calculateAndUpdatePositionClient();
		$("#ControlComponentLeft").text("Left Touch Starts");

	}
	this.LeftControlMOVEZoneHandler = function(event)
	{

		/*
		event.stopPropagation();

		var touchobj = event.originalEvent.targetTouches[0]
		MovementControl.touchTOpositionleft_x = Math.round(touchobj.clientX);
		MovementControl.touchTOpositionleft_y = Math.round(touchobj.clientY);

		MovementControl.calculateAndUpdatePositionClient();
		$("#ControlComponentLeft").text(touchobj.clientX);
		//console.log("LEFT TOUCH MOVE: (" + MovementControl.touchTOpositionleft_x + "," + MovementControl.touchTOpositionleft_y + ")")
		*/
		MovementControl.touchTOpositionleft_x = Math.round(event.center.x);
		MovementControl.touchTOpositionleft_y = Math.round(event.center.y);
		MovementControl.calculateAndUpdatePositionClient();
		$("#ControlComponentLeft").text("Left("+Math.round(event.center.x)+","+Math.round(event.center.y)+")");
	}
	this.LeftControlENDZoneHandler = function(event)
	{
		avatarMoveBool=false;
		/*
		event.stopPropagation();

		MovementControl.resetLEFTZoneHandeler();

		MovementControl.resetAndUpdateLEFTZoneClient();
		$("#ControlComponentLeft").text("Stop");
		console.log("LEFT: ZONE TOUCH UP RESET")*/
		MovementControl.resetLEFTZoneHandeler();
		$("#ControlComponentLeft").text("Left Touch Stops");
	}
	this.resetLEFTZoneHandeler = function()
	{
		MovementControl.touchTOpositionleft_x = 0;
		MovementControl.touchTOpositionleft_y = 0;
		MovementControl.touchONpositionleft_x = 0;
		MovementControl.touchONpositionleft_y = 0;

		MovementControl.touchPercentageCalculationLeft_lr = 0;
		MovementControl.touchPercentageCalculationLeft_ud = 0;

		MovementControl.movementPixelRangeLeft = 0;

		MovementControl.calculateAndUpdatePositionClient();
	}
	this.RightControlSTARTZoneHandler = function(event)
	{
		/*COMMENTED BY MILBERT
		event.stopPropagation();

		var touchobj = event.originalEvent.targetTouches[0]
		MovementControl.touchONpositionright_x = Math.round(touchobj.clientX);
		MovementControl.touchONpositionright_y = Math.round(touchobj.clientY);

		MovementControl.calculateAndUpdatePositionClient();

		console.log("RIGHT: ZONE TOUCH DOWN START")*/

		MovementControl.touchONpositionright_x = Math.round(event.center.x);
		MovementControl.touchONpositionright_y = Math.round(event.center.y);

		MovementControl.calculateAndUpdatePositionClient();

		$("#ControlComponentRight").text("Right Touch Starts");
	}
	this.RightControlMOVEZoneHandler = function(event)
	{
		/*
		event.stopPropagation();

		var touchobj = event.originalEvent.targetTouches[0]
		MovementControl.touchTOpositionright_x = Math.round(touchobj.clientX);
		MovementControl.touchTOpositionright_y = Math.round(touchobj.clientY);

		MovementControl.calculateAndUpdatePositionClient();

		//console.log("RIGHT TOUCH MOVE: (" + MovementControl.touchTOpositionright_x + "," + MovementControl.touchTOpositionright_y + ")")
		*/
		MovementControl.touchTOpositionright_x = Math.round(event.center.x);
		MovementControl.touchTOpositionright_y = Math.round(event.center.y);

		MovementControl.calculateAndUpdatePositionClient();
		$("#ControlComponentRight").text("Right("+Math.round(event.center.x)+","+Math.round(event.center.y)+")");
	}
	this.RightControlENDZoneHandler = function()
	{
		/*
		event.stopPropagation();

		MovementControl.resetRIGHTZoneHandeler();

		MovementControl.resetAndUpdateRIGHTZoneClient();

		console.log("RIGHT: ZONE TOUCH UP RESET")*/
		//MovementControl.resetAndUpdateRIGHTZoneClient();

		//MovementControl.resetRIGHTZoneHandeler();
		$("#ControlComponentRight").text("Right Touch Stops");
	}
	this.resetRIGHTZoneHandeler = function()
	{
		MovementControl.touchTOpositionright_x = 0;
		MovementControl.touchTOpositionright_y = 0;
		MovementControl.touchONpositionright_x = 0;
		MovementControl.touchONpositionright_y = 0;

		MovementControl.touchPercentageCalculationRight_lr = 0;
		MovementControl.touchPercentageCalculationRight_ud = 0;

		MovementControl.movementPixelRangeRight = 0;

		MovementControl.calculateAndUpdatePositionClient();
	}
	this.resetAndUpdateRIGHTZoneClient = function()
	{
		//SEND MESSAGE TO CLIENT
	}
	
	this.resetAndUpdateLEFTZoneClient = function()
	{
		//SEND MESSAGE TO CLIENT
	}
	this.calculateAndUpdatePositionClient = function()
	{
		//CALCULATE THE PERCENTAGE
		MovementControl.movementPixelRangeRight = $("#ControlComponentRight").width()*MovementControl.movementPercentageRight;
		MovementControl.movementPixelRangeLeft = $("#ControlComponentRight").width()*MovementControl.movementPercentageLeft;

		//RIGHT LEFT RIGHT
		if(-(MovementControl.touchONpositionright_x-MovementControl.touchTOpositionright_x) >= -(MovementControl.movementPixelRangeRight/2) && -(MovementControl.touchONpositionright_x-MovementControl.touchTOpositionright_x) <= (MovementControl.movementPixelRangeRight/2))
		{
			MovementControl.touchPercentageCalculationRight_lr = Math.round((-(MovementControl.touchONpositionright_x-MovementControl.touchTOpositionright_x)/(MovementControl.movementPixelRangeRight/2))*100)/100;
			//console.log("RIGHT: LEFT RIGHT IN RANGE: " + MovementControl.touchPercentageCalculationRight_lr);
		}
		//RIGHT UP DOWN
		if(-(MovementControl.touchONpositionright_y-MovementControl.touchTOpositionright_y) >= -(MovementControl.movementPixelRangeRight/2) && -(MovementControl.touchONpositionright_y-MovementControl.touchTOpositionright_y) <= (MovementControl.movementPixelRangeRight/2))
		{
			MovementControl.touchPercentageCalculationRight_ud = Math.round(((MovementControl.touchONpositionright_y-MovementControl.touchTOpositionright_y)/(MovementControl.movementPixelRangeRight/2))*100)/100;
			//console.log("RIGHT: UP DOWN IN RANGE: " + MovementControl.touchPercentageCalculationRight_ud);
		}
		//LEFT LEFT RIGHT
		if(-(MovementControl.touchONpositionleft_x-MovementControl.touchTOpositionleft_x) >= -(MovementControl.movementPixelRangeLeft/2) && -(MovementControl.touchONpositionleft_x-MovementControl.touchTOpositionleft_x) <= (MovementControl.movementPixelRangeLeft/2))
		{
			MovementControl.touchPercentageCalculationLeft_lr = Math.round((-(MovementControl.touchONpositionleft_x-MovementControl.touchTOpositionleft_x)/(MovementControl.movementPixelRangeLeft/2))*100)/100;
			//console.log("LEFT: LEFT RIGHT IN RANGE: " + MovementControl.touchPercentageCalculationLeft_lr);
		}
		//LEFT UP DOWN
		if(-(MovementControl.touchONpositionleft_y-MovementControl.touchTOpositionleft_y) >= -(MovementControl.movementPixelRangeLeft/2) && -(MovementControl.touchONpositionleft_y-MovementControl.touchTOpositionleft_y) <= (MovementControl.movementPixelRangeLeft/2))
		{
			MovementControl.touchPercentageCalculationLeft_ud = Math.round(((MovementControl.touchONpositionleft_y-MovementControl.touchTOpositionleft_y)/(MovementControl.movementPixelRangeLeft/2))*100)/100;
			//console.log("LEFT: UP DOWN IN RANGE: " + MovementControl.touchPercentageCalculationLeft_ud);
		}
		
		//$("#ControlComponentLeft").text("L-LR(" + MovementControl.touchPercentageCalculationLeft_lr + ") L-UD(" + MovementControl.touchPercentageCalculationLeft_ud + ")")
		//$("#ControlComponentRight").text("R-LR(" + MovementControl.touchPercentageCalculationRight_lr +") R-UD(" + MovementControl.touchPercentageCalculationRight_ud +")")

		engine.call("CharacterControlBinder.SetCharacterHorizontal",MovementControl.touchPercentageCalculationLeft_lr);
		engine.call("CharacterControlBinder.SetCharacterVertical",MovementControl.touchPercentageCalculationLeft_ud);

		//CALCULATE POSITIONS BASED ON PERCENTAGE AMOUNT
		//console.log($("#ControlComponentRight").width() + "," + $("#ControlComponentLeft").width())
		engine.call("CameraControlBinder.SetHorizontalInput",MovementControl.touchPercentageCalculationRight_lr);
		if(!avatarMoveBool)engine.call("CameraControlBinder.SetVerticalInput",-MovementControl.touchPercentageCalculationRight_ud);
	}
}
function buildInitialMovementSkeleton()
{
	//SETUP THE TWO OVERLAYS FOR LEFT AND RIGHT CONTROL
	var str = "";

	//SETUP THE INITIAL PANELS

	str += "<div id='ControlsMaster'>"

		str += "<div id='ControlComponentLeft' class='virtualButtonsClass'>";
			str += "thumb down to start movement"
			//str+="<div id='tID'>T</div>";
			//str+="<div id='lID'>L</div>";
			//str+="<div id='dID'>D</div>";
			//str+="<div id='rID'>R</div>";
		str += "</div>";

		str += "<div id='ControlComponentRight' class='virtualButtonsClass'>";
			str += "thumb down to start movement"
			//str+="<div id='t1ID'>1</div>";
			//str+="<div id='l1ID'>2</div>";
			//str+="<div id='d1ID'>3</div>";
			//str+="<div id='r1ID'>4</div>";
		str += "</div>";

	str += "</div>";

	//ADD TO STAGE
	$('body').append($(str));
}