var Utils = new function()
{
	this.loadXMLFromURLReturnXMLObject = function(url,callback)
	{
		Utils.getXMLFromFile(url,callback);
    }
    
    this.callback=null;

    this.getXMLFromFile=function(path,callback){
        Utils.callback = callback;
        VuplexManager.GetXmlString(path,"Utils.GetXmlString");
    };

    this.GetXmlString=function(data){

        xmlstr = filterXMLChar(data);
        //GET CUI
        var xml = Utils.convertXMLStringToXMLObject(xmlstr);

        console.log("UTILS.GetXmlString Callback:: " + xml + " :: " + Utils.callback);
        
        //RETURN THE XML
        Utils.callback(xml);
    }
    this.getStringFromFile=function(path,callback){
        //Utils.callback = callback;
        VuplexManager.GetStringFromFile(path, callback);
    };
	this.convertXMLStringToXMLObject = function(str)
	{
		var doc;

		if(window.ActiveXObject)
		{
			doc = new ActiveXObject("Microsoft.XMLDOM")
			doc.async = "false";
			doc.loadXML(str);
		}
		else
		{
			var parser = new DOMParser();
            doc = parser.parseFromString(str, 'text/xml');
		}

		return doc;
	}
    this.log=function(txt){
        console.log(txt);   
    }
    
    this.convertObjectToArray = function(data)
    {
        // only convert the object if it is not in the form of array
        if(!$.isArray(data))
        {
            var arr = [];
            arr.push(data);
            return arr;
        }
            
        return data;    
    }

    this.isJson = function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
}

 function filterXMLChar(str){
     /*
    var _patterns = " 0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()-=_+{}:<>?[]|;',./\\\"\n\t\r";
    for(var i=0;i<str.length;i++){
        if(_patterns.indexOf(str.charAt(i))<0){
                str = str.replace(str.charAt(i),"");
        }
    }*/
    return str;
}