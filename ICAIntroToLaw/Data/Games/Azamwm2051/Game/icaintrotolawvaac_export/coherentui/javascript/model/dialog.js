/**
 * ...
 * @author Milbert Cale@Playware Studios
 */

var dialog = new function(){
    this.showMessage = function(msg){
        $("body").append("<div id='popupMessageFormID'><div id='pmf1'></div><div id='pmf2' onclick='closeThisWindow()'><div id='pmf21'>Close</div><div></div>");
        $("#pmf1").html(msg)
    };
};

function closeThisWindow(){
    $("#popupMessageFormID").remove();
}