(function (global) {
    
    'use strict';
    
    var lib = {},
        libraryName = null;
    
    global.namespace = function namespace(ns) {
        if (ns === null) {
            initLibrary();
            return null;
        }
        
        if (!libraryName) {
            initLibrary();
        }
        
        if (arguments.length === 0){
            if (!libraryName)
                lib.error.throw('First call to namespace() must contain library name');
            return lib;
        }
        
        if (typeof ns === 'object') {
            if (findPropertyNameRecursive(lib, ns, libraryName))
                return ns;
            else 
                lib.error.throw('Invalid namespace object');
        }
    
        var parts = ns.split('.'),
            parent = lib,
            part, pl, i;

        pl = parts.length;
        for (i = 0; i < pl; ++i) {
            part = parts[i];
            if (i === 0 && libraryName === null) {
                libraryName = part;
                continue;
            }
            
            if (i === 0 && libraryName === part) {
                continue;
            }
            
            if (typeof parent[parts[i]] === 'undefined') {
                parent[parts[i]] = {};
            }
            parent = parent[parts[i]];
        }

        if (typeof global[libraryName] === 'undefined')
            global[libraryName] = lib;

        return parent;
    };
    
    function initErrorModule() {
        var error = {};
    
        error.Error = function Err() {
            this.message = 'unknown';
            this.originalError = null;
            if (arguments.length>=1) {
                if (typeof arguments[0] === 'string')
                    this.message = arguments[0]
                if (arguments[0] instanceof Error) {
                    this.originalError = arguments[0]
                    this.message = this.originalError.message
                }
            }
        }

        error.Error.prototype = Object.create(Error.prototype, { 
          constructor: { value: error.Error } 
        });

        error.throw = function throwErr(anything) {
            throw new error.Error(anything);
        };
        return error;
    }
    
    function initClassModule() {
        return function (constructor, ns) {
            if (typeof ns === 'undefined')
                lib.error.throw ('Must specify namespace in which to put the class');

            if (typeof constructor !== 'function')
                lib.error.throw ('Class constructor must be a function');

            assureFunctionName(constructor);
            
            if (!constructor.name)
                lib.error.throw ('Can not use anonymus function for constructor');

            var ns = namespace(ns);

            if (ns[constructor.name])
                lib.error.throw ('Class is already defined ' + getCanonicalName(constructor.name));

            ns[constructor.name] = constructor
            return new classHelper(constructor);
        };
    }
    
    function initEventModule() {
        return {
            Event: function Event() {
                this.name = 'UNKNOWN'
                this.target = null;
            },
            EventSupport: {
                on: function on (eventName, eventHandler) {
                    if (!this.eventMap) {
                        this.eventMap = {}
                    }
                    if (!this.eventMap[eventName]) {
                        this.eventMap[eventName] = []
                    }
                    this.eventMap[eventName].push(eventHandler)
                },
                off: function off (eventName, eventHandler) {
                    if (eventHandler)
                        lib.error.throw('Removing specific eventhandler is not implremted, yet')

                    if (!this.eventMap || !this.eventMap[eventName])
                        return;

                    this.eventMap[eventName] = [];
                },
                dispatchEvent: function dispatchEvent (eventName, eventData) {
                    if (!this.eventMap) {
                        this.eventMap = {}
                    }
                    var handlers = this.eventMap[eventName]
                    if (handlers) {
                        var event = new lib.event.Event();
                        event.name = eventName;
                        event.target = this;
                        if (typeof eventData != 'undefined' && eventData !== null) {
                            event.data = eventData;
                        }

                        for (var h=0; h<handlers.length; ++h) {
                            handlers[h](event)
                        }
                    }
                }
            }
        }
    }
    
    function initEventBus() {
        var topics = {};
        
        return {
            subscribe: function subscribe (topic, listener) {
                if ( typeof listener != 'function'){
                    lib.error.throw('Bad subsciption listener');
                }
                 
                if(!topics[topic]) 
                    topics[topic] = [];
                topics[topic].push(listener);
            },

            publish: function publish (topic, data) {
                if(!topics[topic] || topics[topic].length < 1)
                    return;

                topics[topic].forEach(function(listener) {
                    listener(data || {}, topic);
                });
            }
        }
    }
    
    function initUtilModule() {
        return {
            isNullOrUndefined: function isNullOrUndefined(value) {
                return typeof value === 'undefined' || value === null;
            },

            isScalar: function isScalar(value) {
                return (/string|number|boolean/).test(typeof value);
            },

            isWindow: function isWindow( obj ) {
                return obj != null && obj === obj.window;
            },

            isArray: function isArray(obj) {
                if (lib.util.isNullOrUndefined(obj) || lib.util.isScalar(obj)) {
                    return false;
                }
                
                var length = "length" in obj && obj.length,
                    type = typeof obj;

                if ( type === "function" || lib.util.isWindow( obj ) ) {
                    return false;
                }

                if ( obj.nodeType === 1 && length ) {
                    return true;
                }

                return type === "array" || length === 0 ||
                    typeof length === "number" && length > 0 && ( length - 1 ) in obj;
            },
             
            applyDefaults: function extend(defaults, options) {
                var extended = {};
                var prop;
                for (prop in defaults) {
                    if (Object.prototype.hasOwnProperty.call(defaults, prop)) {
                        extended[prop] = defaults[prop];
                    }
                }
                for (prop in options) {
                    if (Object.prototype.hasOwnProperty.call(options, prop)) {
                        extended[prop] = options[prop];
                    }
                }
                return extended;
            },
            
            optionValue: function optionValue(options, parameter, defaultValue) {
                if (lib.util.isNullOrUndefined(options))
                    return defaultValue;

                if (typeof options[parameter] === 'undefined')
                    return defaultValue;

                return options[parameter];
            }
        };
    }

    function initLibrary() {
        
        if (libraryName && typeof global[libraryName] !== 'undefined')
            delete global[libraryName];
        
        lib = {};
        libraryName = null;
        lib.error = initErrorModule();
        lib.class = initClassModule();
        lib.event = initEventModule();
        lib.EventBus = initEventBus();
        lib.util = initUtilModule();
    }
    
    var classHelper = function(constructor) {
        this._cs = constructor;
    }
    
    classHelper.prototype.inherits = function inherits (parentClass){
        parentClass = getConstructor(parentClass);


        // TODO: shomehow Check if already inherited, maybe with this.prototype.super? 
        this._cs.prototype = new parentClass();
        this._cs.prototype.constructor = this._cs;
        this._cs.prototype.super = parentClass.prototype;
        return this;
    }
    
    classHelper.prototype.mixin = function mixin(source) {
        if (typeof source != 'function' && typeof source != 'object') {
            lib.error.throw ('Must mixin with the function');
        }

        if (typeof source === 'function') {
            assureFunctionName(source);
            if (!source.name)
                lib.error.throw ('Can not mixin with anonymus function');
            this._cs.prototype[source.name] = source;
        }
        else {
            for (var prop in source) {
                if (source.hasOwnProperty(prop)) {
                    this.mixin(source[prop]);
                }
            }
        }
        return this;
    }
    
    function getCanonicalName(anything) {
        if (libraryName === null) {
            lib.error.throw ('Can not get class cannonical name, library is not initialized, yet');
        }

        if (!anything)
            lib.error.throw ('Bad name');
        
        assureFunctionName(anything);
        
        var canonicalName = findPropertyNameRecursive(lib, anything, libraryName),
            errorMessage;
        if (canonicalName)
            return canonicalName;
        
        errorMessage = anything.name || anything.toString()
        lib.error.throw('Can not find canonical name for ' + errorMessage);            
    };

    function getConstructor(anything) {
        var canonicalName = getCanonicalName(anything);
        var currentObject = global;
        canonicalName.split('.').forEach(function(pathSegment){
            currentObject = currentObject[pathSegment];
        })
        
        if (typeof currentObject === 'function')
            return currentObject;
            
        lib.error.throw(canonicalName + ' is not a constructor');
    };

    function endsWith(str, suffix) {
        return (typeof str === 'string') && (typeof suffix === 'string') && (str.indexOf(suffix, str.length - suffix.length) !== -1);
    }

    function findPropertyNameRecursive(object, property, path) {
        var prop, pathEx, childProp;
        
        if (typeof object != 'object')
            return null;

        if (typeof property === 'function')
            property = property.name;

        for (var prop in object) {
            if (object.hasOwnProperty(prop)){
                pathEx = path + '.' + prop;
                if (endsWith (pathEx, property) || object[prop] === property)
                    return pathEx;
                else {
                    childProp = findPropertyNameRecursive(object[prop], property, pathEx);
                    if (childProp)
                        return childProp;
                }
            }
        }
        return null;
    }
    
    function assureFunctionName(fn) {
        if (typeof fn === 'function' && typeof fn.name !== 'string') {
            fn.name = fn.toString().match(/^function\s?([^\s(]*)/)[1];
        }
    }
    
})(window);
