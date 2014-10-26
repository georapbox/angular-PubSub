angular-PubSub
==============

AngularJS implementation of the [Publish–Subscribe pattern](http://en.wikipedia.org/wiki/Publish%E2%80%93subscribe_pattern).

##Installation
- Include <code>angular-pubsub.js</code> in your project after <code>angular.js</code>.
- Register to your application: 
```js
var app = angular.module('app', ['PubSub']);
```

##Bower Installation
<code>bower install angular.pubsub</code>

##Using PubSub

### Inject as dependancey
Inject the service as a dependancy of the application modules, to use it:
```js
var MyController = app.controller('MyController', ['PubSub', function (PubSub) {
	// do your stuff here...
}]);
```

###Subscribing events
The "listener" is the function to be executed when an event is emitted.
```js
function listener(topic, data) {
    console.log('An event is published.');
    console.log(topic);
    console.log(data);
}

// Subscribe to event
var sub = PubSub.subscribe('event-name', listener);

// Subscribe to event and execute only one time
var subOnce = PubSub.subscribeOnce('event-name', listener)
```

###Publishing events
The <code>publish</code> method takes two arguments:

- The first one is the name of the event.
- The second one (optional) is the data we may want to pass along as. We can pass data along using an array or an object as shown below.
```js
PubSub.publish('event-name', {
    prop1: value1,
    prop2: value2
});
```

###Unsubscribing events
There are two ways to unsubscribe an event:

- Unsubscribe from a specific topic based on a tokenized reference to the subscription.
```js
PubSub.unsubscribe(sub);
```
- Unsubscribe from a specific topic based on topic name. This way we can unsubscribe all events with the same name.
```js
PubSub.unsubscribe('event-name);
```

##Methods aliases
- <code>on</code> - <code>subscribe</code>
- <code>once</code> - <code>subscribeOnce</code>
- <code>trigger</code> - <code>publish</code>
- <code>off</code> - <code>unsubscribe</code>

##Minify
To minify the project, run <code>grunt build</code> command. This will run the removelogging and uglify the code into <code>dist/angular-pubsub.min.js</code>.

##License
This code is [MIT](http://opensource.org/licenses/mit-license.php) licenced:

Copyright (c) 2014 George Raptis

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.