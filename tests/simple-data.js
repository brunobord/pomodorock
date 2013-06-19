// test fixtures
localStorage.clear();
// 7th
bb.pomodoro("2013-06-07", 'hello');
bb.pomodoro("2013-06-07", 'hello');
bb.interruption("2013-06-07");
// 8th
bb.pomodoro("2013-06-08", 'hello');
bb.pomodoro("2013-06-08", 'world');
bb.interruption("2013-06-08");
bb.interruption("2013-06-08");
bb.interruption("2013-06-08");
refresh();
