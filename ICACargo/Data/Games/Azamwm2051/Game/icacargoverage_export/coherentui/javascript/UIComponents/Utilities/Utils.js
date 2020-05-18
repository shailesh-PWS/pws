var Utils = new function()
{
	this.loadXMLFromURLReturnXMLObject = function(url,callback)
	{
		Utils.getXMLFromFile(url,callback);
		/*var xmlhttp;

		//SETUP INITIALISATION FOR DIFFERENT BROWSERS
		if(window.XMLHttpRequest)
		{
			xmlhttp = new XMLHttpRequest();
		}
		else
		{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
		}

		//OPEN UP THE URL
		//URL SHOULD BE THE LOCAL PATH AND MAY NEED TO USE UNITY TO OPEN THE CORRECT LOCAL PATH BASED ON SYSTEM
		alert("before: " + url)
		
		xmlhttp.onreadystatechange = function(){
			alert(JSON.stringify(xmlhttp))
		}
		xmlhttp.open("GET",url,true)
		xmlhttp.send();


		alert("after2")

		//GET RESPONSE AND SET TO XML
		

		alert("after3")*/

                /*
		engine.call("EventCoherentUIBinder.RequestFile", url).then(function(data){
                        
			//GET BASE 64 STRING OF XML
			var base64string = data;

			//DECODE STRING
			var xmlstr = window.atob(base64string);
                        xmlstr = filterXMLChar(xmlstr);

			//GET CUI
			var xml = Utils.convertXMLStringToXMLObject(xmlstr);
			
			//RETURN THE XML
			callback(xml)


		})*/

		
	}
        this.getXMLFromFile=function(path,callback){
            engine.call("EventCoherentUIBinder.GetXmlString", path).then(function(data){
                //console.log("Path to send to CUI for XML:"+data);
                //GET BASE 64 STRING OF XML
                //var base64string = data;

                //DECODE STRING
                //var xmlstr = window.atob(base64string);
                xmlstr = filterXMLChar(data);

                //GET CUI
                var xml = Utils.convertXMLStringToXMLObject(xmlstr);

                //RETURN THE XML
                callback(xml);
            });
        };
        
        this.getStringFromFile=function(path,callback){
            //console.log("path:"+path);
            engine.call("EventCoherentUIBinder.GetFileString", path).then(function(data){
                //console.log("DAta from binding:"+data)
                //RETURN THE XML
                callback(data);
            });
        };
	this.convertXMLStringToXMLObject = function(str)
	{
		var doc

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