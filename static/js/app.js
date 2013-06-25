// app.js

// variable initialization
var time = moment().startOf('hour').add('minutes', 25);
var alert_name = "pomodoro";
var interval;
var refreshInterval;
var bb = new BankersBox();

/*
 * Increment counter (pomodoros or interruptions)
 */
function incrementCounter(element) {
    var target = element.attr("data-target");
    var taskname = $('#taskname').val();
    bb.incrementCounter(moment().format('YYYY-MM-DD'), target, taskname);
    refresh();
}

/*
 * Decrement counter
 */
function decrementCounter(element) {
    var target = $(element).attr("data-target");
    var taskname = $('#taskname').val();
    bb.decrementCounter(moment().format('YYYY-MM-DD'), target, taskname);
    refresh();
}

function incrementTask(element) {
    var taskname = $(element).attr('data-target');
    bb.pomodoro(moment().format('YYYY-MM-DD'), taskname);
    refresh();
}
function decrementTask(element) {
    var taskname = $(element).attr('data-target');
    bb.pomodown(moment().format('YYYY-MM-DD'), taskname);
    refresh();
}

/*
 * Helper: get the BankersBox key
 */
function getKey(key) {
    return moment().format('YYYY-MM-DD') + ':' + key;
}

/*
 * Helper: only get the task keys
 */
function getTaskKeys() {
    var regex = /\d{4}-\d{2}-\d{2}:task/;
    var result = [];
    for (var i in bb.keys()) {
        key = bb.keys()[i];
        if (regex.exec(key)) {
            result.push(key);
        }
    }
    return result;
}

// -------- UI section

/*
 * refresh Counter on the webpage
 */
function refreshKey(key) {
    var bb_key = getKey(key);
    bb.sadd('index:dates', moment().format('YYYY-MM-DD'));
    if (!bb.exists(bb_key)) {
        bb.set(bb_key, 0);
    }
    $('#'+key).html(bb.get(bb_key));
}

/*
 * Refresh stats (sparklines)
 */
function getStats() {
    var pomodoros = [];
    var interruptions = [];
    var dates = bb.smembers('index:dates');
    dates.sort();
    dates = dates.slice(-20);
    for (var i in dates) {
        key = dates[i];
        if (bb.exists(key+':pomodoros')) {
            pomodoros.push(bb.get(key+':pomodoros'));
        } else {
            pomodoros.push(0);
        }
        if (bb.exists(key+':interruptions')) {
            interruptions.push(bb.get(key+':interruptions'));
        } else {
            interruptions.push(0);
        }
    }
    var data = zip([pomodoros, interruptions]);
    $('#sparkline').sparkline(data, { type: 'bar' });

    var week_meta = getWeekMeta();

    // get task pomodoros
    var sortable_daily = [];
    var weekly_scores = {};
    var today = moment().format('YYYY-MM-DD');
    var task_keys = getTaskKeys();
    for (var i in task_keys) {
        key = task_keys[i];
        if (key.startsWith(today+':task')) {
            var nb = bb.get(key);
            var taskname = key.replace(today+':task:', '');
            sortable_daily.push([taskname, nb]);
        }
        //
        if (key.slice(0, 10) <= week_meta.end && key.slice(0, 10) >= week_meta.start) {
            var taskname = key.slice(16);
            var value = 0;
            if (taskname in weekly_scores) {
                value = weekly_scores[taskname];
            }
            value += bb.get(key);
            weekly_scores[taskname] = value;
        }
    }

    sortable_daily.sort(function(a, b) { return b[1] - a[1];});
    $('#dailytasks').empty();
    var pattern = '<tr><td>{0}</td><td>{1}</td><td>' +
        '<button class="btn btn-mini btn-danger decr-task" data-target="{0}"><i class="icon icon-minus"></i></button> ' +
        '<button class="btn btn-mini btn-primary incr-task" data-target="{0}"><i class="icon icon-plus"></i></button>' +
        '</td></tr>';
    for (var i in sortable_daily) {
        $('#dailytasks').append(pattern.format(sortable_daily[i][0], sortable_daily[i][1]));
    }
    // Sure, new buttons in the DOM: let's trigger their click event.
    $('.incr-task').click(function() {
        incrementTask(this);
    });
    $('.decr-task').click(function() {
        decrementTask(this);
    });

    // sort weekly scores
    var sortable_weekly = [];
    var weekly_total = 0;
    for (key in weekly_scores) {
        var value = weekly_scores[key];
        sortable_weekly.push([key, value]);
        weekly_total += value;
    }

    sortable_weekly.sort(function(a, b) { return b[1] - a[1];});
    $('#weeklytasks').empty();
    var pattern = '<tr><td>{0}</td><td>{1}</td></tr>';
    for (var i in sortable_weekly) {
        $('#weeklytasks').append(pattern.format(sortable_weekly[i][0], sortable_weekly[i][1]));
    }
    var pattern = '<tr class="info"><td><strong>{0}</strong></td><td><strong>{1}</strong></td></tr>';
    $('#weeklytasks').append(pattern.format('Total', weekly_total));

}

/*
 * Full refresh of the counters and stats on the UI
 */
function refresh() {
    refreshKey('pomodoros');
    refreshKey('interruptions');
    getStats();
}

// -------- Timer section

/*
 * Update timer on the UI
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
    $('#timer-alert-'+alert_name).show();
    var snd = new Audio("./static/vendor/tada.wav");
    snd.play();
    if (window.webkitNotifications) {
        notification = window.webkitNotifications.createNotification(
            './static/img/hourglass.png',
            alert_name.capitalize() + ' is done', $('#timer-alert-'+alert_name).html().sanitize());
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


// Main application
$(document).ready(function() {

    migrate(); // apply migration patches
    refresh(); // refresh UI

    // Event triggers

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
        // This "alert_name" object will be shown when the timer will be over.
        alert_name = $(this).attr('data-alert-name');
        $('#time').html(time.format('mm:ss'));
        // Interval call.
        interval = setInterval("updateTimer()", 1000);
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
