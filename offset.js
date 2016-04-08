var setOffset = require('./set-offset');
var strundefined = typeof undefined;
var isWindow = function( obj ) {
	return obj != null && obj === obj.window;
};
/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}
module.exports = function (elem, options) {
    var computedStyle;
    var docElem;
    var win;
    var box;
    var doc;
    if (arguments.length > 1) {
        return options === undefined ? elem : setOffset(elem, options);
    }
    debugger;
    box = {
        top: 0,
        left: 0
    };
    doc = elem && elem.ownerDocument;

    if (!doc) {
        return;
    }

    docElem = doc.documentElement;
    // Make sure it's not a disconnected DOM node
    if (docElem === elem || !docElem.contains(elem)) {
        return box;
    }

    // If we don't have gBCR, just use 0,0 rather than error
    // BlackBerry 5, iOS 3 (original iPhone)
    if (typeof elem.getBoundingClientRect !== strundefined) {
        box = elem.getBoundingClientRect();
    }
    win = getWindow(doc);
    return {
        top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
        left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
    };
}
