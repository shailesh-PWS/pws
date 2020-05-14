
// 	Unity >>>>>>>>>>>> Javascript

function UnityBridge_WebView_loadHtml(webViewPtr, input) 
{ // IntPtr, string
	console.error("UnityBridge_WebView_loadHtml: " + input);
}

function UnityBridge_WebView_loadUrl(_nativeWebViewPtr, url) { // IntPtr, string
	console.error("UnityBridge_WebView_loadUrl: " + url);
	$('#gameMediaIndex').attr('src', url);
}

function UnityBridge_WebView_click(webViewPtr, x, y) { // IntPtr, int, int
	console.error("UnityBridge_WebView_click: " + x + "," + y);
}

function UnityBridge_WebView_executeJavaScript(webViewPtr, javaScript, resultCallbackId) { // IntPtr, string, string
	console.error("UnityBridge_WebView_executeJavaScript: " + javaScript + " , " + resultCallbackId);
	var parsedMessage = JSON.parse(javaScript);
	document.getElementById('gameMediaIndex').contentWindow.VuplexManager.OnMessageReceived(parsedMessage);
}

function UnityBridge_WebView_ensureFocus() {
	document.activeElement.blur();
}


//	Javascript >>>>>>>>>>> Unity

var unityInstance;
function UnityPostMessage(message){
	console.error("UNITY post message " + JSON.stringify(message));
	unityInstance.SendMessage('WebGLWebView', 'HandleMessageEmitted', JSON.stringify(message));
}