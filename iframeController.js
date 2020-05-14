function initIFrame() {
    // Reappend the iFrame to #unityContainer so it can be drawn on top
    setTimeout(function () { $('#gameMediaIndex').appendTo('#unityContainer'); }, 1000);
}


function toggleIFrame(state) {
    if (state == 1) document.getElementById("gameMediaIndex").style.visibility = "visible";
    else document.getElementById("gameMediaIndex").style.visibility = "hidden";
}