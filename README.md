Isomorphic JavaScript Tutorial.
===================

This is a small sample app built to demonstrate isomorphic JavaScript concepts.

I'll be using this in some upcoming workshops:

* DevBeat, 12 Nov 2013
* General Assembly, 21 Nov 2013

## Overview

This app shows how to combine a few modules together to build an isomorphic JavaScript app. Each of these modules was built to support both the client and the server, and by creating some small shims around them, we can abstract out the differences to create the same API for both client and server.

We use the following modules:

* [Handlebars](https://github.com/wycats/handlebars.js) (templating)
* [Director](https://github.com/flatiron/director) (routing)
* [Superagent](https://github.com/visionmedia/superagent) (HTTP requests)

## Browserify

The app is tied together with Browserify.

## LICENSE

MIT