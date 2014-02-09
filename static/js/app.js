(function(window, $, moment, app) {

    'use strict';

    var bb = app.bb;
    var time = moment().startOf('hour').add('minutes', 25);
    var alertName = "pomodoro";
    var interval;

    var document = window.document;
    var localStorage = window.localStorage;

    /**
     * Increments counter (pomodoros or interruptions)
     */
    function incrementCounter(element) {
        var target = element.attr("data-target");
        var taskname = $('#taskname').val();
        bb.incrementCounter(moment().format('YYYY-MM-DD'), target, taskname);
        refresh();
    }

    /**
     * Decrements counter
     */
    function decrementCounter(element) {
        var target = $(element).attr("data-target");
        var taskname = $('#taskname').val();
        bb.decrementCounter(moment().format('YYYY-MM-DD'), target, taskname);
        refresh();
    }

    /**
     * Increments task.
     */
    function incrementTask(element) {
        var taskname = $(element).attr('data-target');
        bb.pomodoro(moment().format('YYYY-MM-DD'), taskname);
        refresh();
    }

    /**
     * Decrements task.
     */
    function decrementTask(element) {
        var taskname = $(element).attr('data-target');
        bb.pomodown(moment().format('YYYY-MM-DD'), taskname);
        refresh();
    }

    /**
     * Gets the BankersBox key.
     */
    function getKey(key) {
        return moment().format('YYYY-MM-DD') + ':' + key;
    }

    /**
     * Only gets the task keys.
     */
    function getTaskKeys() {
        var regex = /\d{4}-\d{2}-\d{2}:task/;
        var result = [];
        var i, key;
        for (i in bb.keys()) {
            key = bb.keys()[i];
            if (regex.exec(key)) {
                result.push(key);
            }
        }
        return result;
    }

    /**
     * Refreshes counter on the webpage
     */
    function refreshKey(key) {
        var bbKey = getKey(key);
        bb.sadd('index:dates', moment().format('YYYY-MM-DD'));
        if (!bb.exists(bbKey)) {
            bb.set(bbKey, 0);
        }
        $('#' + key).html(bb.get(bbKey));
    }

    /**
     * Refreshes stats (sparklines)
     */
    function getStats() {

        var pomodoros = [];
        var interruptions = [];
        var dates = bb.smembers('index:dates');

        var i;
        var key;
        var data;
        var nb;
        var weekMeta;
        var sortableDaily;
        var sortableWeekly;
        var weeklyScores;
        var weeklyTotal;
        var today;
        var taskKeys;
        var value;
        var taskname;
        var pattern;

        dates.sort();
        dates = dates.slice(-20);

        for (i in dates) {
            key = dates[i];
            if (bb.exists(key + ':pomodoros')) {
                pomodoros.push(bb.get(key + ':pomodoros'));
            } else {
                pomodoros.push(0);
            }
            if (bb.exists(key + ':interruptions')) {
                interruptions.push(bb.get(key + ':interruptions'));
            } else {
                interruptions.push(0);
            }
        }

        data = app.zip([pomodoros, interruptions]);
        $('#sparkline').sparkline(data, {type: 'bar'});

        weekMeta      = app.getWeekMeta();
        sortableDaily = [];
        weeklyScores  = {};
        today         = moment().format('YYYY-MM-DD');
        taskKeys      = getTaskKeys();

        for (i in taskKeys) {
            key = taskKeys[i];
            if (key.startsWith(today+':task')) {
                nb = bb.get(key);
                taskname = key.replace(today + ':task:', '');
                sortableDaily.push([taskname, nb]);
            }
            if (key.slice(0, 10) <= weekMeta.end && key.slice(0, 10) >= weekMeta.start) {
                taskname = key.slice(16);
                value = 0;
                if (taskname in weeklyScores) {
                    value = weeklyScores[taskname];
                }
                value += bb.get(key);
                weeklyScores[taskname] = value;
            }
        }

        sortableDaily.sort(function(a, b) {
            return b[1] - a[1];
        });

        $('#dailytasks').empty();

        pattern = '<tr><td>{0}</td><td>{1}</td><td>' +
            '<button class="btn btn-mini btn-danger decr-task" data-target="{0}"><i class="icon icon-minus"></i></button> ' +
            '<button class="btn btn-mini btn-primary incr-task" data-target="{0}"><i class="icon icon-plus"></i></button>' +
            '</td></tr>';

        for (i in sortableDaily) {
            $('#dailytasks').append(pattern.format(sortableDaily[i][0], sortableDaily[i][1]));
        }

        // Sure, new buttons in the DOM: let's trigger their click event.
        $('.incr-task').click(function() {
            incrementTask(this);
        });

        $('.decr-task').click(function() {
            decrementTask(this);
        });

        // sort weekly scores
        sortableWeekly = [];
        weeklyTotal = 0;
        for (key in weeklyScores) {
            value = weeklyScores[key];
            sortableWeekly.push([key, value]);
            weeklyTotal += value;
        }

        sortableWeekly.sort(function(a, b) {
          return b[1] - a[1];
        });

        $('#weeklytasks').empty();
        pattern = '<tr><td>{0}</td><td>{1}</td></tr>';
        for (i in sortableWeekly) {
            $('#weeklytasks').append(pattern.format(sortableWeekly[i][0], sortableWeekly[i][1]));
        }

        pattern = '<tr class="info"><td><strong>{0}</strong></td><td><strong>{1}</strong></td></tr>';
        $('#weeklytasks').append(pattern.format('Total', weeklyTotal));
        $('#weeklymeta').html('From {0} to {1}'.format(weekMeta.startDate.format('DD/MM'), weekMeta.endDate.format('DD/MM')));
    }

    /**
     * Full refresh of the counters and stats on the UI
     */
    function refresh() {
        refreshKey('pomodoros');
        refreshKey('interruptions');
        getStats();
    }

    /**
     * Updates timer on the UI
     */
    function updateTimer() {
        time.subtract(1, 'seconds');
        $('#time').html(time.format('mm:ss'));
        document.title = time.format('mm:ss') + " - Pomodorock";
        if (time.minute() === 0 && time.seconds() === 0) {
            notify();
            resetTimer();
            document.title = "DONE - Pomodorock";
        }
    }

    /*
     * Reset timer
     */
    function resetTimer() {
        $('#time').html('waiting...');
        clearInterval(interval);
    }

    /*
     * Trigger notification (visual and audio)
     */
    function notify() {
        var snd = new Audio("./static/vendor/tada.wav");
        $('#timer-alert-' + alertName).show();
        snd.play();
        if (window.webkitNotifications) {
            notification = window.webkitNotifications.createNotification(
                './static/img/hourglass.png',
                alertName.capitalize() + ' is done', $('#timer-alert-' + alertName).html().sanitize());
            notification.onclose = function() {
                resetInterface();
            };
            notification.show();
        }
    }

    /*
     * Reset the alert interface
     */
    function resetInterface() {
        $('.alert').hide();
        document.title = "Pomodorock";
        resetTimer();
    }

    $(document).ready(function() {

        app.migrate();

        refresh();

        // Start button event
        $('.btn-start').click(function() {
            // Trigger HTML5 notifications
            if (window.webkitNotifications) {
                if (window.webkitNotifications.checkPermission() !== 0) { // 0 is PERMISSION_ALLOWED
                    window.webkitNotifications.requestPermission();
                  }
            }
            // Hide alerts
            $('.alert').hide();
            // initialize timer
            time = moment().startOf('hour').add('minutes', $(this).attr('data-time'));
            // This "alertName" object will be shown when the timer will be over.
            alertName = $(this).attr('data-alert-name');
            $('#time').html(time.format('mm:ss'));
            // Interval call.
            interval = setInterval(updateTimer, 1000);
        });

        // Stop button event
        $('#btn-stop').click(function() {
            resetInterface();
        });

        // Increment button event
        $('.incr').click(function() {
            incrementCounter($(this));
        });

        // Decrement button event
        $('.decr').click(function() {
            decrementCounter($(this));
        });

        // DB Operation button event
        $('#db-operations').click(function() {
            $('.db-operations').toggle();
            $('.on-restore, .on-backup, textarea#dbcontent, .dbcontent').hide();
        });

        // DB Backup button event
        $('#backup').click(function() {
            $('textarea#dbcontent').val(localStorage.dumps()); // DB serialization
            $('.on-restore').hide();
            $('.on-backup, textarea#dbcontent').show();
        });

        // DB Restore "start" button event - display restore interface
        $('#restore-start').click(function() {
            $('.on-backup').hide();
            $('.on-restore, textarea#dbcontent').show();
        });

        // Restore button event.
        $('#restore').click(function() {
            localStorage.loads($('textarea#dbcontent').val());
            bb = new BankersBox(); // magically reloads redis-like database
            refresh();
            $('.on-restore, .on-backup, textarea#dbcontent, .dbcontent').hide();
        });
    });

    // Exports
    app.incrementCounter = incrementCounter;
    app.decrementCounter = decrementCounter;
    app.incrementTask    = incrementTask;
    app.decrementTask    = decrementTask;
    app.getKey           = getKey;
    app.getTaskKeys      = getTaskKeys;
    app.refreshKey       = refreshKey;
    app.getStats         = getStats;
    app.refresh          = refresh;
    app.updateTimer      = updateTimer;
    app.resetTimer       = resetTimer;
    app.notify           = notify;
    app.resetInterface   = resetInterface;

})(window, jQuery, moment, Pomodorock);
