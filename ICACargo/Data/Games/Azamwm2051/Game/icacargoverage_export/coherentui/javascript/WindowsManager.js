var SuportedModules = new function()
{
    this.onenote = function()
    {
        this.isSupported = false;
        this.moduleScriptLoc = "/javascript/modules/OneNote/onenote.js";
    }
}
var WindowManager = new function()
{
	this.panels = new Array();

	this.initPanelToManager = function(id,obj,initialise)
	{
		this.panels.push({id:id,obj:obj})
		
		if(initialise)
		{
			obj.initSkeleton();
		}
	}
	this.removePanelFromManager = function(id)
	{

	}
	this.closeAllPanels = function()
	{
		for(var i=0; i<WindowManager.panels.length; i++)
		{
			WindowManager.panels[i].obj.showPanel(false);
		}
	}
	this.focusPanel = function(panelid)
	{

	}
	this.updatePanelSizes = function()
	{
		for(var i=0; i<WindowManager.panels.length; i++)
		{
			WindowManager.panels[i].obj.updatePanelSize();
		}
	}

}
var WindowManagerGlobals = {};