$(document).ready(function () {
    VuplexManager.Initialize('VuplexManager.StartTheSetup');
});

function initLoggingManagerIsSetup() {
    //SETUP OTHER NON PANEL RELATED SYSTEMS
    WindowManager.initPanelToManager("dialog", Dialog, true, extractXMLs);
    //PREACTIVE FOCUS MODE
    Global.focusModeActivated = true;
    //Tell The Engine that Uniwebview is ready for binding
}


function extractXMLs() {
    try {
        console.log("ExtractXMLS--->");
        Utils.getXMLFromFile("items.xml", OnItemsXMLReceived);
    }
    catch (e) {
        tellEngineVuplexwebviewIsReady();
    }
}

function OnItemsXMLReceived(xml) {
    ItemManager.itemJSON = $.xml2json(xml).ObjectiveItem.item;
    Utils.getXMLFromFile("statusuiobject.xml", OnStatusUIObject);
}

function OnStatusUIObject(xml) {
    try {
        ItemManager.statusJSON = $.xml2json(xml).StatusUI;
        for (var i = 0; i < ItemManager.itemJSON.length; i++) {
            ItemManager.itemJSON[i].isScorable = isScorable(ItemManager.itemJSON[i]);
        }
    } catch (e) {
    }

    tellEngineVuplexwebviewIsReady();
}

function tellEngineVuplexwebviewIsReady() {
    VuplexManager.IsReady("IsReady");
}
