// lib.js
// Prototyping the localStorage object
Object.getPrototypeOf(localStorage).dumps = function() {
    return JSON.stringify(this);
};
Object.getPrototypeOf(localStorage).loads = function(str, clear) {
    if (clear == true)
        this.clear();
    var doc = JSON.parse(str);
    for (var key in Object.keys(doc)) {
        this.setItem(key, doc[key]);
    };
};
// startsWith Polyfill
if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        enumerable: false,
        configurable: false,
        writable: false,
        value: function (searchString, position) {
            position = position || 0;
             return this.indexOf(searchString, position) === position;
        }
    });
}
// format Polyfill
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) {
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}
/*
 * zips arrays into one
 */
function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}
