# Pomodorock

A single webpage pomodoro timer / tracker.

## License

Pomodorock is distributed under the terms of the [WTFPL](http://www.wtfpl.net/).
See the LICENSE file for more details. But basically, it's almost a Public
Domain thing.

## Requirements

* A modern HTML5-capable browser (canvas, localStorage, <audio> API etc.)
* Optional: A web server

## Usage

### Install options

* Browse [http://brunobord.github.io/pomodorock/](http://brunobord.github.io/pomodorock/) **OR**
* Put this files on a web server where you can access the "index.html" page **OR**
* Fork the project and host it on github: ``http://username.github.io/pomodorock``

### Use

Follow the [Pomodoro Technique](http://www.pomodorotechnique.com/).

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
it or you may lose data. This program is using [BankersBox](https//github.com/twilio/BankersBox)
module to store counters. Any manual operation on it may break something.

### Changing location

The localStorage database is linked to the page URL / Domain. If you're moving
the index file and static resources, it will reset your stats down to zero.
Well, your "old" stats are not gone, they're just still linked to your browser
profile and URL. Simply browsing the old URL will help you find it out again.

Simply Backup on the former location before moving to the new one.

### Changing browser / computer

Switching from a browser to another is equivalent to changing this page
location. Not the same profile -> no data. And going from a computer to another
will result the same.

Simply Backup on the former computer before moving to the new one.


## Let me help you

We now have a Database *Backup/Restore* feature. The whole localStorage database
can be saved as a simple string of text, and restore.

**SERIOUS WARNING**: Carefully follow the given instructions, or your backup
may be severly damaged. You **MUST** be sure that your copy-paste operation has
kept the backup intact.

---

## Uses and abuses

* [Twitter Bootstrap](http://twitter.github.io/bootstrap/)
* [jQuery](http://jquery.com/)
* [Moment.js](http://momentjs.com/)
* [jQuery sparklines](http://omnipotent.net/jquery.sparkline/)
* [BankersBox](https//github.com/twilio/BankersBox)
* [Tada Audio file](http://www.freesound.org/people/jobro/sounds/60445/) by Jobro (CC-BY License)
* [Font Awesome](http://fortawesome.github.io/Font-Awesome/) Font icons.
