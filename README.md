# angular-PubSub

AngularJS implementation of the [Publish–Subscribe](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern) pattern.

## Installation

### Git installation

`$ git clone https://github.com/georapbox/angular-PubSub.git`

### npm installation

`$ npm install angular-PubSub --save`

### Bower installation
`$ bower install angular.pubsub`

## Using PubSub

### Register
Include `angular-pubsub.js` in your project after `angular.js` and register to your application:
```js
var app = angular.module('app', ['PubSub']);
```

### Inject as dependancey
Inject the service as a dependancy of the application modules, to use it:
```js
var MyController = app.controller('MyController', ['PubSub', function (PubSub) {
  // do your stuff here...
}]);
```

### Subscribing events
The "listener" is the function to be executed when an event is emitted.
```js
function listener(data, topic) {
  console.log('An event is published.');
  console.log(topic);
  console.log(data);
}

// Subscribe to event
var sub = PubSub.subscribe('event-name', listener);

// Subscribe to event and execute only one time
var subOnce = PubSub.subscribeOnce('event-name', listener)
```

### Publishing events
The `publish` method takes two arguments:

- The first one is the name of the event.
- The second one (optional) is the data we may want to pass along as. We can pass data along using an array or an object as shown below.
```js
PubSub.publish('event-name', {prop1: value1, prop2: value2});
```

### Unsubscribing events
There are two ways to unsubscribe an event:

- Unsubscribe from a specific topic based on a tokenized reference to the subscription.
```js
PubSub.unsubscribe(sub);
```
- Unsubscribe from a specific topic based on topic name. This way we can unsubscribe all events with the same name.
```js
PubSub.unsubscribe('event-name');
```

## Methods aliases
- `on` - `subscribe`
- `once` - `subscribeOnce`
- `trigger` - `publish`
- `off` - `unsubscribe`

## Minify

```sh
$ npm run minify
```
