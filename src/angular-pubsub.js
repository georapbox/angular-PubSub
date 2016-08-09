(function (module) {
  'use strict';

  module('PubSub', []).factory('PubSub', ['$timeout', function ($timeout) {
    /**
     * Alias a method while keeping the context correct,
     * to allow for overwriting of target method.
     *
     * @private
     * @this {PubSub}
     * @param {String} fn The name of the target method.
     * @return {function} The aliased method.
     */
    function alias(fn) {
      return function closure () {
        return this[fn].apply(this, arguments);
      };
    }

    var PubSub = {
      topics: {},    // Storage for topics that can be broadcast or listened to.
      subUid: -1     // A topic identifier.
    };

    /**
     * Subscribe to events of interest with a specific topic name and a
     * callback function, to be executed when the topic/event is observed.
     *
     * @this {PubSub}
     * @param {String} topic The topic name.
     * @param {function} callback Callback function to execute on event, taking two arguments:
     *        - {*} data The data passed when publishing an event
     *        - {Object} topic  The topic's info (name & token)
     * @param {Boolean} [once=false] Checks if event will be triggered only one time.
     * @return {Number} The topic's token.
     */
    PubSub.subscribe = function (topic, callback, once) {
      var token = this.subUid += 1,
        obj = {};

      if (typeof callback !== 'function') {
        throw new TypeError('When subscribing for an event, a callback function must be defined.');
      }

      if (!this.topics[topic]) {
        this.topics[topic] = [];
      }

      obj.token = token;
      obj.callback = callback;
      obj.once = !!once;

      this.topics[topic].push(obj);

      return token;
    };

    /**
     * Subscribe to events of interest setting a flag
     * indicating the event will be published only one time.
     *
     * @this {PubSub}
     * @param {String} topic The topic's name.
     * @param {function} callback Callback function to execute on event, taking two arguments:
     *        - {*} data The data passed when publishing an event
     *        - {Object} topic The topic's info (name & token)
     * @return {Number} The topic's token.
     */
    PubSub.subscribeOnce = function (topic, callback) {
      return this.subscribe(topic, callback, true);
    };

    /**
     * Publish or broadcast events of interest with a specific
     * topic name and arguments such as the data to pass along.
     *
     * @this {PubSub}
     * @param {String} topic The topic's name.
     * @param {*} [data] The data to be passed.
     * @return {Boolean} True if topic exists and event is published; otherwise false.
     */
    PubSub.publish = function (topic, data) {
      var that = this,
        len, subscribers, currentSubscriber, token;

      if (!this.topics[topic]) {
        return false;
      }

      $timeout(function () {
        subscribers = that.topics[topic];
        len = subscribers ? subscribers.length : 0;

        while (len) {
          len -= 1;
          token = subscribers[len].token;
          currentSubscriber = subscribers[len];

          currentSubscriber.callback(data, {
            name: topic,
            token: token
          });

          // Unsubscribe from event based on tokenized reference,
          // if subscriber's property once is set to true.
          if (currentSubscriber.once === true) {
            that.unsubscribe(token);
          }
        }
      }, 0);

      return true;
    };

    /**
     * Unsubscribe from a specific topic, based on the topic name,
     * or based on a tokenized reference to the subscription.
     *
     * @this {PubSub}
     * @param {String|Object} topic Topic's name or subscription referenece.
     * @return {Boolean|String} False if `topic` does not match a subscribed event, else the topic's name.
     */
    PubSub.unsubscribe = function (topic) {
      var tf = false,
        prop, len;

      for (prop in this.topics) {
        if (Object.hasOwnProperty.call(this.topics, prop)) {
          if (this.topics[prop]) {
            len = this.topics[prop].length;

            while (len) {
              len -= 1;

              // If t is a tokenized reference to the subscription.
              // Removes one subscription from the array.
              if (this.topics[prop][len].token === topic) {
                this.topics[prop].splice(len, 1);
                return topic;
              }

              // If t is the event type.
              // Removes all the subscriptions that match the event type.
              if (prop === topic) {
                this.topics[prop].splice(len, 1);
                tf = true;
              }
            }

            if (tf === true) {
              return topic;
            }
          }
        }
      }

      return false;
    };

    // Alias for public methods.
    PubSub.on = alias('subscribe');
    PubSub.once = alias('subscribeOnce');
    PubSub.trigger = alias('publish');
    PubSub.off = alias('unsubscribe');

    return PubSub;
  }]);
}(angular.module));
