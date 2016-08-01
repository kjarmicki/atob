## A to B
Get from point A to B.

### What is it?
It's an Android app that allows you to specify points on earth and then navigate to them. It doesn't rely on internet connection, just GPS and accelerometer data.

Example use scenario: you're parking your car at the edge of the forest, marking that spot, taking a nice long walk without a care in the world, and then navigating yourself back to that marked point - all without consuming any bandwidth.

### Technologies used
Apache Cordova to wrap webapp code into hybrid app, Node + Babel + Webpack to build it, React to manage views.

### Conclusions
As this is a hobby project made for educational purposes, here are some afterthoughts:
* accelerometer-as-a-compass is unreliable, and gets worse on cheap devices
* React is cool and easy to start with
* so is Apache Cordova for Android
* Webpack is rather heavy and clumsy
* Mocha > Tape for testing, main pain points being: awkward nesting, repeatable requiring and ending tests, lack of output formatter that can both hide passed tests and log errors with stack trace
