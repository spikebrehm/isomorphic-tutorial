Isomorphic JavaScript Tutorial
===================

This is a small sample app built to demonstrate isomorphic JavaScript concepts.

I'll be using this in some upcoming workshops:

* DevBeat, 12 Nov 2013
* General Assembly, 21 Nov 2013

## Overview

Here we've built the minimum-viable example of an isomorphic JavaScript app: an app that can run on both client and server. Check out Charlie Robbins' [great blog post](http://blog.nodejitsu.com/scaling-isomorphic-javascript-code) on isomorphic JavaScript for some background.

This is a simple Express "blog" app that lists blog posts. Each page is fully rendered on the server, however upon subsequent navigation, we use the HTML5 History API, aka `pushState`, to fetch the data for that page from the API and render the HTML client-side using Handlebars.

## Under the hood

We combine a few modules together to build an isomorphic JavaScript app. Each of these modules was built to support both the client and the server, and by creating some small shims around them, we can abstract out the differences to create the same API for both client and server.

We use the following modules on both client and server:

* [Handlebars](https://github.com/wycats/handlebars.js) (templating)
* [Director](https://github.com/flatiron/director) (routing)
* [Superagent](https://github.com/visionmedia/superagent) (HTTP requests)

On top of a basic [Express](https://github.com/visionmedia/express) app.

## Browserify

The app is tied together with Browserify.

## License

MIT