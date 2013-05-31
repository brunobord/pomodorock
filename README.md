# Pomodorock

A single webpage pomodoro timer / tracker.

## Requirements

* A web server
* A modern HTML5-capable browser (canvas, localStorage, <audio> API etc.)

## Usage

* Put this files on a web server where you can access the "index.html" page.
* Start your Pomodoro timer.
* Work for 25mn.
* Increment your Pomodoro daily counter.
* Have a break.
* Each time somebody or something interrupts you, increment the interruption counter.

With days of pomodoro logging, you'll see the tiny sparkline graph tracking your
Pomodoro count.

## Under the hood

I'm not storing anything, I promise.

Everything, I mean **EVERYTHING** you put in this tracker is stored locally in
**your** browser localStorage database. Don't worry about your privacy.

## Caution

### Don't mess with the keys/values

You can inspect the localStorage keys and values, but please don't mess with
it or you may lose data. This program is using [BankersBox](https://github.com/twilio/BankersBox)
module to store counters. Any manual operation on it may break something.

### Changing location

The localStorage database is linked to the page URL / Domain. If you're moving
the index file and static resources, it will reset your stats down to zero.
Well, your "old" stats are not gone, they're just still linked to your browser
profile and URL. Simply browsing the old URL will help you find it out again.

### Changing browser / computer

Switching from a browser to another is equivalent to changing this page
location. Not the same profile -> no data. And going from a computer to another
will result the same.

**NOTE** : I know it's a bit annoying. I'm going to address this issue as soon
as possible by allowing users to backup/restore databases.
