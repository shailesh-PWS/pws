function Click() {
    this.handlers = [];  // observers
}
 
Click.prototype = {
 
    subscribe: function(fn) {
        this.handlers.push(fn);
    },
 
    unsubscribe: function(fn) {
        this.handlers = this.handlers.filter(
            function(item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    },
 
    fire: function(o, thisObj) {
        var scope = thisObj || window;
        this.handlers.forEach(function(item) {
            item.call(scope, o);
        });
    }
}
 
// log helper
 
var log = (function() {
    var log = "";
 
    return {
        add: function(msg) {
            log += msg + "\n";
        },
        show: function() { 
            console.log(log);
            log = "";
        }
    }
})();

var click = new Click();


window.DragAndDrop = {
    beginDrag(x, y) {
    // TODO: Determine if there's a
    // draggable element at (x, y)

    click.fire('BeginDrag');

    if(typeof BeginDrag === "function"){
        //BeginDrag(x, y);        
    }
    },

    drag(x, y, callback) {
        // TODO: If dragStart() started on a draggable
        // element, drag it to this new location
        click.fire('Dragging');

        if(typeof DragProgress === "function"){
            //DragProgress(x, y);
            
        }
    },

    endDrag(x, y) {
        // TODO: Drop the draggable element in this new location
        click.fire('Dragging');

        if(typeof EndDrag === "function"){
            //EndDrag(x, y);
        }
    }
};

