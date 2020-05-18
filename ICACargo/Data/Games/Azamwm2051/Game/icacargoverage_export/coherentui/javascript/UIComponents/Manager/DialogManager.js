var DialogManager = new function(){
    this.getGesture=function(id){
        switch(parseInt(id)){
            case 0:
                return "NONE";
                break;
            case 1:
                return "ANGRY";
                break;
            case 2:
                return "CLAP";
                break;
            case 3:
                return "CONFUSED";
                break;
            case 4:
                return "CRY";
                break;
            case 5:
                return "JOY";
                break;
            case 6:
                return "LAUGH";
                break;
            case 7:
                return "NO";
                break;
            case 8:
                return "PANIC";
                break;
            case 9:
                return "SAD";
                break;
            case 10:
                return "SHY";
                break;
            case 11:
                return "TALK";
                break;
            case 12:
                return "WAVE";
                break;
            case 13:
                return "YES";
                break;
            case 14:
                return "SIT";
                break;
            case 15:
                return "LIEDOWN";
                break;
            case 16:
                return "ACCUSE";
                break;
            case 17:
                return "AKIMBO";
                break;
            case 18:
                return "ANGER2";
                break;
            case 19:
                return "BOW";
                break;
            case 20:
                return "CROSSARMS";
                break;
            case 21:
                return "DISAGREE";
                break;
            case 22:
                return "FRUSTRATED";
                break;
            case 23:
                return "FURIOUS";
                break;
            case 24:
                return "HANDSBEHIND";
                break;
            case 25:
                return "HAPPY";
                break;
            case 26:
                return "HI";
                break;
            case 27:
                return "PUZZLED";
                break;
            case 28:
                return "SHOCK";
                break;
            case 29:
                return "SHRUG";
                break;
            case 30:
                return "THINK";
                break;
            case 31:
                return "POINT";
                break;
            case 32:
                return "SALUTE";
                break;
            case 33:
                return "TALK2";
                break;
            case 34:
                return "TALK3";
                break;
            case 35:
                return "TIRED";
                break;
            case 36:
                return "SURPRISED";
                break;
            case 37:
                return "THISWAYLEFT";
                break;
            case 38:
                return "THISWAYRIGHT";
                break;
            case 39:
                return "RAISEHAND";
                break;
            case 40:
                return "SHOOING";
                break;
            case 41:
                return "BECKONING";
                break;
            case 42:
                return "POLITEBOW";
                break;
        }
        return 0;
    }
    
    this.getEmotion=function(id){
        switch(parseInt(id)){
            case 0:
                return "NORMAL";
                break;
            case 1:
                return "ANGER";
                break;
            case 2:
                return "HAPPY";
                break;
            case 3:
                return "SHOCK";
                break;
            case 4:
                return "SAD";
                break;
        }
        return 0;
    }
    this.previewImg = function(path){
       
        $("body").append("<div id='imgPreviewID'><div>Tap to close</div></div>");
        $("#imgPreviewID").css({
            backgroundImage:"url(" + encodeURI(path) + ")",
            backgroundPosition:'center',
            backgroundRepeat:'no-repeat',
            backgroundSize:'contain'
        });
        $("#imgPreviewID").unbind().click(function(){
            $(this).remove();
       
        });
        //this returns 0 now since minigamewrapper does not exist.
       // FontUtils.resize("#imgPreviewID div");
        
    };
    
    
}