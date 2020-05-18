var Learning = new function()
{
	this.updatePanelSize = function()
	{
		console.log("LEARNING SIZE UPDATED")

		//SET CONTENT WIDTH
		$('#mainLearningContentPanel').css({
			width:$('#mainLearningPanel').width()-$('#mainLearningPanel .horizontalTabPanelPanel').width()
		})
	}
	this.initSkeleton = function()
	{


			buildInitialLearningSkeleton();

			Learning.updateTabListeners();

			Learning.showContent("notescontent");

			$(".horizontalTabPersistant[btn-id=closelearning]").click(function(){
				Global.showLearningBool=false;
				Learning.showPanel(false);
				MenuManager.updateMenuManagerButtonState("learning",MenuManager.convertBoolToState(Global.showLearningBool))
			});
        
            
            
            

		

	}
	this.showPanel = function(bool)
	{

		if(bool)
		{
			$("#mainLearningPanel").show();
			//TweenMax.to($("#mainLearningPanel"),0.25,{left:0})
			
		}
		else
		{
			$("#mainLearningPanel").hide();
			//TweenMax.to($("#mainLearningPanel"),0.25,{left:-parseInt($("#mainLearningPanel").width())})
		}
	}
	this.togglePanel = function()
	{
		$("#mainLearningPanel").toggle();
	}
	this.updateTabListeners = function()
	{
		$("#mainLearningPanel .horizontalTabPanelPanel .horizontalTabSelected").unbind();
		$("#mainLearningPanel .horizontalTabPanelPanel .horizontalTabNormal").unbind().mousedown(function(){

				Learning.selectTab($(this));
		})
	}
	this.selectTab = function(TabObject)
	{

		//MAKE ALL TABS INACTIVE
		$("#mainLearningPanel .horizontalTabSelected").removeClass('horizontalTabSelected').addClass('horizontalTabNormal');

		//MAKE SELECTED TAB ACTIVE
		TabObject.removeClass('horizontalTabNormal').addClass('horizontalTabSelected');

		//REFRESH SELECTED ICON COLOURS
		$("#mainLearningPanel .horizontalTabSelected img").each(function(){

			var selection = $(this).attr('src').replace('_dark','_light')
			$(this).attr('src',selection)
		
		})

		//REFRESH NORMAL ICON COLOURS
		$("#mainLearningPanel .horizontalTabNormal img").each(function(){

			var selection = $(this).attr('src').replace('_light','_dark')
			$(this).attr('src',selection)
		
		})

		//RE ADD LISTENERS
		Learning.updateTabListeners();

		//SHOW CONTENT
		Learning.showContent(TabObject.attr('btn-id'))
	}
	this.showContent = function(id)
	{
		$('#mainLearningContentPanel').children().css('display','none')

		$('#mainLearningContentPanel div[pan-id="' + id + '"]').css('display','');

		switch(id)
		{
			case "notescontent" :

			break;
		}
	}


}
var Notes = new function()
{
    this.notesobject;
    
    this.fetchAllNotes = function()
    {
        engine.call("OneNote_Bindings.IsAuthenticated").then(function(data){
        
            
        });
    }
    this.addNote = function(message)
    {
        engine.call("OneNote_Bindings.IsAuthenticated").then(function(data){
        
            
            
        });
    }
    this.updateNotes = function(data)
    {
        //Empty last set of notes
        var notesWrapper = $('#notesWrapper')
        notesWrapper.empty();
        
        //Fetch latest local
        engine.call("OneNote_Bindings.GetMessages").then(function(data){
            
            console.log("RAW DATA: " + data)
            
             //Set data object
            try{
                Notes.notesobject = $.parseJSON(data);
            }catch(e)
            {
                console.log(e)
            }
            
            console.log(Notes.notesobject);
            

            //Run through data object and populate
            console.log("Message Length: " + Notes.notesobject.messagelog.messages.length)
            for(var i=0; i<Notes.notesobject.messagelog.messages.length; i++)
            {
                console.log(Notes.notesobject.messagelog.messages[i].message);
                notesWrapper.append(Notes.createNote(Notes.notesobject.messagelog.messages[i].message));
            }
            
            
            
        });
        
        
        $('button[btn-id=submit-message]').removeClass('button-disabled').text('submit');
        $('.on-text-input textarea').val('');
       
    }
    this.createNote = function(message)
    {
        var str = "";
        
        str += "<div class='single-note-container'>";
            str += "<span>" + message + "</span>"
        str += "</div>"
        
        return $(str);
    }
    
}
var Chat = new function()
{
	this.initialiseMessages = function(obj)
	{

	}
	this.sendUserMessage = function(from,to,message)
	{
		var str = "";

		//SETUP MESSAGE STRING
		str += "<div class='chatline " + from + "'>[" + from + " to " + to + "] " + message + "</div>"

		//APPEND TO CHAT SCREEN
		$('#chatHistoryWrapper').append($(str));

		//CHECK WRAPPER SIZE
		if($('#chatHistoryWrapper').height() >= $("#chatHistory").height())
		{
			$('#chatHistoryWrapper').css({
				position:'initial',
				height:'auto'
			})

			$('#chatHistory').css({
				overflow:'auto'
			});
		}
		else
		{
			//$('#chatHistoryWrapper').css({
			//	position:'absolute',
			//	bottom:'0px'
			//})

			//$('#chatHistory').css({
			//	overflow:'auto'
			//})
		}

		//AUTOSCROLL CHAT TO BOTTTOM
		TweenMax.to($("#chatHistory"),1,{scrollTop:$("#chatHistory")[0].scrollHeight})
	}
}

function buildInitialLearningSkeleton()
{
	var str = "";

	str += "<div id='mainLearningPanel'>";
		str += "<div class='horizontalTabPanelPanel'>";
			str += "<div class='horizontalTabPersistant' btn-id='closelearning'><img src='images/icons/cancelicon_dark_small.png'/></div>";
			//str += "<div class='horizontalTabNormal' btn-id='chatcontent'><img src='images/icons/chaticon_light.png'/></div>";
			//str += "<div class='horizontalTabNormal' btn-id='journalcontent'><img src='images/icons/journalicon_dark.png'/></div>";
			//str += "<div class='horizontalTabNormal' btn-id='notescontent'><img src='images/icons/notesicon_dark.png'/></div>";
		str += "</div>";

		str += "<div id='mainLearningContentPanel'>";
			
		str += "</div>";

	str += "</div>";

	$('body').append($(str))

	//SET CONTENT WIDTH
	$('#mainLearningContentPanel').css({
		width:$('#mainLearningPanel').width()-$('#mainLearningPanel .horizontalTabPanelPanel').width()
	})

	//buildChatPanel();
	//buildJournalPanel();
	//buildNotesPanel();


}
function buildChatPanel()
{
	var str = "";

	str += "<div class='contentwrapper' pan-id='chatcontent'>"

		str += "<h1 class='learningPanelHeader'>Communication</h1>";
		
			str += "<div id='chatHistory'>"
				str += "<div id='chatHistoryWrapper'></div>"
			str += "</div>";
			
			str += "<div id='chatInput'>";
				
				str += "<div class='chatTextArea'>";
					//str += "<textarea rows='4' cols='50' placeholder='Enter your message'></textarea>"
				str += "</div>"
				str += "<div class='chatButtons'>"
					str += "<div class='chatButton' btn-id='sendbtn'><img src='images/icons/sendicon_dark.png'/></div>"
					str += "<div class='chatButton' btn-id='cancelbtn'><img src='images/icons/clearicon_dark.png'/></div>"
				str += "</div>";

			str += "</div>";

	str += "</div>";

	$('#mainLearningContentPanel').append($(str));

	//SIZE ELEMENTS
	$('#mainLearningContentPanel #chatHistory').css({
		height:$('#mainLearningPanel').height()-$('span .learningPanelHeader').height()-$('#chatInput').height()-80
	})

	console.log("CHAT WIDTH: " + $('#chatInput').width() + ", " + $('.chatButtons').width())
	console.log("LEARNING VALS: " + $('#mainLearningPanel').width() + ", " + $('#mainLearningPanel .horizontalTabPanelPanel').width())
	
	$('.chatTextArea').css({
		width:$('#mainLearningPanel').width()-$('#mainLearningPanel .horizontalTabPanelPanel').width()
	});

	setupChatListeners();

	//SEND SOME ALREADY MADE CHATS
	Chat.sendUserMessage("instructor","you","this is a sample of something the teacher has said!");
	Chat.sendUserMessage("team","you","Hey Guys, we need to step our game up!");
	
}
function setupChatListeners()
{
	$('.chatTextArea').click(function(){
		MobileInput.showMobileInput('Enter your chat message',$('.chatTextArea').text(),chatInputComplete)
	})

	$('.chatButton[btn-id="cancelbtn"]').unbind().mousedown(function(){
		$('.chatTextArea TextArea').val('');
	})
	$('.chatButton[btn-id="sendbtn"]').unbind().mousedown(function(){
		
		
		if($('.chatTextArea TextArea').val() != "")
		{
			//ADD TEXT
			Chat.sendUserMessage("you","all",$('.chatTextArea').text());

			//CLEAR TEXT INPUT AND FOCUS
			$('.chatTextArea').text('');
		}
		
	})
}
function chatInputComplete(str)
{
	$('.chatTextArea').text(str);
}
function buildJournalPanel()
{
	var str = "";

	str += "<div class='contentwrapper' pan-id='journalcontent'>"

	str += "<h1 class='learningPanelHeader'>Reflection</h1>";

	str += "</div>";

	$('#mainLearningContentPanel').append($(str).css('display','none'));




}
function buildNotesPanel()
{
	var str = "";

	str += "<div class='contentwrapper' pan-id='notescontent'>"

	str += "<h1 class='learningPanelHeader'>OneDrive Notes</h1>";

    /* ADD NOTES DIV */
	str += "<div id='one-note-input-container'>"
      
        str += "<div class='on-text-input'>"
            str += "<textarea placeholder='Enter a message'></textarea>"
        str += "</div>";
       
        str += "<div class='button-group'>"
            str += "<button btn-id='submit-message' class='single-button'>submit</button>";
        str += "</div>";
    str += "</div>"
    
    str += "<div id='notesWrapper'>"
    
        
    
	str += "</div>";

	$('#mainLearningContentPanel').append($(str));
    
    
    //DISABLED FOR THE TIME BEING
    /*//Setup Listener
    $('button[btn-id=submit-message]').click(function(){
        
        console.log("CLICKED: " + $('.on-text-input textarea').val() )
        
        //Disable Button
        $(this).addClass('button-disabled')
            
        //Submit Game Message
        if($('.on-text-input textarea').val() != "")
        {
            //Disable Button
            $(this).addClass('button-disabled').text('submitting')
            
            //Add message
            engine.call('OneNote_Bindings.AddMessage',$('.on-text-input textarea').val(),'');
        }
        else
        {
            //Disable Button
            $(this).removeClass('button-disabled').text('submit')  
        }
    })*/
}
function refreshNotesListeners()
{
	$("#addnote").unbind().mousedown(function(){

		//ADD A NEW NOTE ELEMENT
		$(this).before($("<div class='singlenote' contenteditable='true'>Tap to edit your text.</div>"));

		//REFRESH LISTENERS
		refreshNotesListeners();

	})
	$('.singlenote').unbind().click(function(){
		
		//Global.tmpnoteobject = $(this);
		//MobileInput.showMobileInput('Write a note for yourself.',$(this).text(),noteInputComplete)

	})
}
function noteInputComplete(str)
{
	Global.tmpnoteobject.text(str);

	Global.tmpnoteobject = null;
}