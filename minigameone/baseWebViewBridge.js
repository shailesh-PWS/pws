

// 	Unity >>>>>>>>>>>> Javascript
var enableBridgeDebug = false;
function UnityBridge_WebView_loadHtml(webViewPtr, input) 
{ // IntPtr, string
	if(enableBridgeDebug)
		console.log("UnityBridge_WebView_loadHtml: " + input);
}

function UnityBridge_WebView_loadUrl(_nativeWebViewPtr, url) { // IntPtr, string
	if(enableBridgeDebug)
		console.log("UnityBridge_WebView_loadUrl: " + url);
	$('#gameMediaIndex').attr('src', url);
}

function UnityBridge_WebView_click(webViewPtr, x, y) { // IntPtr, int, int
	if(enableBridgeDebug)
		console.log("UnityBridge_WebView_click: " + x + "," + y);
}

function UnityBridge_WebView_executeJavaScript(webViewPtr, javaScript, resultCallbackId) { // IntPtr, string, string
	if(enableBridgeDebug)
		console.log("UnityBridge_WebView_executeJavaScript: " + javaScript + " , " + resultCallbackId);
	var parsedMessage = JSON.parse(javaScript);
	document.getElementById('gameMediaIndex').contentWindow.postMessage(parsedMessage, "*");
	//document.getElementById('gameMediaIndex').contentWindow.VuplexManager.OnMessageReceived(parsedMessage);
}

function UnityBridge_WebView_ensureFocus() {
	document.activeElement.blur();
}


//	Javascript >>>>>>>>>>> Unity

var unityInstance;
function UnityPostMessage(message){
	if(enableBridgeDebug)
		console.log("UNITY post message " + JSON.stringify(message));
	unityInstance.SendMessage('WebGLWebView', 'HandleMessageEmitted', JSON.stringify(message));
}


// Logger
// 	Unity jslib >>>>>>>>>>>> Javascript
function pwLogToPage(input) {
	console.log("pwlogger: " + input);
	jsonLog = input;
}


//	Javascript >>>>>>>>>>> Unity
function pwLogToUnity(message) {
	console.log("UNITY post message " + JSON.stringify(message));
	unityInstance.SendMessage('PWLogger', 'UpdateUnityLog', JSON.stringify(message));
}

function pwLog(message) { 
	//console.log("pwlog: " + pointer_stringify (message));
}

function validateSessionIdentity() {
	var webglidentity = document.getElementById("webgl-identity"); // Get identity
	var isLocalPlay = true;

	if (webglidentity != null)
	{
		var attr = webglidentity.getAttribute("data-fromlms"); // Get Attribute

		if		(attr == null) { console.log("No attribute found"); isLocalPlay = false; }
		else if (attr == ""  ) { console.log("Attribute is empty"); isLocalPlay = false; }
	}
	else { console.log("No identity found"); isLocalPlay = false; }
	
	if (isLocalPlay == false) unityInstance.SendMessage('PWLogger', 'DisableLocalPlaySessionIdFlag'); // Disable identity flag if nothing was found
}


function getIdentityFromWebPage() {

	var webglidentity = document.getElementById("webgl-identity").getAttribute("data-fromlms");

	console.log("UNITY PWLOGGER->Sending identity to Unity : \n" + JSON.stringify(webglidentity));
	unityInstance.SendMessage('PWLogger', 'TransferIdentity', JSON.stringify(webglidentity));

}

function testIdentityTransfer()
{
	console.log("UNITY PWLOGGER->Testing Identity Transfer");
	unityInstance.SendMessage('PWLogger', 'TestIdentityTransfer', JSON.stringify(message));

}