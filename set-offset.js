var forEach = require('lodash.foreach');
module.exports = function (el, options) {
    var position = el.style.position;
    var props = {};
    var curPosition;
    var curLeft;
    var curCSSTop;
    var curTop;
    var curOffset;
    var curCSSLeft;
    var calculatePosition;
    var computedStyle;

    // set position first, in-case top/left are set even on static el
    if (position === "static") {
        el.style.position = "relative";
    }
    boundingClientRect = el.getBoundingClientRect();
    curOffset = {
        top: boundingClientRect.top + document.body.scrollTop,
        left: boundingClientRect.top + document.body.scrollLeft,
    };
    curCSSTop = el.style.top;
    curCSSLeft = el.style.left;
    calculatePosition = (position === "absolute" || position === "fixed") && [curCSSTop, curCSSLeft].indexOf('auto') > -1;

    // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
    if (calculatePosition) {
        curTop = el.offsetTop;
        curLeft = el.offsetLeft;
    } else {
        curTop = parseFloat(curCSSTop, 10) || 0;
        curLeft = parseFloat(curCSSLeft, 10) || 0;
    }
    if ('function' === typeof options) {
        options = options.call(el, curOffset);
    }

    if (options.top != null) {
        props.top = (options.top - curOffset.top) + curTop;
    }
    if (options.left != null) {
        props.left = (options.left - curOffset.left) + curLeft;
    }

    if ("using" in options) {
        options.using.call(el, props);
    } else {
        forEach(props, function (value, name) {
            el.style[name] = value + 'px';
        });
    }
    return el;
}
