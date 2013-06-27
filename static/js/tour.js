$(document).ready(function() {

    var tour = new Tour({
        useLocalStorage: false,
        onEnd: function() {
            bb.set('sys:tour', true);
        }
    });

    tour.addSteps([
        {
            element: '#btn-pomodoro-start',
            title: 'Pomodoro start',
            content: 'Clicking on this button will start a 25mn Pomodoro timer.'
        },
        {
            element: '#btn-shortbreak-start',
            title: 'Short break start',
            content: "When you've worked for 25mn, you deserve a short break."
        },
        {
            element: '#btn-longerbreak-start',
            title: 'Longer break start',
            content: "After 3 or 4 cycles, take a longer break. Go outside, have a coffee, a chat..."
        },
        {
            element: '#pomodoros',
            title: 'Daily Pomodoros',
            content: 'This is your daily Pomodoro counter. Click on (+) to add some, and (-) to decrease the counter.',
            placement: 'left'
        },
        {
            element: '#taskname',
            title: 'Task name',
            content: "By providing a name to the task you've just accomplished, you'll get a better feedback on how you spent your time.",
        },
        {
            element: '#interruptions',
            title: 'Interruptions',
            content: "Here you're taking account of how many times you've been interrupted. It should invalidate the Pomodoro you were into.",
            placement: 'left'
        },
        {
            element: '#sparkline',
            title: 'Graph',
            content: 'This sparkline is showing your 20 last days of work with Pomodoro',
            placement: 'bottom',
            container: '#sparkline'
        },
        {
            element: '#db-operations',
            title: 'Database operations',
            content: "Don't forget to backup your local database. Otherwise you may lose <b>everything</b>."
        }
    ]);
    if (!bb.get('sys:tour'))  // if tour has not been done, start it
        tour.restart();

    $('#btn-start-tour').click(function() {tour.restart();});
});
