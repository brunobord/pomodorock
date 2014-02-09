(function($, app) {

    'use strict';

    app.__version__ = '1.1.1';

    var bb = app.bb;

    var __versions__ = {
        '1.0.1': migrate_1_0_1,
        '1.1.0': migrate_1_1_0,
        '1.1.1': migrate_1_1_1
    };

    function migrate_1_0_1() {
        // v1.0.1 -  goal is to build a set of dates - each time we're adding a
        // pomodoro or an interruption, we're adding this date to the set.
        var regDate = '^([0-9]{4})-([0-9]{2})-([0-9]{2})';
        var i, key, date;
        for (i in bb.keys()) {
            key = bb.keys()[i];
            if (key.match(regDate)) {
                date = key.slice(0, 10);
                bb.sadd('index:dates', date);
            }
        }
        return true;
    }

    function migrate_1_1_0() {
        // v1.1.0 - goal is to get cleaner stats.
        var i, key;
        for (i in bb.keys()) {
            key = bb.keys()[i];
            bb.wipezerotask(key);
        }
        return true;
    }

    function migrate_1_1_1() {
        if (!bb.exists('sys:tour')) {
            bb.set('sys:tour', false);
        }
        return true;
    }

    function migrate() {
        var version, currentVersion, callback;
        if (!bb.exists('db:version')) {
            bb.set('db:version', '1.0.0');
        }
        console.log('Migration starting at: ' + bb.get('db:version'));
        for (version in __versions__) {
            currentVersion = bb.get('db:version');
            if (version > currentVersion) {
                callback = __versions__[version];
                if (callback()) {
                    bb.set('db:version', version);
                }
            }
        }
        console.log('Migration is now: ' + bb.get('db:version'));
        // Check if everything's okay
        if (bb.get('db:version') !== app.__version__) {
            $('#db-migration-alert').show();
        }
        $('#version').html(bb.get('db:version'));
    }

    // Exports
    app.migrate = migrate;

})(jQuery, Pomodorock);
