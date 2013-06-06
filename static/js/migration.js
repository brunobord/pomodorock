// Migration
// current version
var __version__ = '1.0.1';
var __versions__ = {
    '1.0.1': migrate_1_0_1,
}
function migrate_1_0_1() {
    // v1.0.1 -  goal is to build a set of dates - each time we're adding a
    // pomodoro or an interruption, we're adding this date to the set.
    var regDate = '^([0-9]{4})-([0-9]{2})-([0-9]{2})';
    for (var i in bb.keys()) {
        key = bb.keys()[i];
        if (key.match(regDate)) {
            var date = key.slice(0, 10);
            bb.sadd('index:dates', date);
        }
    }
    return true;
}
function migrate() {
    if (!bb.exists('db:version')) {
        bb.set('db:version', '1.0.0');
    }
    for (var version in __versions__) {
        var current_version = bb.get('db:version');
        if (version > current_version) {
            var callback = __versions__[version];
            if (callback()) {
                bb.set('db:version', version);
            }
        }
    };
    // Check if everything's okay
    if (bb.get('db:version') != __version__) {
        $('#db-migration-alert').show();
    }
    $('#version').html(bb.get('db:version'));
}
