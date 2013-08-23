# Pomodorock

A single webpage pomodoro timer / tracker that keeps **ZERO KNOWLEDGE** of your
data on the server-side.

## License

Pomodorock is distributed under the terms of the [WTFPL](http://www.wtfpl.net/).
See the LICENSE file for more details. But basically, it's almost a Public
Domain thing.

## Requirements

* A modern HTML5-capable browser (canvas, localStorage, <audio> API etc.)
* Optional: A web server

## Usage

### Install options

* Browse [http://brunobord.github.io/pomodorock/](http://brunobord.github.io/pomodorock/),
*  **OR** Put these files on a web server where you can access the "index.html",
*  **OR** Fork the project and host it on your own github pages: ``http://username.github.io/pomodorock``

#### The built-in JS server

You can also install [Node.js](http://nodejs.org) and use the basic server
included with this project. It is a dead simple [Express](http://expressjs.com)
app listening to on port 27000.

Install and enjoy:

    npm install && node server.js
    open http://localhost:27000

#### Python SimpleHTTPServer

Python is awesome ♡.

You can serve this app in a single one command:

    python -m SimpleHTTPServer 27000

(Of course, you can change the port to suit your needs).

### Use

Follow the [Pomodoro Technique](http://www.pomodorotechnique.com/).

* Start your Pomodoro timer.
* Work for 25 mn.
* Increment your Pomodoro daily counter.
* Have a short break (5 mn).
* Each time somebody or something interrupts you, increment the interruption counter.
* Every 3 to 4 Pomodoro cycle, have a longer break. Go outside, do something else.
* Rinse, repeat.

With days of pomodoro logging, you'll see the tiny sparkline graph tracking your
Pomodoro count.

## Under the hood

I'm not storing anything, I promise.

Everything, I mean **EVERYTHING** you put in this tracker is stored locally in
**your** browser localStorage database. Don't worry about your privacy, it's
safe.

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

Just **backup** on the former location before moving to the new one.

### Changing browser / computer

Switching from a browser to another is equivalent to changing this page
location. Not the same profile -> no data. And going from a computer to another
will result the same.

Just **backup** on the former computer before moving to the new one.


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
* [Hourglass Icon](http://thenounproject.com/noun/hour-glass/?dwn=PD&dwn_icon=13030#icon-No13030) by Maico Amorim, from the Noun Project.
* [Bootstrap Tour](http://bootstraptour.com)
