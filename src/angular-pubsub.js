(function (module) {
    'use strict';

    module('PubSub', []).
        factory('PubSub', ['$timeout', function ($timeout) {
            /**
             * Alias a method while keeping the context correct,
             * to allow for overwriting of target method.
             *
             * @param {String} fn The name of the target method.
             * @returns {Function} The aliased method.
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
             * @param topic {String} The topic name.
             * @param callback {Function} Callback function to execute on event.
             * @param once {Boolean} Checks if event will be triggered only one time (optional).
             * @returns number token
             */
            PubSub.subscribe = function (topic, callback, once) {
                var token = (this.subUid += 1),
                    obj = {};

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
             * @param topic {String} The topic name.
             * @param callback {Function} Callback function to execute on event.
             */
            PubSub.subscribeOnce = function (topic, callback) {
                this.subscribe(topic, callback, true);
            };

            /**
             * Publish or broadcast events of interest with a specific
             * topic name and arguments such as the data to pass along.
             *
             * @param topic {String} The topic name.
             * @param args {Object || Array} The data to be passed.
             * @return bool false if topic does not exist.
             * @returns bool true if topic exists and event is published.
             */
            PubSub.publish = function (topic, args) {
                var that = this,
                    subscribers,
                    len;

                if (!this.topics[topic]) {
                    return false;
                }

                $timeout(function () {
                    subscribers = that.topics[topic];
                    len = subscribers ? subscribers.length : 0;

                    while (len) {
                        len -= 1;
                        subscribers[len].callback(topic, args);

                        // Unsubscribe from event based on tokenized reference,
                        // if subscriber's property once is set to true.
                        if (subscribers[len].once === true) {
                            that.unsubscribe(subscribers[len].token);
                        }
                    }
                }, 0);

                return true;
            };

            /**
             * Unsubscribe from a specific topic, based on  the topic name,
             * or based on a tokenized reference to the subscription.
             *
             * @param t {String || Object} Topic name or subscription referenece.
             * @returns {*} bool false if argument passed does not match a subscribed event.
             */
            PubSub.unsubscribe = function (t) {
                var prop,
                    len,
                    tf = false;

                for (prop in this.topics) {
                    if (this.topics.hasOwnProperty(prop)) {
                        if (this.topics[prop]) {
                            len = this.topics[prop].length;

                            while (len) {
                                len -= 1;

                                // If t is a tokenized reference to the subscription.
                                // Removes one subscription from the array.
                                if (this.topics[prop][len].token === t) {
                                    this.topics[prop].splice(len, 1);
                                    return t;
                                }

                                // If t is the event type.
                                // Removes all the subscriptions that match the event type.
                                if (prop === t) {
                                    this.topics[prop].splice(len, 1);
                                    tf = true;
                                }
                            }

                            if (tf === true) {
                                return t;
                            }
                        }
                    }
                }

                return false;
            };

            /**
             * Alias for public methods.
             * subscribe     -> on
             * subscribeOnce -> once
             * publish       -> trigger
             * unsubscribe   -> off
             */
            PubSub.on = alias('subscribe');
            PubSub.once = alias('subscribeOnce');
            PubSub.trigger = alias('publish');
            PubSub.off = alias('unsubscribe');

            return PubSub;
        }]);
}(angular.module));