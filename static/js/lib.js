(function(window, moment, BankersBox) {

    'use strict';

    // The Application Namespace
    var app = window.Pomodorock = {};

    // The Application's BankersBox instance
    var bb = new BankersBox();

    var document = window.document;
    var Object = window.Object;
    var String = window.String;
    var JSON = window.JSON;

    // Prototyping the localStorage object
    Object.getPrototypeOf(localStorage).dumps = function() {
        return JSON.stringify(this, undefined, 3);
    };

    Object.getPrototypeOf(localStorage).loads = function(str, clear) {
        if (clear) this.clear();
        var doc = JSON.parse(str);
        for (var i in Object.keys(doc)) {
            var key = Object.keys(doc)[i];
            this.setItem(key, doc[key]);
        }
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
          return typeof args[number] !== 'undefined' ? args[number] : match;
        });
      };
    }

    String.prototype.capitalize = function(){
        return this.replace( /(^|\s)([a-z])/g , function(m,p1,p2){ return p1+p2.toUpperCase(); } );
    };

    String.prototype.sanitize = function() {
        var temp, sanitized;
        temp = document.createElement("div");
        temp.innerHTML = this;
        sanitized = temp.textContent || temp.innerText;
        return sanitized;
    };

    // Prototyping BankersBox... Because you need to add business intelligence to this.
    // Increment counter, the smarter way
    BankersBox.prototype.incrementCounter = function(date, type, taskname) {
        this.incr(date + ':' + type);
        this.sadd('index:dates', date);
        if (taskname && type === 'pomodoros') {
            this.incr('task:' + taskname);
            this.incr(date + ':task:' + taskname);
        }

    };

    // Little helper for pomodoros
    BankersBox.prototype.pomodoro = function(date, taskname) {
        this.incrementCounter(date, 'pomodoros', taskname);
    };

    // Little helper for interruptions
    BankersBox.prototype.interruption = function(date) {
        this.incrementCounter(date, 'interruptions', null);
    };

    // Decrement counter, the smarter way
    BankersBox.prototype.decrementCounter = function(date, type, taskname) {
        var bbKey = date + ':' + type;
        if (this.get(bbKey) === 0) {
            return;
        }
        this.decr(bbKey);
        if (taskname && type === 'pomodoros') {
            this.decr('task:' + taskname); this.wipezerotask('task:' + taskname);
            this.decr(date + ':task:' + taskname); this.wipezerotask(date + ':task:' + taskname);
        }
    };

    // Pomodown - down on interruptions
    BankersBox.prototype.pomodown = function(date, taskname) {
        this.decrementCounter(date, 'pomodoros', taskname);
    };

    // Little helper for interruptions
    BankersBox.prototype.interrupdown = function(date, taskname) {
        this.decrementCounter(date, 'interruptions', taskname);
    };

    BankersBox.prototype.wipezerotask = function(key) {
        if (key !== undefined && key.indexOf('task:') !== -1 && this.get(key) <= 0) {
            this.del(key);
        }
    };

    /*
     * zips arrays into one
     */
    function zip(arrays) {
        return arrays[0].map(function(_,i){
            return arrays.map(function(array){return array[i];});
        });
    }

    // Time functions
    function getWeekMeta() {
        var result = {};
        var start = moment().startOf('week');
        result.startDate = moment(start.toDate()).add(1, 'day');
        result.endDate = moment(start.toDate()).add(7, 'day');
        result.start = result.startDate.format('YYYY-MM-DD');
        result.end = result.endDate.format('YYYY-MM-DD');
        return result;
    }

    // Exports
    app.bb = bb;
    app.zip = zip;
    app.getWeekMeta = getWeekMeta;

})(window, moment, BankersBox);
